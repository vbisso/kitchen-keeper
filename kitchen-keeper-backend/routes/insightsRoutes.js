const express = require("express");
const router = express.Router();
const FoodEvent = require("../models/foodEvent");
const FoodItem = require("../models/food");
const auth = require("../middleware/authMiddleware");
const mongoose = require("mongoose");

//this uses the auth middleware for all routes
router.use(auth);
// GET /insights
router.get("/", async (req, res) => {
  const userId = req.user.id;

  try {
    // Count consumed & wasted
    const consumed = await FoodEvent.countDocuments({
      userId,
      type: "CONSUMED",
    });
    const wasted = await FoodEvent.countDocuments({ userId, type: "WASTED" });

    const wasteRate =
      consumed + wasted === 0
        ? 0
        : Math.round((wasted / (consumed + wasted)) * 100);

    // On-time consumption
    const consumedEvents = await FoodEvent.find({
      userId,
      type: "CONSUMED",
    }).populate("foodItemId");

    let onTime = 0;
    consumedEvents.forEach((ev) => {
      if (
        ev.foodItemId &&
        new Date(ev.date) <= new Date(ev.foodItemId.expDate)
      ) {
        onTime++;
      }
    });

    const onTimeRate =
      consumedEvents.length === 0
        ? 0
        : Math.round((onTime / consumedEvents.length) * 100);

    // Most consumed

    const mostConsumed = await FoodEvent.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          type: "CONSUMED",
        },
      },

      {
        $lookup: {
          from: "foods",
          localField: "foodItemId",
          foreignField: "_id",
          as: "item",
        },
      },

      {
        $unwind: {
          path: "$item",
          preserveNullAndEmptyArrays: false,
        },
      },

      {
        $group: {
          _id: "$item.name",
          count: { $sum: 1 },
        },
      },

      { $sort: { count: -1 } },
      { $limit: 5 },

      {
        $project: {
          name: "$_id",
          count: 1,
          _id: 0,
        },
      },
    ]);

    // Most wasted
    const mostWasted = await FoodEvent.aggregate([
      {
        $match: { userId: new mongoose.Types.ObjectId(userId), type: "WASTED" },
      },

      {
        $lookup: {
          from: "foods",
          localField: "foodItemId",
          foreignField: "_id",
          as: "item",
        },
      },

      {
        $unwind: {
          path: "$item",
          preserveNullAndEmptyArrays: false,
        },
      },

      {
        $group: {
          _id: "$item.name",
          count: { $sum: 1 },
        },
      },

      { $sort: { count: -1 } },
      { $limit: 5 },

      {
        $project: {
          name: "$_id",
          count: 1,
          _id: 0,
        },
      },
    ]);

    console.log("MOST CONSUMED:", mostConsumed);
    console.log("MOST WASTED:", mostWasted);

    res.json({
      wasteRate,
      onTimeRate,
      mostConsumed,
      mostWasted,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
