const BasketModel = require("../model/Basket");
const OrderModel = require("../model/Order");
const { publishOrderCompleted } = require("../services/rabbitmq");
const validateMongoId = require("../utils/validateMongoId");
const orderController = {
  checkout: async (req, res, next) => {
    try {
      const customerId = "C001";
      const basket = await BasketModel.findOne({ customerId });

      if (!basket) {
        return res.status(404).json({
          message: "Basket not found",
        });
      }
      if (basket.items.length === 0) {
        return res.status(400).json({
          message: "Cannot checkout an empty basket",
        });
      }
      const order = new OrderModel({
        customerId: customerId,
        items: basket.items,
        totalAmount: basket.totalAmount,
        status: "PENDING",
      });
      await order.save();

      // 5. Clear basket
      basket.items = [];
      basket.totalAmount = 0;

      await basket.save();

      // 6. Return order
      return res.status(201).json({
        message: "Order created successfully",
        order,
      });
    } catch (error) {
      next(error);
    }
  },
  getOrder: async (req, res, next) => {
    try {
      const { orderId } = req.params;
      if (!validateMongoId(orderId)) {
        return res.status(400).json({
          message: "Invalid order ID",
        });
      }
      const order = await OrderModel.findById(orderId);

      if (!order) {
        return res.status(404).json({
          message: "Order not found",
        });
      }

      return res.status(200).json({
        order,
      });
    } catch (error) {
      next(error);
    }
  },
  getOrders: async (req, res, next) => {
    try {
      const customerId = "C001";

      const orders = await OrderModel.find({ customerId }).sort({
        createdAt: -1,
      });

      return res.status(200).json({
        orders,
      });
    } catch (error) {
      next(error);
    }
  },
  updateOrderStatus: async (req, res, next) => {
    const { orderId } = req.params;
    const { status } = req.body;

    try {
      if (!validateMongoId(orderId)) {
        return res.status(400).json({
          message: "Invalid order ID",
        });
      }
      const order = await OrderModel.findById(orderId);

      if (!order) {
        return res.status(404).json({
          message: "Order not found",
        });
      }

      // Validate status
      const validStatuses = ["PENDING", "COMPLETED", "CANCELLED"];

      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid order status",
        });
      }

      // Check allowed transitions
      const currentStatus = order.status;

      const allowedTransitions = {
        PENDING: ["COMPLETED", "CANCELLED"],
        COMPLETED: [],
        CANCELLED: [],
      };

      if (!allowedTransitions[currentStatus].includes(status)) {
        return res.status(400).json({
          message: `Cannot change order status from ${currentStatus} to ${status}`,
        });
      }

      order.status = status;

      if (status === "COMPLETED") {
        order.completedAt = new Date();
      }

      await order.save();
      if (status === "COMPLETED") {
        await publishOrderCompleted(order);
      }
      return res.status(200).json({
        message: "Order status updated successfully",
        order,
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = orderController;
