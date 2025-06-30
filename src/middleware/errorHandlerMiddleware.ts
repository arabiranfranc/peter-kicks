import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

interface CustomError extends Error {
  statusCode?: number;
}

const errorHandlerMiddleware = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  const msg = err.message || "Something went wrong, try again later";

  res.status(statusCode).json({ msg });
};

export default errorHandlerMiddleware;
