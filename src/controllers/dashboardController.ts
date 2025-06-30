import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import Item from "../models/ItemModel.js";
import { ITEM_STATUS } from "../utils/constants.js";

export const getDashboardStats = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user || !req.user.userId) {
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Unauthorized user." });
      return;
    }

    const userId = req.user.userId;
    const { from, to } = req.query;

    const dateFilter: any = {};
    if (from || to) {
      dateFilter.createdAt = {};
      if (from) dateFilter.createdAt.$gte = new Date(from as string);
      if (to) dateFilter.createdAt.$lte = new Date(to as string);
    }

    const baseFilter = {
      createdBy: userId,
      ...dateFilter,
    };

    const acceptedItems = await Item.find({
      ...baseFilter,
      itemStatus: ITEM_STATUS.ACCEPTED,
    });

    const totalAcceptedItems = acceptedItems.length;
    const totalEarnings = acceptedItems.reduce((sum, item) => {
      return sum + ((item.price || 0) - (item.op || 0));
    }, 0);

    const totalPendingItems = await Item.countDocuments({
      ...baseFilter,
      itemStatus: ITEM_STATUS.PENDING,
    });

    const totalRejectedItems = await Item.countDocuments({
      ...baseFilter,
      itemStatus: ITEM_STATUS.DECLINED,
    });

    const monthlyEarnings = await Item.aggregate([
      {
        $match: {
          createdBy: userId,
          itemStatus: ITEM_STATUS.ACCEPTED,
          ...(dateFilter.createdAt ? { createdAt: dateFilter.createdAt } : {}),
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          earnings: { $sum: { $subtract: ["$price", "$op"] } },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
      {
        $project: {
          year: "$_id.year",
          month: "$_id.month",
          earnings: 1,
          _id: 0,
        },
      },
    ]);

    res.status(StatusCodes.OK).json({
      totalAcceptedItems,
      totalPendingItems,
      totalRejectedItems,
      totalEarnings,
      monthlyEarnings,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Failed to load dashboard stats." });
  }
};
