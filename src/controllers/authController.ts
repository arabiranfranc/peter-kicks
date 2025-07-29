import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import User from "../models/UserModel.js";
import { hashPassword, comparePassword } from "../utils/passwordUtils.js";
import { UnauthenticatedError } from "../errors/customErrors.js";
import { createJWT } from "../utils/tokenUtils.js";
import * as dotenv from "dotenv";
dotenv.config();

const ADMIN_SECRET: string = process.env.ADMIN_SECRET!;

export const register = async (req: Request, res: Response) => {
  try {
    const hashedPassword = await hashPassword(req.body.password);
    req.body.password = hashedPassword;

    if (req.body.secretKey && req.body.secretKey === ADMIN_SECRET) {
      req.body.role = "admin";
    } else {
      req.body.role = "user";
    }

    const user = await User.create(req.body);
    res.status(StatusCodes.CREATED).json({ msg: "user created" });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Server Error" });
  }
};

export const login = async (req: Request, res: Response) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) throw new UnauthenticatedError("invalid credentials");

  const isValidUser =
    user && (await comparePassword(req.body.password, user.password));
  if (!isValidUser) throw new UnauthenticatedError("invalid credentials");
  const token = createJWT({ userId: user._id, role: user.role });
  const oneDay = 1000 * 60 * 60 * 24;
  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === "production",
  });
  res.cookie("isLoggedIn", "true", {
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  res.status(StatusCodes.OK).json({ msg: "user logged in" });
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  res.clearCookie("isLoggedIn", {
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  res.status(200).json({ msg: "user logged out" });
};
