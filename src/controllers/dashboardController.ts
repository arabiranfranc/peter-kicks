import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import Item from "../models/ItemModel.js";
import Order from "../models/OrderModel.js";
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

    const completedOrders = await Item.find({
      ...baseFilter,
      itemStatus: ITEM_STATUS.COMPLETED,
    });

    const totalCompletedOrders = completedOrders.length;
    const totalEarnings = completedOrders.reduce((sum, item) => {
      return sum + ((item.price || 0) - (item.op || 0));
    }, 0);

    const totalPendingOrders = await Item.countDocuments({
      ...baseFilter,
      itemStatus: ITEM_STATUS.PENDING,
    });

    const totalRejectedOrders = await Item.countDocuments({
      ...baseFilter,
      itemStatus: ITEM_STATUS.DECLINED,
    });

    const monthlyEarnings = await Item.aggregate([
      {
        $match: {
          createdBy: userId,
          itemStatus: ITEM_STATUS.COMPLETED,
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

    // 🟩 Total itemsCount from completed orders where user is the seller
    const completedOrdersFromOrders = await Order.find({
      status: ITEM_STATUS.COMPLETED,
    }).populate("items.itemId", "createdBy");

    let totalItemsCount = 0;
    for (const order of completedOrdersFromOrders) {
      const userItems = order.items.filter(
        (item: any) => item.itemId?.createdBy?.toString() === userId
      );
      totalItemsCount += userItems.length;
    }

    res.status(StatusCodes.OK).json({
      totalCompletedOrders,
      totalPendingOrders,
      totalRejectedOrders,
      totalEarnings,
      monthlyEarnings,
      totalItemsCount, // 👈 Added in response
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Failed to load dashboard stats." });
  }
};
