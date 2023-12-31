const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String, required: true },
    role: {
      type: String,
      enum: ["customer", "owner", "admin"],
      required: true,
      default: "customer",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
