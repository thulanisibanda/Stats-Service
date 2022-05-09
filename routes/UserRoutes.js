const express = require("express");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const errorHandler = require("../errorHandler");

const router = express.Router();

// create new user for testing
router.post(
  "/newUser",
  errorHandler(async (req, res) => {
    const { name } = req.body;
    const user = new User({ name });
    await user.save();
    res.send({
      name: user.name,
      userId: user._id,
    });
  })
);

module.exports = router;
