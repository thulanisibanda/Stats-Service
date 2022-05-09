const mongoose = require("mongoose");

require("dotenv").config();

const connect = () => {
  return new Promise((resolve, reject) => {
    if (process.env.NODE_ENV === "test") {
      //using Mockgoose to mock dtabase for testing
      const Mockgoose = require("mockgoose").Mockgoose;
      const mockgoose = new Mockgoose(mongoose);

      mockgoose.prepareStorage().then(() => {
        mongoose
          .connect("testDB", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
          })
          .then((res, err) => {
            if (err) return reject(err);
            resolve();
          });
      });
    } else {
      //connect to real database
      mongoose
        .connect(process.env.MONGO_URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        })
        .then((res, err) => {
          if (err) return reject(err);
          resolve();
        });

      mongoose.connection.on("connected", () => {
        console.log("connected to mongo instance!!");
      });

      mongoose.connection.on("error", (err) => {
        console.error("Error connecting to mongo", err);
      });
    }
  });
};

const close = () => {
  return mongoose.disconnect();
};

module.exports = { connect, close };
