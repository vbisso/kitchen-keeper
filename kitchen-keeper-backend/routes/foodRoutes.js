const express = require("express");
const router = express.Router();
const controller = require("../controllers/foodController");
const auth = require("../middleware/authMiddleware");

//this uses the auth middleware for all routes
router.use(auth);

router.get("/", controller.getFoods);
router.post("/", controller.addFood);
router.put("/:id", controller.updateFood);
router.delete("/:id", controller.deleteFood);
router.post("/:id/consume", controller.consumeItem);
router.post("/:id/waste", controller.wasteItem);

module.exports = router;
