const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const {
  connectRabbitMQ,
  consumeOrderCompleted,
} = require("./services/rabbitmq");
const NotificationModel = require("./model/Notification");
const notificationRoute = require("./routes/notificationRoute");
const logger = require("./middlewares/logger");
const errorHandler = require("./middlewares/errorHandler");
const config = require("./config/env");
const PORT = config.port;
const serviceUrl = `http://localhost:${PORT}`;

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);
app.get("/", (req, res) => {
  res
    .status(200)
    .json({ message: "Notification service running successfully" });
});
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "UP",
    service: "notification-service",
  });
});
app.use("/api/notifications", notificationRoute);

app.use(errorHandler);
const startServer = async () => {
  try {
    await connectDB();
    await connectRabbitMQ();
    await consumeOrderCompleted(NotificationModel);
    app.listen(PORT, () => {
      console.log(`Notification Service running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start Notification Service:", error);
    process.exit(1);
  }
};

startServer();
