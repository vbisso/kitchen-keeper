const User = require("../models/users");
const bcrypt = require("bcryptjs");

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    console.log("REQ BODY:", req.body);

    const { firstName, lastName, email, password, notifyDaysBefore } = req.body;

    const updateFields = {};

    const userId = req.body.id || req.user.id;
    if (firstName) updateFields.firstName = firstName;
    if (lastName) updateFields.lastName = lastName;
    if (email) updateFields.email = email;
    if (notifyDaysBefore !== undefined) {
      updateFields.notifyDaysBefore = notifyDaysBefore;
    }

    if (password && password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      updateFields.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true }
    ).select("-password");

    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not update user" });
  }
};
