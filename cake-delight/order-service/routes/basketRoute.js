const express = require("express");
const basketController = require("../controllers/basketController");

const router = express.Router();

router.get("/", basketController.getBasket);
router.post("/items", basketController.addToBasket);
router.post("/items/:cakeId", basketController.updateBasketItem);
router.delete("/items/:cakeId", basketController.removeFromBasket);
module.exports = router;
