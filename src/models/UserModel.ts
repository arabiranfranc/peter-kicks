import mongoose, { Types, Document, Schema } from "mongoose";

export type UserRole = "user" | "admin" | "seller";

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  lastName: string;
  location: string;
  role: UserRole;
  birthday?: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  lastName: {
    type: String,
    default: "lastName",
  },
  location: {
    type: String,
    default: "my city",
  },
  role: {
    type: String,
    enum: ["user", "admin", "seller"] as UserRole[],
    default: "user",
  },
  birthday: {
    type: Date,
    required: true,
  },
});

UserSchema.methods.toJSON = function () {
  var obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.model<IUser>("User", UserSchema);
