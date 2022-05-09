const mongoose = require("mongoose");

const SessionSchema = new mongoose.Schema({
  totalModulesStudied: {
    type: Number,
    required: true,
  },
  averageScore: {
    type: Number,
    required: true,
  },
  timeStudied: {
    type: Number,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
});

//module export
module.exports = new mongoose.model("Session", SessionSchema);
