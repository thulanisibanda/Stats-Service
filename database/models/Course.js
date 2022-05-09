const mongoose = require("mongoose");

//Message Schema
const CourseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

//module export
module.exports = new mongoose.model("Course", CourseSchema);
