import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import User from "../models/UserModel.js";
import Item from "../models/ItemModel.js";

export const getCurrentUser = async (req: Request, res: Response) => {
  const user = await User.findOne({ _id: req.user?.userId });
  const userWithoutPassword = user?.toJSON();
  res.status(StatusCodes.OK).json({ user: userWithoutPassword });
};

export const getApplicationStats = async (req: Request, res: Response) => {
  const users = await User.countDocuments();
  const items = await Item.countDocuments();
  res.status(StatusCodes.OK).json({ users, items });
};

export const updateUser = async (req: Request, res: Response) => {
  const updatedUser = await User.findByIdAndUpdate(req.user?.userId, req.body);
  res.status(StatusCodes.OK).json({ msg: "user updated" });
};
