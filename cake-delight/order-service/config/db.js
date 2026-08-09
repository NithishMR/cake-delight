const mongoose = require("mongoose");

const MONGODB_URI = "mongodb://127.0.0.1:27017/order_db";
// const MONGODB_URI = "mongodb://mongo-catalog:27017/catalog_db";
const delayTime = 3000;
let retries = 3;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function connectDB() {
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

  console.error("Failed to connect to MongoDB after 3 attempts");
  return;
}

module.exports = connectDB;
