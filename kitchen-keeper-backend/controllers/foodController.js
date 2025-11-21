const Food = require("../models/food");
const FoodEvent = require("../models/foodEvent");

exports.getFoods = async (req, res) => {
  const foods = await Food.find({ userId: req.user.id, isActive: true }).sort({
    expDate: 1,
  });
  res.json(foods);
};

exports.addFood = async (req, res) => {
  console.log("Request user ID:", req.user.id);
  const newFood = new Food({
    ...req.body,
    userId: req.user.id,
  });
  await newFood.save();
  res.status(201).json(newFood);
};

exports.updateFood = async (req, res) => {
  const updated = await Food.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    req.body,
    { new: true }
  );
  res.json(updated);
};

exports.deleteFood = async (req, res) => {
  await Food.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
  res.status(204).end();
};

// helper
async function finalizeItem(req, res, eventType) {
  try {
    const userId = req.user.id; // or from token
    const { id } = req.params;

    const item = await Food.findOne({ _id: id, userId });

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // 1) create event
    await FoodEvent.create({
      userId,
      foodItemId: item._id,
      type: eventType,
      quantity: item.quantity,
      date: new Date(),
    });

    // 2) soft delete the item
    item.isActive = false;
    await item.save();

    res.json({
      message: `Item marked as ${eventType.toLowerCase()}`,
      itemId: item._id,
      type: eventType,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

exports.consumeItem = (req, res) => finalizeItem(req, res, "CONSUMED");
exports.wasteItem = (req, res) => finalizeItem(req, res, "WASTED");
