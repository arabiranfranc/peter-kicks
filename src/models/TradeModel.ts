import mongoose, { Schema } from "mongoose";
import { ITEM_WEAR } from "../utils/constants.js";

const TradeSchema = new Schema(
  {
    userOne: { type: Schema.Types.ObjectId, ref: "User", required: true },
    userTwo: { type: Schema.Types.ObjectId, ref: "User", required: true },

    userOneItems: [
      {
        _id: false,
        itemId: {
          type: Schema.Types.ObjectId,
          ref: "TradeItems",
          required: true,
        },
        name: String,
        img: String,
        price: Number,
        size: String,
        details: String,
      },
    ],
    userTwoItems: [
      {
        _id: false,
        itemId: {
          type: Schema.Types.ObjectId,
          ref: "TradeItems",
          required: true,
        },
        itemWear: {
          label: {
            type: String,
            enum: Object.values(ITEM_WEAR),
            required: true,
          },
          wearValue: {
            type: Number,
            required: true,
            min: 0,
            max: 1,
          },
        },
        name: String,
        img: String,
        price: Number,
        size: String,
        details: String,
      },
    ],

    userOneTotalPrice: { type: Number, required: true },
    userTwoTotalPrice: { type: Number, required: true },
    shippingAddress: { type: String, required: true },

    status: {
      type: String,
      enum: ["pending", "accepted", "declined"],
      default: "pending",
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        ret.tradeId = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

const Trade = mongoose.model("Trades", TradeSchema);
export default Trade;
