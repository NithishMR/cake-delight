const NotificationModel = require("../model/Notification");

const notificationController = {
  getNotification: async (req, res) => {
    try {
      const { customerId } = req.params;
      const notifications = await NotificationModel.find({
        customerId,
      }).sort({ createdAt: -1 });
      res.status(200).json({
        notifications,
      });
    } catch (error) {
      console.error("Error fetching notifications:", error);

      res.status(500).json({
        message: "Failed to fetch notifications",
      });
    }
  },
  markAsRead: async (req, res) => {
    try {
      const { notificationId } = req.params;

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
      console.error("Error marking notification as read:", error);

      res.status(500).json({
        message: "Failed to mark notification as read",
      });
    }
  },
  deleteNotification: async (req, res) => {
    try {
      const { notificationId } = req.params;

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
      console.error("Error deleting notification:", error);

      res.status(500).json({
        message: "Failed to delete notification",
      });
    }
  },
};

module.exports = notificationController;
