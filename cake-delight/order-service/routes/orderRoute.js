const express = require("express");
const orderController = require("../controllers/orderController");

const router = express.Router();

router.post("/basket/items", orderController.addToBasket);
router.get("/basket", orderController.getBasket);
router.post("/basket/items/:cakeId", orderController.updateBasketItem);
router.delete("basket/items/:cakeId", orderController.removeFromBasket);
router.post("/orders/checkout", orderController.checkout);
router.get("/order/:orderId", orderController.getOrder);
router.get("/orders", orderController.getOrders);

module.exports = router;
