const NotificationModel = require("../model/Notification");
const validateMongoId = require("../utils/validateMongoId");

const notificationController = {
  getNotification: async (req, res, next) => {
    try {
      const { customerId } = req.params;
      const notifications = await NotificationModel.find({
        customerId,
      }).sort({ createdAt: -1 });
      res.status(200).json({
        notifications,
      });
    } catch (error) {
      next(error);
    }
  },
  markAsRead: async (req, res, next) => {
    try {
      const { notificationId } = req.params;
      if (!validateMongoId(notificationId)) {
        return res.status(400).json({
          message: "Invalid notification ID",
        });
      }
      const notification = await NotificationModel.findByIdAndUpdate(
        notificationId,
        {
          isRead: true,
        },
        {
          new: true,
        },
        {
          returnDocument: "after",
        },
      );

      if (!notification) {
        return res.status(404).json({
          message: "Notification not found",
        });
      }

      res.status(200).json({
        message: "Notification marked as read",
        notification,
      });
    } catch (error) {
      next(error);
    }
  },
  deleteNotification: async (req, res, next) => {
    try {
      const { notificationId } = req.params;
      if (!validateMongoId(notificationId)) {
        return res.status(400).json({
          message: "Invalid notification ID",
        });
      }
      const notification =
        await NotificationModel.findByIdAndDelete(notificationId);

      if (!notification) {
        return res.status(404).json({
          message: "Notification not found",
        });
      }

      res.status(200).json({
        message: "Notification deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = notificationController;
