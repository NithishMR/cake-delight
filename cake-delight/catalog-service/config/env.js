require("dotenv").config();

const config = {
  port: process.env.PORT || 3001,
  mongoUrl: process.env.MONGO_URL,
};

if (!config.mongoUrl) {
  throw new Error("MONGO_URL is required");
}

module.exports = config;
