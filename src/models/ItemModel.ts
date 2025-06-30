import mongoose, { Document, Schema, Types } from "mongoose";
import { ITEM_STATUS, ITEM_WEAR } from "../utils/constants.js";
import { IUser } from "./UserModel.js";

interface ItemWear {
  label: (typeof ITEM_WEAR)[keyof typeof ITEM_WEAR];
  wearValue: number;
}

export interface ItemDoc extends Document {
  _id: string;
  name: string;
  size: string;
  srp: number;
  price: number;
  op: number;
  details?: string;
  discount?: number;
  itemStatus: (typeof ITEM_STATUS)[keyof typeof ITEM_STATUS];
  itemWear: ItemWear;
  createdBy: Types.ObjectId | IUser;
  img?: string;
  imgPublicId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ItemSchema = new Schema<ItemDoc>(
  {
    name: { type: String, required: true },
    size: { type: String, required: true },
    srp: { type: Number, required: true },
    price: { type: Number, required: true },
    op: { type: Number, required: true },
    details: { type: String },
    discount: { type: Number },
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
    id: false, // This disables the automatic "id" virtual field
  }
);

export default mongoose.model<ItemDoc>("Items", ItemSchema);
