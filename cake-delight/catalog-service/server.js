const express = require("express");
const connectDB = require("./config/db");
const cakeRoute = require("./routes/cakeRoute");

const app = express();

const PORT = 3001;
const serviceUrl = `http://localhost:${PORT}`;

app.use(express.json());
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

app.listen(PORT, () => {
  console.log(`Catalog service running at ${serviceUrl}`);
});
