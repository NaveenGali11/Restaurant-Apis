import mongoose, { Document, Schema } from "mongoose";

interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  profilePicture: string;
  role: "customer" | "owner" | "admin";
}

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String, required: true },
    role: {
      type: String,
      enum: ["customer", "owner", "admin"],
      required: true,
      default: "customer",
    },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", userSchema);
