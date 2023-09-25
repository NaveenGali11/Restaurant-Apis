const mongoose = require("mongoose");

const favouritesModel = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Favourite", favouritesModel);
