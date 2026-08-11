const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const cakeRoute = require("./routes/cakeRoute");
const errorHandler = require("./middlewares/errorHandler");
const logger = require("./middlewares/logger");
const config = require("./config/env");
const app = express();

const PORT = config.port;
const serviceUrl = `http://localhost:${PORT}`;
app.use(cors());
app.use(express.json());
app.use(logger);
connectDB();

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
app.listen(PORT, () => {
  console.log(`Catalog service running at ${PORT}`);
});
