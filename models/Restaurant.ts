import mongoose, { Document, Schema } from "mongoose";

interface IRestaurant extends Document {
  name: string;
  description: String;
  location: mongoose.Types.ObjectId;
  cusine: string;
  owner: mongoose.Types.ObjectId;
  menu: mongoose.Types.ObjectId[];
  reviews: mongoose.Types.ObjectId[];
  images: string[];
}

const restaurantSchema = new Schema<IRestaurant>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: mongoose.Schema.Types.ObjectId, ref: "Location" },
    cusine: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    menu: [{ type: mongoose.Schema.Types.ObjectId, ref: "MenuItem" }],
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    images: [String],
  },
  { timestamps: true }
);

export const Restaurant = mongoose.model<IRestaurant>(
  "Restaurant",
  restaurantSchema
);
