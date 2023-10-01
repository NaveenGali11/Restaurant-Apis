import mongoose, { Document, Schema } from "mongoose";

interface IReview extends Document {
  user: mongoose.Types.ObjectId;
  restaurant: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
}

const reviewSchema = new Schema<IReview>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

export const Review = mongoose.model<IReview>("Review", reviewSchema);
