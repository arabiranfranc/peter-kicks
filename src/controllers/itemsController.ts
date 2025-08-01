import { Request, Response } from "express";
import Item from "../models/ItemModel.js";
import { StatusCodes } from "http-status-codes";
import { ITEM_WEAR } from "../utils/constants.js";

export const getAllItems = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      name,
      minPrice,
      maxPrice,
      minSize,
      maxSize,
      itemWear, // can be string or array
    } = req.query;

    const query: any = {
      itemStatus: "pending", // Only return pending items
    };

    // Name search
    if (name && typeof name === "string") {
      query.name = { $regex: name, $options: "i" };
    }

    // Price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Size range
    if (minSize || maxSize) {
      query.size = {};
      if (minSize) query.size.$gte = Number(minSize);
      if (maxSize) query.size.$lte = Number(maxSize);
    }

    // Item wear (can be multiple checkboxes)
    if (itemWear) {
      if (Array.isArray(itemWear)) {
        query["itemWear.label"] = { $in: itemWear };
      } else {
        query["itemWear.label"] = itemWear;
      }
    }

    const items = await Item.find(query).populate("createdBy", "name");

    res.status(StatusCodes.OK).json({ items });
  } catch (error) {
    console.error("Error fetching filtered items:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Failed to fetch items" });
  }
};

export const getAllItemsLoggedInUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.user?.userId;
  const items = await Item.find({ createdBy: userId }).populate(
    "createdBy",
    "name"
  );
  res.status(StatusCodes.OK).json({ items });
};

const getWearLabel = (rawWearValue: number | string): string => {
  const wearValue = parseFloat(String(rawWearValue));

  if (wearValue === 0) return ITEM_WEAR.BRAND_NEW;
  if (wearValue >= 0.01 && wearValue <= 0.25) return ITEM_WEAR.VNDS;
  if (wearValue >= 0.26 && wearValue <= 0.75) return ITEM_WEAR.UIGC;
  return ITEM_WEAR.BEATERS;
};

export const createItem = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { srp, price } = req.body;

    req.body.createdBy = req.user?.userId;

    const discount =
      srp > 0 ? Number((((price - srp) / srp) * 100).toFixed(2)) : 0;
    req.body.discount = discount;

    req.body.itemWear.label = getWearLabel(req.body.itemWear.wearValue);
    console.log(req.body.itemWear.wearValue);

    if (req.file && req.file.path && req.file.filename) {
      req.body.img = req.file.path;
      req.body.imgPublicId = req.file.filename;
    }

    const item = await Item.create(req.body);

    res.status(StatusCodes.CREATED).json({ item });
  } catch (error: any) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

export const getItem = async (req: Request, res: Response): Promise<void> => {
  const item = await Item.findById(req.params.id);
  if (!item) {
    res.status(StatusCodes.NOT_FOUND);
    return;
  }

  res.status(StatusCodes.OK).json({ item });
};

export const updateItem = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, size, srp, price, itemStatus, itemWear, details } = req.body;

  const discount =
    srp > 0 ? Number((((price - srp) / srp) * 100).toFixed(2)) : 0;

  const updatedItem = await Item.findByIdAndUpdate(
    req.params.id,
    {
      name,
      size,
      srp,
      price,
      details,
      itemStatus,
      itemWear,
      discount,
      ...(req.file && {
        img: req.file.path,
        imgPublicId: req.file.filename,
      }),
    },
    { new: true, runValidators: true }
  );

  res.status(StatusCodes.OK).json({ item: updatedItem });
};

export const deleteItem = async (
  req: Request,
  res: Response
): Promise<void> => {
  const item = await Item.findByIdAndDelete(req.params.id);

  res
    .status(StatusCodes.OK)
    .json({ message: "Item deleted successfully", item });
};
