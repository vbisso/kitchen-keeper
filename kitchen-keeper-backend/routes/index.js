const foodRouter = require("./foodRoutes.js");
const authRouter = require("./authRoutes.js");
const userRouter = require("./userRoutes.js");
const visionRouter = require("./visionRoutes.js");
const insightsRouter = require("./insightsRoutes.js");

const express = require("express");
const router = express.Router();

router.use("/foods", foodRouter);
router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/vision", visionRouter);
router.use("/insights", insightsRouter);
module.exports = router;
