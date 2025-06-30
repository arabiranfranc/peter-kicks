import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import Order from "../models/OrderModel.js";
import Item, { ItemDoc } from "../models/ItemModel.js";
import { ITEM_STATUS } from "../utils/constants.js";

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
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
    });
  }
};

export const updateOrderStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const userId = req.user?.userId;

    const allowedStatuses = Object.values(ITEM_STATUS);
    if (!allowedStatuses.includes(status)) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: "Invalid status value",
        allowed: allowedStatuses,
      });
      return;
    }

    const order = await Order.findById(orderId).populate("items.itemId");
    if (!order) {
      res.status(StatusCodes.NOT_FOUND).json({ message: "Order not found" });
      return;
    }

    const unauthorizedItems = order.items.filter(
      (item: any) => item.itemId?.createdBy?.toString() !== userId
    );

    if (unauthorizedItems.length > 0) {
      res.status(StatusCodes.FORBIDDEN).json({
        message: "You can only update orders containing your own items",
      });
      return;
    }

    order.status = status;
    await order.save();

    if (status !== ITEM_STATUS.DECLINED && status !== ITEM_STATUS.CANCELLED) {
      const itemIds = order.items.map((item: any) => item.itemId._id);
      await Item.updateMany(
        { _id: { $in: itemIds } },
        { $set: { itemStatus: status } }
      );
    }

    res.status(StatusCodes.OK).json({
      message:
        status === ITEM_STATUS.DECLINED || status === ITEM_STATUS.CANCELLED
          ? "Order status updated (items remain pending)"
          : "Order and item statuses updated successfully",
      order,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
    });
  }
};
