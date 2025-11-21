const express = require("express");
const router = express.Router();
const FoodEvent = require("../models/foodEvent");
const FoodItem = require("../models/food");
const auth = require("../middleware/authMiddleware");

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
      { $match: { userId: userId, type: "CONSUMED" } },
      { $group: { _id: "$foodItemId", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "fooditems",
          localField: "_id",
          foreignField: "_id",
          as: "item",
        },
      },
      { $unwind: "$item" },
      { $project: { name: "$item.name", count: 1 } },
    ]);

    // Most wasted
    const mostWasted = await FoodEvent.aggregate([
      { $match: { userId: userId, type: "WASTED" } },
      { $group: { _id: "$foodItemId", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "fooditems",
          localField: "_id",
          foreignField: "_id",
          as: "item",
        },
      },
      { $unwind: "$item" },
      { $project: { name: "$item.name", count: 1 } },
    ]);

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
