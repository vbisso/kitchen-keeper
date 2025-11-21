const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema(
  {
    name: String,
    quantity: Number,
    unit: String,
    category: String,
    expDate: Date,
    view: String,
    // userId: { type: String, required: true }, // Or ObjectId if referencing another collection String,
    userId: {
      type: mongoose.Schema.Types.ObjectId, // Or ObjectId if referencing another collection
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Food", foodSchema);
