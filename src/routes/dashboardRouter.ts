import { Router } from "express";
import { getDashboardStats } from "../controllers/dashboardController.js";

const router = Router();

router.route("/").get(getDashboardStats);

export default router;
