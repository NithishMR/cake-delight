const express = require("express");
const cakeController = require("../controllers/cakeController");
const router = express.Router();
router.get("/", cakeController.getAllCakes);
router.get("/search", cakeController.filterCake);
router.get("/:id", cakeController.getCake);
module.exports = router;
