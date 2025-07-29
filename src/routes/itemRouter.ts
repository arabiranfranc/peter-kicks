import { Router } from "express";
import {
  getAllItems,
  createItem,
  getItem,
  updateItem,
  deleteItem,
  getAllItemsLoggedInUser,
} from "../controllers/itemsController.js";
import { upload } from "../middleware/cloudinaryMulterMiddleware.js";
import {
  validateItemIdParam,
  validateItemInput,
} from "../middleware/validationMiddleware.js";
import {
  authenticateUser,
  authorizePermissions,
} from "../middleware/authMiddleWare.js";

const router = Router();

router.route("/").get(getAllItems);

router
  .route("/user-shop")
  .get(authenticateUser, getAllItemsLoggedInUser)
  .post(
    upload.single("img"),
    authenticateUser,
    authorizePermissions("admin", "seller"),
    validateItemInput,
    createItem
  );
router
  .route("/user-shop/:id")
  .get(validateItemIdParam, getItem)
  .patch(
    upload.single("img"),
    authenticateUser,
    authorizePermissions("admin", "seller"),
    validateItemInput,
    validateItemIdParam,
    updateItem
  )
  .delete(
    authenticateUser,
    authorizePermissions("admin", "seller"),
    validateItemIdParam,
    deleteItem
  );

export default router;
