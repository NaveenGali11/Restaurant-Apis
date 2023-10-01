import mongoose, { Document, Schema } from "mongoose";

interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  restaurant: mongoose.Types.ObjectId;
  items: {
    menuItem: mongoose.Types.ObjectId;
    quantity: number;
    price: number;
  }[];
  totalPrice: number;
  status: "pending" | "confirmed" | "delivered";
  deliveryAddress: mongoose.Types.ObjectId;
}

const orderSchema = new Schema<IOrder>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" },
    items: [
      {
        menuItem: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem" },
        quantity: { type: Number, required: true, default: 1 },
        price: { type: Number, required: true },
      },
    ],
    totalPrice: { type: Number },
    status: {
      type: String,
      enum: ["pending", "confirmed", "delivered"],
      required: true,
    },
    deliveryAddress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model<IOrder>("Order", orderSchema);
