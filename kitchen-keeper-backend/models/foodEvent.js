const mongoose = require("mongoose");

const FoodEventSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    foodItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Food",
      required: true,
    },

    type: {
      type: String,
      enum: ["CONSUMED", "WASTED", "ADDED", "UPDATED"],
      required: true,
    },

    quantity: { type: Number, default: 1 },

    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FoodEvent", FoodEventSchema);
