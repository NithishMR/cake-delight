const express = require("express");
const ratingController = require("../controllers/ratingController");

const router = express.Router();
router.get("/", ratingController.getAllCakeRatings);
router.post("/", ratingController.submitRating);
router.get("/pending/:customerId", ratingController.getPendingRatings);
router.get("/customer/:customerId", ratingController.getCustomerRatings);
router.get("/:cakeId", ratingController.getCakeRating);

module.exports = router;
