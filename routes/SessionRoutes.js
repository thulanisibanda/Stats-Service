const express = require("express");
const mongoose = require("mongoose");
const Session = mongoose.model("Session");
const router = express.Router();

//error handler
const errorHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

//saves and updates a study session event
router.post(
  "/courses/:courseId",
  errorHandler(async (req, res) => {
    const { sessionId, totalModulesStudied, averageScore, timeStudied } =
      req.body;
    let session;

    // check for sessionId, if found client is trying to update session
    // could use request.put route to seperate the concerns
    if (sessionId) {
      session = await Session.findOneAndUpdate(
        { _id: sessionId },
        {
          totalModulesStudied,
          averageScore,
          timeStudied,
        },
        { new: true }
      );
    } else {
      const courseId = req.params.courseId;
      const userId = req.headers["x-user-id"];
      session = new Session({
        totalModulesStudied,
        averageScore,
        timeStudied,
        userId,
        courseId,
      });
      await session.save();
    }
    res.status(201).json({
      sessionId: session._id,
      totalModulesStudied: session.totalModulesStudied,
      averageScore: session.averageScore,
      timeStudied: session.timeStudied,
    });
  })
);

// get single session event
router.get(
  "/courses/:courseId/sessions/:sessionId",
  errorHandler(async (req, res) => {
    //TODO: not sure why i need userId and courseId to find a session if i have sessionId?
    //const userId = req.headers["x-user-id"];
    //const courseId = req.params.courseId;
    const sessionId = req.params.sessionId;
    const session = await Session.findOne({ _id: sessionId });
    if (session) {
      res.json({
        sessionId: session._id,
        totalModulesStudied: session.totalModulesStudied,
        averageScore: session.averageScore,
        timeStudied: session.timeStudied,
      });
    } else {
      const error = new Error("No session found");
      error.type = "UserError";
      throw error;
    }
  })
);

module.exports = router;
