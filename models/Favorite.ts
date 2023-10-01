import mongoose, { Document, Model, Schema } from "mongoose";

interface IFavorite extends Document {
  user: mongoose.Types.ObjectId;
  restaurant: mongoose.Types.ObjectId;
}

const favoritesModel = new Schema<IFavorite>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" },
  },
  { timestamps: true }
);

export const Favorite: Model<IFavorite> = mongoose.model<IFavorite>(
  "Favorite",
  favoritesModel
);
