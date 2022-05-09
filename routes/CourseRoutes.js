const express = require("express");
const mongoose = require("mongoose");
const Course = mongoose.model("Course");
const Session = mongoose.model("Session");
const errorHandler = require("../errorHandler");

const router = express.Router();

//creating a new course for testing
router.post(
  "/newCourse",
  errorHandler(async (req, res) => {
    const { name } = req.body;
    const course = new Course({ name });
    await course.save();
    res.json({
      name: course.name,
      courseId: course._id,
    });
  })
);

//getting course stats
router.get(
  "/:courseId",
  errorHandler(async (req, res) => {
    const courseId = req.params.courseId;
    const userId = req.headers["x-user-id"];
    const sessions = await Session.find({ courseId, userId });
    if (sessions.length !== 0) {
      let totalModules = 0;
      let totalTime = 0;
      let totalScore = 0;
      await sessions.map((session) => {
        totalModules += session.totalModulesStudied;
        totalTime += session.timeStudied;
        totalScore += session.averageScore;
      });
      res.status(200).json({
        totalModulesStudied: totalModules,
        timeStudied: totalTime,
        averageScore: totalScore / sessions.length,
      });
    } else {
      const err = new Error("No sessions for that course");
      err.type = "UserMessage";
      throw err;
    }
  })
);

module.exports = router;
