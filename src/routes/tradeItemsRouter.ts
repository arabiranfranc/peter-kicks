import { Router } from "express";
import {
  getAllTradeItems,
  createTradeItem,
  getTradeItem,
  updateTradeItem,
  deleteTradeItem,
} from "../controllers/tradeItemsController.js";

import { upload } from "../middleware/cloudinaryMulterMiddleware.js";
import {
  validateItemIdParam,
  validateTradeItemInput,
  validateTradeOfferInput,
} from "../middleware/validationMiddleware.js";

const router = Router();

router
  .route("/")
  .get(getAllTradeItems)
  .post(upload.single("img"), validateTradeItemInput, createTradeItem);

router
  .route("/:id")
  .get(validateItemIdParam, getTradeItem)
  .patch(
    upload.single("img"),
    validateTradeItemInput,
    validateItemIdParam,
    updateTradeItem
  )
  .delete(validateItemIdParam, deleteTradeItem);

export default router;
