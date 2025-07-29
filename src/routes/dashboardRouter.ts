import { Router } from "express";
import { getDashboardStats } from "../controllers/dashboardController.js";
import { getAllUsers, updateUser } from "../controllers/adminController.js";
import {
  authenticateUser,
  authorizePermissions,
} from "../middleware/authMiddleWare.js";

const router = Router();

router.route("/").get(getDashboardStats);
router
  .route("/admin/users")
  .get(authenticateUser, authorizePermissions("admin"), getAllUsers);
router.patch(
  "/admin/user/:id",
  authenticateUser,
  authorizePermissions("admin"),
  updateUser
);

export default router;
