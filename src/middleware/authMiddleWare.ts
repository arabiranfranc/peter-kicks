import { Request, Response, NextFunction } from "express";
import {
  UnauthenticatedError,
  UnauthorizedError,
} from "../errors/customErrors.js";
import { verifyJWT } from "../utils/tokenUtils.js";

export type UserRole = "user" | "admin" | "seller";

interface DecodedToken {
  userId: string;
  role: string;
}

declare module "express" {
  interface Request {
    user?: DecodedToken;
  }
}

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { token } = req.cookies;
  if (!token) {
    throw new UnauthenticatedError("authentication invalid");
  }

  try {
    const decoded = verifyJWT(token) as DecodedToken;
    const { userId, role } = decoded;
    req.user = { userId, role };
    next();
  } catch (error) {
    throw new UnauthenticatedError("authentication invalid");
  }
};

export const authorizePermissions = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role as UserRole)) {
      throw new UnauthorizedError("Unauthorized to access this route");
    }
    next();
  };
};
