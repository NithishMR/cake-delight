require("dotenv").config();

const config = {
  port: process.env.PORT || 3004,
  mongoUrl: process.env.MONGO_URL,
  rabbitmqUrl: process.env.RABBITMQ_URL,
};

if (!config.mongoUrl) {
  throw new Error("MONGO_URL is required");
}

if (!config.rabbitmqUrl) {
  throw new Error("RABBITMQ_URL is required");
}

module.exports = config;
