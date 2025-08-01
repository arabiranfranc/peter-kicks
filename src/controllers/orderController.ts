import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import Order from "../models/OrderModel.js";
import Item, { ItemDoc } from "../models/ItemModel.js";
import { ITEM_STATUS } from "../utils/constants.js";

interface UpdateOrderStatusBody {
  status: "accepted" | "cancelled" | "in_transit" | "completed";
  forceComplete?: boolean;
}

export const createOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { cartItems, shippingAddress, paymentMethod } = req.body;
    const userId = req.user?.userId;

    if (
      !userId ||
      !cartItems ||
      !Array.isArray(cartItems) ||
      cartItems.length === 0
    ) {
      res.status(400).json({ message: "Invalid or missing order data." });
      return;
    }

    const itemIds = cartItems.map((item: { itemId: string }) => item.itemId);
    const items: ItemDoc[] = await Item.find({ _id: { $in: itemIds } });

    if (items.length !== cartItems.length) {
      res.status(400).json({ message: "One or more items not found." });
      return;
    }

    const ownsAnyItem = items.some(
      (item) => item.createdBy.toString() === userId
    );
    if (ownsAnyItem) {
      res
        .status(403)
        .json({ message: "You cannot checkout your own item(s)." });
      return;
    }

    let totalPrice = 0;
    const orderItems = items.map((product) => {
      totalPrice += product.price;
      return {
        itemId: product._id,
        name: product.name,
        img: product.img,
        price: product.price,
      };
    });

    const newOrder = new Order({
      user: userId,
      items: orderItems,
      totalPrice,
      shippingAddress,
      paymentMethod,
      status: "pending",
      itemsCount: orderItems.length,
    });

    const savedOrder = await newOrder.save();

    res.status(StatusCodes.CREATED).json({
      message: "Order created successfully",
      order: savedOrder.toJSON(),
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
    });
  }
};

export const getAllOrders = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;

    // Fetch all orders and populate first item's seller
    const orders = await Order.find()
      .populate({
        path: "items.itemId",
        select: "createdBy name",
      })
      .populate("user", "name email");

    const filteredOrders = orders.filter((order) => {
      const isBuyer = order.user?._id.toString() === userId;
      const firstItem = order.items[0]?.itemId;
      const isSeller = firstItem && firstItem.createdBy?.toString() === userId;
      return isBuyer || isSeller;
    });

    res.status(StatusCodes.OK).json({
      message: "Orders fetched successfully",
      orders: filteredOrders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
    });
  }
};

export const getSingleOrder = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate("user", "name email");

    if (!order) {
      res.status(StatusCodes.NOT_FOUND).json({ message: "Order not found" });
      return;
    }

    res.status(StatusCodes.OK).json({
      message: "Order fetched successfully",
      order,
      itemsCount: order.items.length,
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
    });
  }
};

export const updateOrderStatus = async (
  req: Request<{ orderId: string }, {}, UpdateOrderStatusBody>,
  res: Response
): Promise<void> => {
  try {
    const { orderId } = req.params;
    const { status, forceComplete = false } = req.body;
    const userId = req.user?.userId;

    const order = await Order.findById(orderId)
      .populate("user", "id")
      .populate("items.itemId", "createdBy");

    if (!order) {
      res.status(StatusCodes.NOT_FOUND).json({ message: "Order not found" });
      return;
    }

    if (!order.user) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Order user not populated" });
      return;
    }

    const isBuyer = order.user._id.toString() === userId;
    const isSeller = order.items.some(
      (item: any) => item.itemId.createdBy.toString() === userId
    );

    switch (status) {
      case "accepted":
        if (!isSeller) {
          res.status(403).json({ message: "Only seller can accept the order" });
          return;
        }
        if (order.status !== "pending") {
          res.status(400).json({ message: "Order must be pending to accept" });
          return;
        }
        order.status = "accepted";
        break;

      case "cancelled":
        if (!(isSeller || isBuyer)) {
          res.status(403).json({ message: "Unauthorized" });
          return;
        }
        if (!["pending", "accepted"].includes(order.status as string)) {
          res
            .status(400)
            .json({ message: "Cannot cancel after delivery has started" });
          return;
        }
        order.status = "cancelled";
        break;

      case "in_transit":
        if (!isSeller) {
          res
            .status(403)
            .json({ message: "Only seller can mark as in transit" });
          return;
        }
        if (order.status !== "accepted") {
          res.status(400).json({ message: "Order must be accepted first" });
          return;
        }
        order.status = "in_transit";
        break;

      case "completed":
        if (!(isSeller || isBuyer)) {
          res.status(403).json({ message: "Unauthorized" });
          return;
        }

        if (order.status !== "in_transit") {
          res
            .status(400)
            .json({ message: "Order must be in transit before completing." });
          return;
        }

        if (forceComplete && isSeller) {
          order.status = "completed";
        } else {
          if (isBuyer) order.buyerConfirmed = true;
          if (isSeller) order.sellerConfirmed = true;

          if (order.buyerConfirmed && order.sellerConfirmed) {
            order.status = "completed";
          } else {
            await order.save();
            res.status(202).json({
              message:
                "Waiting for both buyer and seller to confirm completion",
              order,
            });
            return;
          }
        }
        break;

      default:
        res.status(400).json({ message: "Invalid status transition" });
        return;
    }

    await order.save();

    if (
      ["accepted", "in_transit", "completed"].includes(order.status as string)
    ) {
      const itemIds = order.items.map((item: any) => item.itemId._id);
      await Item.updateMany(
        { _id: { $in: itemIds } },
        { $set: { itemStatus: order.status } }
      );
    }

    res.status(200).json({
      message: `Order status updated to ${order.status}`,
      order,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
    });
  }
};
