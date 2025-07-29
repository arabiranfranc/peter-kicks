import { Router } from "express";
import {
  createTradeOffer,
  deleteTradeOffer,
  getUserTradeOffers,
  updateTradeOffer,
} from "../controllers/tradeController.js";
import { upload } from "../middleware/cloudinaryMulterMiddleware.js"; // multer config
import {
  validateItemIdParam,
  validateTradeItemInput,
} from "../middleware/validationMiddleware.js";

const router = Router();

// Upload up to 5 images from form key `images`
router
  .route("/")
  .get(getUserTradeOffers)
  .post(upload.array("images", 5), validateTradeItemInput, createTradeOffer);

router
  .route("/trade-offer/:id")
  .patch(updateTradeOffer)
  .delete(deleteTradeOffer);

export default router;
