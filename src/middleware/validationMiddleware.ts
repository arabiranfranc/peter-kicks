import {
  body,
  validationResult,
  ValidationChain,
  param,
  Meta,
} from "express-validator";
import { Request, Response, NextFunction } from "express";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../errors/customErrors.js";
import { ITEM_STATUS, ITEM_WEAR } from "../utils/constants.js";
import mongoose from "mongoose";
import Item from "../models/ItemModel.js";
import User from "../models/UserModel.js";

export const withValidationErrors = (validateValues: ValidationChain[]) => {
  return [
    ...validateValues,
    (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg);
        throw new BadRequestError(errorMessages.join(", "));
      }
      next();
    },
  ];
};

export const validateItemInput = withValidationErrors([
  body("name").notEmpty().withMessage("name is required"),
  body("size").notEmpty().withMessage("size is required"),
  body("srp")
    .notEmpty()
    .withMessage("SRP is required")
    .isFloat({ gt: 0 })
    .withMessage("SRP must be a number greater than 0"),
  body("price")
    .notEmpty()
    .withMessage("price is required")
    .isFloat({ gt: 0 })
    .withMessage("price must be a number greater than 0"),
  body("itemStatus")
    .optional()
    .isIn(Object.values(ITEM_STATUS))
    .withMessage("invalid status value"),
  body("itemWear.wearValue")
    .notEmpty()
    .withMessage("item wear value is required")
    .isFloat({ min: 0, max: 1 })
    .withMessage("wear value must be between 0 and 1"),
]);

export const validateItemIdParam = withValidationErrors([
  param("id").custom(async (value, { req }) => {
    const isValidMongoId = mongoose.Types.ObjectId.isValid(value);
    if (!isValidMongoId) throw new BadRequestError("invalid MongoDB id");
    const item = await Item.findById(value);
    if (!item) throw new NotFoundError(`no item with id ${value}`);
    const isAdmin = req.user.role === "admin";
    const isOwner = req.user.userId === item.createdBy.toString();
    if (!isAdmin && !isOwner)
      throw new UnauthorizedError("not authorized to access this route");
  }),
]);

export const validateTradeItemInput = withValidationErrors([
  body("name").notEmpty().withMessage("name is required"),
  body("size").notEmpty().withMessage("size is required"),
  body("price")
    .notEmpty()
    .withMessage("price is required")
    .isFloat({ gt: 0 })
    .withMessage("price must be a number greater than 0"),
  body("itemStatus")
    .optional()
    .isIn(Object.values(ITEM_STATUS))
    .withMessage("invalid status value"),
  body("itemWear.wearValue")
    .notEmpty()
    .withMessage("item wear value is required")
    .isFloat({ min: 0, max: 1 })
    .withMessage("wear value must be between 0 and 1"),
]);

export const validateTradeOfferInput = withValidationErrors([
  body("userOneItemIds")
    .notEmpty()
    .withMessage("userOneItemIds is required")
    .custom((value) => {
      let parsed;
      try {
        parsed = JSON.parse(value);
      } catch {
        throw new Error("userOneItemIds must be valid JSON");
      }
      if (!Array.isArray(parsed) || parsed.length === 0) {
        throw new Error("userOneItemIds must be a non-empty array");
      }
      for (const id of parsed) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
          throw new Error(`Invalid item ID: ${id}`);
        }
      }
      return true;
    }),

  body("userTwoItemsData")
    .notEmpty()
    .withMessage("userTwoItemsData is required")
    .custom((value, { req }) => {
      let parsed;
      try {
        parsed = JSON.parse(value);
      } catch {
        throw new Error("userTwoItemsData must be valid JSON");
      }
      if (!Array.isArray(parsed) || parsed.length === 0) {
        throw new Error("userTwoItemsData must be a non-empty array");
      }

      // Validate fields of each item
      for (const [index, item] of parsed.entries()) {
        if (!item.name) {
          throw new Error(`Item at index ${index} is missing a name`);
        }
        if (
          typeof item.price !== "number" ||
          isNaN(item.price) ||
          item.price <= 0
        ) {
          throw new Error(
            `Item at index ${index} must have a valid price greater than 0`
          );
        }
      }

      // Optional: validate number of files matches number of items
      if (req.files && Array.isArray(req.files)) {
        if (req.files.length !== parsed.length) {
          throw new Error("Each userTwo item must have a corresponding image");
        }
      }

      return true;
    }),

  body("shippingAddress")
    .notEmpty()
    .withMessage("shippingAddress is required")
    .isLength({ min: 5 })
    .withMessage("shippingAddress must be at least 5 characters long"),
]);

export const validateRegisterInput = withValidationErrors([
  body("name")
    .notEmpty()
    .withMessage("name is required")
    .isLength({ min: 2 })
    .withMessage("firstname is too short"),
  body("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invalid email format")
    .custom(async (email) => {
      const user = await User.findOne({ email });
      if (user) {
        throw new BadRequestError("email already exists");
      }
    }),
  body("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 8 })
    .withMessage("password must be at least 8 characters long"),
  body("location").notEmpty().withMessage("location is required"),
  body("lastName")
    .notEmpty()
    .withMessage("last name is required")
    .isLength({ min: 2 })
    .withMessage("lastname is too short"),
]);

export const validateLoginInput = withValidationErrors([
  body("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invalid email format"),
  body("password").notEmpty().withMessage("password is required"),
]);

const validateUpdateUserInput = withValidationErrors([
  body("name").notEmpty().withMessage("name is required"),
  body("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invalid email format")
    .custom(async (email, { req }) => {
      const user = await User.findOne({ email });
      if (user && user._id.toString() !== req.user.userId) {
        throw new Error("email already exists");
      }
    }),
  body("lastName").notEmpty().withMessage("last name is required"),
  body("location").notEmpty().withMessage("location is required"),
]);
