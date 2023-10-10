import mongoose, { Document, Model, Schema } from "mongoose";

interface IAddress extends Document {
  user: mongoose.Types.ObjectId;
  line1: string;
  line2?: string;
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  type: "home" | "work" | "other";
}

const addressSchema = new Schema<IAddress>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    line1: { type: String, required: true },
    line2: { type: String },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    type: { type: String, enum: ["home", "work", "other"], required: true },
    country: { type: String, required: true },
  },
  { timestamps: true }
);

export const Address: Model<IAddress> = mongoose.model<IAddress>(
  "Address",
  addressSchema
);
