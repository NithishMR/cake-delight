const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
    },

    customerId: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["ORDER_CONFIRMATION"],
      required: true,
    },

    channel: {
      type: String,
      enum: ["EMAIL", "SMS", "IN_APP"],
      required: true,
    },

    recipient: {
      type: String,
    },

    message: {
      type: String,
      required: true,
    },

    deliveryStatus: {
      type: String,
      enum: ["PENDING", "SENT", "FAILED"],
      default: "PENDING",
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    sentAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

const NotificationModel = mongoose.model("Notification", notificationSchema);

module.exports = NotificationModel;
