import { Request, Response } from "express";
import TradeItem from "../models/TradeItemModel.js";
import { StatusCodes } from "http-status-codes";
import { ITEM_WEAR } from "../utils/constants.js";

export const getAllTradeItems = async (
  req: Request,
  res: Response
): Promise<void> => {
  const items = await TradeItem.find().populate("createdBy", "name");
  res.status(StatusCodes.OK).json({ items });
};

const getWearLabel = (wearValue: number): string => {
  if (wearValue === 0) return ITEM_WEAR.BRAND_NEW;
  if (wearValue <= 0.25) return ITEM_WEAR.VNDS;
  if (wearValue <= 0.75) return ITEM_WEAR.UIGC;
  return ITEM_WEAR.BEATERS;
};

export const createTradeItem = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    req.body.createdBy = req.user?.userId;
    req.body.itemWear.label = getWearLabel(req.body.itemWear.wearValue);

    if (req.file && req.file.path && req.file.filename) {
      req.body.img = req.file.path;
      req.body.imgPublicId = req.file.filename;
    }

    const item = await TradeItem.create(req.body);

    res.status(StatusCodes.CREATED).json({ item });
  } catch (error: any) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

export const getTradeItem = async (
  req: Request,
  res: Response
): Promise<void> => {
  const item = await TradeItem.findById(req.params.id);
  if (!item) {
    res.status(StatusCodes.NOT_FOUND);
    return;
  }

  res.status(StatusCodes.OK).json({ item });
};

export const updateTradeItem = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, size, price, itemStatus, itemWear, details } = req.body;

  const updatedItem = await TradeItem.findByIdAndUpdate(
    req.params.id,
    {
      name,
      size,
      price,
      details,
      itemStatus,
      itemWear,
      ...(req.file && {
        img: req.file.path,
        imgPublicId: req.file.filename,
      }),
    },
    { new: true, runValidators: true }
  );

  res.status(StatusCodes.OK).json({ item: updatedItem });
};

export const deleteTradeItem = async (
  req: Request,
  res: Response
): Promise<void> => {
  const item = await TradeItem.findByIdAndDelete(req.params.id);
  res
    .status(StatusCodes.OK)
    .json({ message: "Item deleted successfully", item });
};
