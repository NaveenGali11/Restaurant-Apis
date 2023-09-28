const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
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

module.exports = mongoose.model("Restaurants", restaurantSchema);
