const mongoose = require("mongoose");
const config = require("./env");

const MONGODB_URI = config.mongoUrl;
const delayTime = 3000;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function connectDB() {
  let retries = 3;
  while (retries > 0) {
    try {
      await mongoose.connect(MONGODB_URI);

      console.log("Connection to MongoDB has been successfully established");

      return;
    } catch (error) {
      retries = retries - 1;

      console.error("Error connecting to MongoDB:", error.message);

      if (retries > 0) {
        await delay(delayTime);
      }
    }
  }

  throw new Error("Failed to connect to MongoDB after 3 attempts");
}

module.exports = connectDB;
