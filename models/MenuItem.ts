import mongoose, { Document, Schema } from "mongoose";

interface IMenuItem extends Document {
  name: string;
  description: string;
  price: number;
  category?: string;
  restaurant: mongoose.Types.ObjectId;
  images?: string[];
  status?: "available" | "not-available";
}

const menuItemSchema = new Schema<IMenuItem>(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: String,
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" },
    images: [String],
    status: {
      type: String,
      enum: ["available", "not-available"],
      default: "available",
    },
  },
  { timestamps: true }
);

export const MenuItem = mongoose.model<IMenuItem>("MenuItem", menuItemSchema);
