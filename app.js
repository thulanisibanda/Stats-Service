const express = require("express");
const database = require("./database/database");
require("dotenv").config();

const app = express();

// port number to listen to
const PORT = process.env.PORT;

//database models
require("./database/models/Course");
require("./database/models/User");
require("./database/models/Session");

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
app.use(require("./routes/UserRoutes"));
app.use(require("./routes/SessionRoutes"));
app.use(require("./routes/CourseRoutes"));

//Handle not found error
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

//Handle all other errors
app.use((error, req, res, next) => {
  //use if you want to send error to use
  if (error.type === "UserMessage") {
    res.status(400).json({
      error: {
        message: error.message,
      },
    });
  } else {
    //send general error message
    console.log(error.message);
    res.status(500).json({
      error: {
        message: "Something went wrong",
      },
    });
  }
  next(error);
});

database.connect().then(() => {
  app.listen(PORT, () => {
    console.log("Listening on port: " + PORT);
  });
});

module.exports = app;
