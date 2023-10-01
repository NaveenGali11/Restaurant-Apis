import mongoose, { Document, Model, Schema } from "mongoose";

interface ILocation extends Document {
  address: string;
  latitude: number;
  longitude: number;
}

const locationSchema = new Schema<ILocation>(
  {
    address: { type: String, required: true },
    latitude: { type: Number },
    longitude: { type: Number },
  },
  {
    timestamps: true,
  }
);

export const Location: Model<ILocation> = mongoose.model<ILocation>(
  "Location",
  locationSchema
);
