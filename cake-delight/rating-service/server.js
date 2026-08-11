const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const {
  connectRabbitMQ,
  consumeOrderCompleted,
} = require("./service/rabbitmq");
const RatingModel = require("./model/Rating");
const ratingRoute = require("./routes/ratingRoute");
const logger = require("./middlewares/logger");
const errorHandler = require("./middlewares/errorHandler");
const config = require("./config/env");
const app = express();

const PORT = config.port;
const serviceUrl = `http://localhost:${PORT}`;

app.use(cors());
app.use(express.json());
app.use(logger);
app.get("/", (req, res) => {
  res.status(200).json({ message: "Rating service running successfully" });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "UP",
    service: "rating-service",
  });
});

app.use("/api/ratings", ratingRoute);
app.use(errorHandler);
const startServer = async () => {
  try {
    await connectDB();
    await connectRabbitMQ();
    await consumeOrderCompleted(RatingModel);
    app.listen(PORT, () => {
      console.log(`Rating Service running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start Rating Service:", error);
    process.exit(1);
  }
};

startServer();
