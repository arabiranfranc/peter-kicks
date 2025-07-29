import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import User from "../models/UserModel.js";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({}, "name email phone location role");
    res.status(StatusCodes.OK).json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Failed to fetch users",
    });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const updatedUser = await User.findByIdAndUpdate(req.user?.userId, req.body);
  res.status(StatusCodes.OK).json({ msg: "user updated" });
};
