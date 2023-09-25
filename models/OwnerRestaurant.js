const mongoose = require("mongoose");

const ownerRestaurantSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" },
    role: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("OwnerRestaurant", ownerRestaurantSchema);
