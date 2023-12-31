const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema(
    {
        name: {type: String, required: true},
        description: {type: String},
        price: {type: Number, required: true},
        category: String,
        restaurant: {type: mongoose.Schema.Types.ObjectId, ref: "Restaurant"},
        images: [String],
        status: {
            type: String,
            enum: ["available", "not-available"],
            default: "available"
        }
    },
    {timestamps: true}
);

module.exports = mongoose.model("MenuItem", menuItemSchema);
