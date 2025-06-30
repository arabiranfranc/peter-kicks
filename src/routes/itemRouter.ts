import { Router } from "express";
import {
  getAllItems,
  createItem,
  getItem,
  updateItem,
  deleteItem,
} from "../controllers/itemsController.js";
import { upload } from "../middleware/cloudinaryMulterMiddleware.js";
import {
  validateItemIdParam,
  validateItemInput,
} from "../middleware/validationMiddleware.js";

const router = Router();

router
  .route("/")
  .get(getAllItems)
  .post(upload.single("img"), validateItemInput, createItem);

router
  .route("/:id")
  .get(validateItemIdParam, getItem)
  .patch(
    upload.single("img"),
    validateItemInput,
    validateItemIdParam,
    updateItem
  )
  .delete(validateItemIdParam, deleteItem);
export default router;
