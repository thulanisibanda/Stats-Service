const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

//module export
module.exports = new mongoose.model("User", UserSchema);
