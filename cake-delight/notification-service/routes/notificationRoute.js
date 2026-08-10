const express = require("express");
const notificationController = require("../controllers/notificationController");

const router = express.Router();

router.get("/:customerId", notificationController.getNotification);
router.patch("/:notificationId/read", notificationController.markAsRead);
router.delete("/:notificationId", notificationController.deleteNotification);
module.exports = router;
