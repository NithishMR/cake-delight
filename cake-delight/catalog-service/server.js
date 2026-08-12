const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const cakeRoute = require("./routes/cakeRoute");
const seedDatabase = require("./seed/seedCakes");
const errorHandler = require("./middlewares/errorHandler");
const logger = require("./middlewares/logger");
const config = require("./config/env");

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Catalog service running successfully",
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "UP",
    service: "catalog-service",
  });
});

app.use("/api/cakes", cakeRoute);

app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDB();

    await seedDatabase();

    app.listen(config.port, () => {
      console.log(`Catalog Service running on port ${config.port}`);
    });
  } catch (error) {
    console.error("Failed to start Catalog Service:", error);
    process.exit(1);
  }
};

startServer();
