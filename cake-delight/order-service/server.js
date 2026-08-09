const express = require("express");
const connectDB = require("./config/db");
const orderRoute = require("./routes/orderRoute");
const app = express();

const PORT = 3002;
const serviceUrl = `http://localhost:${PORT}`;
app.use(express.json());
connectDB();
app.get("/", (req, res) => {
  res.status(200).json({ message: "Order service running successfully" });
});
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "UP",
    service: "catalog-service",
  });
});
app.use("/api/", orderRoute);

app.listen(PORT, () => {
  console.log(`Order service running at ${serviceUrl}`);
});
