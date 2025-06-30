import mongoose, { Schema } from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        _id: false,
        itemId: {
          type: Schema.Types.ObjectId,
          ref: "Items",
          required: true,
        },
        name: String,
        img: String,
        price: Number,
      },
    ],
    totalPrice: { type: Number, required: true },
    shippingAddress: { type: String, required: true },
    paymentMethod: { type: String, required: true },
    status: {
      type: String,
      enum: [
        "pending",
        "shipped",
        "delivered",
        "cancelled",
        "completed",
        "accepted",
        "declined",
      ],
      default: "pending",
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.orderId = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
    id: false, // This disables the automatic "id" virtual field
  }
);

const Order = mongoose.model("Order", OrderSchema);

export default Order;
