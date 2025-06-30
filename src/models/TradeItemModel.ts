import mongoose, { Document, Schema, Types } from "mongoose";
import { ITEM_STATUS, ITEM_WEAR } from "../utils/constants.js";
import { IUser } from "./UserModel.js";

interface TradeItemWear {
  label: (typeof ITEM_WEAR)[keyof typeof ITEM_WEAR];
  wearValue: number;
}

export interface TradeItemDoc extends Document {
  _id: string;
  name: string;
  size: string;
  price: number;
  details?: string;
  itemStatus: (typeof ITEM_STATUS)[keyof typeof ITEM_STATUS];
  itemWear: TradeItemWear;
  createdBy: Types.ObjectId | IUser;
  img?: string;
  imgPublicId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TradeItemSchema = new Schema<TradeItemDoc>(
  {
    name: { type: String, required: true },
    size: { type: String, required: true },
    price: { type: Number, required: true },
    details: { type: String },
    itemStatus: {
      type: String,
      enum: Object.values(ITEM_STATUS),
      default: ITEM_STATUS.PENDING,
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
    img: { type: String },
    imgPublicId: { type: String },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.itemId = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
    id: false,
  }
);

export default mongoose.model<TradeItemDoc>("TradeItems", TradeItemSchema);
