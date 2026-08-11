require("dotenv").config();

const config = {
  port: process.env.PORT || 3002,
  mongoUrl: process.env.MONGO_URL,
  rabbitmqUrl: process.env.RABBITMQ_URL,
  catalogServiceUrl: process.env.CATALOG_SERVICE_URL,
};

if (!config.mongoUrl) {
  throw new Error("MONGO_URL is required");
}

if (!config.rabbitmqUrl) {
  throw new Error("RABBITMQ_URL is required");
}

if (!config.catalogServiceUrl) {
  throw new Error("CATALOG_SERVICE_URL is required");
}

module.exports = config;
