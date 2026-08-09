const express = require("express");
const orderController = require("../controllers/orderController");

const router = express.Router();

router.post("/checkout", orderController.checkout);
router.get("/", orderController.getOrders);
router.get("/:orderId", orderController.getOrder);
router.patch("/:orderId/status", orderController.updateOrderStatus);

module.exports = router;
