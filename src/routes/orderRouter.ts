import { Router } from "express";
import {
  createOrder,
  getAllOrders,
  getSingleOrder,
  updateOrderStatus,
  //   getUserOrders,
  //   updateOrderStatus,
  //   deleteOrder,
} from "../controllers/orderController.js";

const router = Router();

router.route("/").get(getAllOrders).post(createOrder);
router.route("/:orderId").get(getSingleOrder).patch(updateOrderStatus);
// router.get("/", getAllOrders);
// router.get("/:id", getOrderById);
// router.get("/user/:userId", getUserOrders);
// router.put("/:id", updateOrderStatus);
// router.delete("/:id", deleteOrder);

export default router;
