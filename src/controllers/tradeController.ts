import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import mongoose from "mongoose";
import Trade from "../models/TradeModel.js";
import TradeItem from "../models/TradeItemModel.js";
import { ITEM_WEAR } from "../utils/constants.js";

const getWearLabel = (wearValue: number): string => {
  if (wearValue === 0) return ITEM_WEAR.BRAND_NEW;
  if (wearValue <= 0.25) return ITEM_WEAR.VNDS;
  if (wearValue <= 0.75) return ITEM_WEAR.UIGC;
  return ITEM_WEAR.BEATERS;
};

export const createTradeOffer = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user || !req.user.userId) {
      res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized." });
      return;
    }

    const userTwoId = req.user.userId;
    const { shippingAddress, userOneItemIds, userTwoItemsData } = req.body;

    const parsedItemIds: string[] = JSON.parse(userOneItemIds);
    if (!Array.isArray(parsedItemIds) || parsedItemIds.length === 0) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "No item IDs provided." });
      return;
    }

    const userOneItemsInDB = await TradeItem.find({
      _id: { $in: parsedItemIds },
    });

    if (userOneItemsInDB.length !== parsedItemIds.length) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: "Some items were not found in the database.",
      });
      return;
    }

    const firstOwnerId = userOneItemsInDB[0].createdBy.toString();
    const allSameOwner = userOneItemsInDB.every(
      (item) => item.createdBy.toString() === firstOwnerId
    );

    if (!allSameOwner) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: "All trade items must be owned by the same user.",
      });
      return;
    }

    if (firstOwnerId === userTwoId.toString()) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: "You cannot trade with your own items.",
      });
      return;
    }

    const userOneItems = userOneItemsInDB.map((item) => ({
      itemId: item._id,
      name: item.name,
      price: item.price,
      img: item.img,
    }));

    const userOneTotalPrice = userOneItems.reduce(
      (sum: number, item) => sum + (item.price || 0),
      0
    );

    const parsedUserTwoItems: {
      name: string;
      price: number;
      size: string;
      details: string;
      itemWearValue: number;
    }[] = JSON.parse(userTwoItemsData);

    const files = req.files as Express.Multer.File[];

    if (files.length !== parsedUserTwoItems.length) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: "Each userTwo item must have a corresponding image.",
      });
      return;
    }

    const userTwoItems = parsedUserTwoItems.map((item, idx) => {
      const wearValue = item.itemWearValue;
      const wearLabel = getWearLabel(wearValue);

      return {
        itemId: new mongoose.Types.ObjectId(),
        name: item.name,
        price: item.price,
        size: item.size,
        details: item.details,
        itemWear: {
          label: wearLabel,
          wearValue: wearValue,
        },
        img: files[idx]?.filename || null,
      };
    });

    const userTwoTotalPrice = userTwoItems.reduce(
      (sum: number, item) => sum + (item.price || 0),
      0
    );

    const trade = new Trade({
      userOne: firstOwnerId,
      userTwo: userTwoId,
      userOneItems,
      userTwoItems,
      userOneTotalPrice,
      userTwoTotalPrice,
      shippingAddress,
    });

    await trade.save();

    res.status(StatusCodes.CREATED).json({
      message: "Trade offer submitted successfully.",
      trade,
    });
  } catch (err) {
    console.error("Trade offer error:", err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Failed to create trade offer.",
    });
  }
};

export const getUserTradeOffers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      res.status(StatusCodes.BAD_REQUEST).json({ msg: "Invalid MongoDB ID" });
      return;
    }

    const objectUserId = new mongoose.Types.ObjectId(userId);

    const trades = await Trade.find({
      $or: [{ userOne: objectUserId }, { userTwo: objectUserId }],
    })
      .sort({ createdAt: -1 })
      .lean(); // optional for faster response if you don't need methods

    res.status(StatusCodes.OK).json(trades);
  } catch (error) {
    console.error("getUserTradeOffers error:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Failed to retrieve user trades." });
  }
};
export const updateTradeOffer = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user || !req.user.userId) {
      res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized." });
      return;
    }

    const { status } = req.body;

    const updatedTradeOffer = await Trade.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate("userOne userTwo");

    if (!updatedTradeOffer) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Trade offer not found." });
      return;
    }

    if (status === "accepted") {
      const allItemIds = [
        ...updatedTradeOffer.userOneItems.map((item) => item.itemId),
      ];

      await TradeItem.updateMany(
        { _id: { $in: allItemIds } },
        { $set: { itemStatus: "accepted" } }
      );
    }

    res.status(StatusCodes.OK).json({ tradeOffer: updatedTradeOffer });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong." });
  }
};

export const deleteTradeOffer = async (
  req: Request,
  res: Response
): Promise<void> => {
  const trade = await Trade.findByIdAndDelete(req.params.id);

  res
    .status(StatusCodes.OK)
    .json({ message: "Trade Offer deleted successfully", trade });
};
