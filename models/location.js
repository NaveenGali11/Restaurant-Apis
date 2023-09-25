const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    latitude: { type: Number },
    longitude: { type: Number },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Location", locationSchema);
