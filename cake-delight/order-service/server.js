const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const orderRoute = require("./routes/orderRoute");
const basketRoute = require("./routes/basketRoute");
const { connectRabbitMQ } = require("./services/rabbitmq");
const logger = require("./middlewares/logger");
const errorHandler = require("./middlewares/errorHandler");
const config = require("./config/env");
const app = express();

const PORT = config.port;

app.use(cors());
app.use(express.json());
app.use(logger);
app.get("/", (req, res) => {
  res.status(200).json({ message: "Order service running successfully" });
});
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "UP",
    service: "order-service",
  });
});
app.use("/api/order", orderRoute);
app.use("/api/basket", basketRoute);

app.use(errorHandler);
const startServer = async () => {
  try {
    await connectDB();
    await connectRabbitMQ();

    app.listen(PORT, () => {
      console.log(`Order Service running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start Order Service:", error);
    process.exit(1);
  }
};

startServer();
