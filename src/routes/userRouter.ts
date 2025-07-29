import { Router } from "express";
import {
  getCurrentUser,
  getApplicationStats,
} from "../controllers/userController.js";
import { authorizePermissions } from "../middleware/authMiddleWare.js";

const router = Router();

router.get("/current-user", getCurrentUser);
router.get("/admin/app-stats", [
  authorizePermissions("admin"),
  getApplicationStats,
]);
export default router;
