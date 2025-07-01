import { Router } from "express";
import {
  getAllTradeItems,
  createTradeItem,
  getTradeItem,
  updateTradeItem,
  deleteTradeItem,
} from "../controllers/tradeItemsController.js";
import {
  createTradeOffer,
  deleteTradeOffer,
  getUserTradeOffers,
  updateTradeOffer,
} from "../controllers/tradeController.js";
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
  .route("/trade-offer")
  .get(getUserTradeOffers)
  .post(upload.array("images", 5), validateTradeOfferInput, createTradeOffer);

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

router
  .route("/trade-offer/:id")
  .patch(updateTradeOffer)
  .delete(deleteTradeOffer);
export default router;
