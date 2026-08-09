const BasketModel = require("../model/Basket");
const OrderModel = require("../model/Order");
const catalogServiceUrl = "http://localhost:3001";

const orderController = {
  addToBasket: async (req, res) => {
    console.log(req.body);
    const { cakeId, quantity } = req.body;

    if (!cakeId || !quantity || quantity < 1) {
      return res.status(400).json({
        message: "cakeId and a valid quantity are required",
      });
    }

    try {
      const response = await fetch(`${catalogServiceUrl}/api/cakes/${cakeId}`);

      if (!response.ok) {
        return res.status(404).json({
          message: "Cake not found",
        });
      }

      const cake = await response.json();

      if (!cake.available) {
        return res.status(400).json({
          message: "Cake is currently unavailable",
        });
      }

      const customerId = "C001"; //  default customer Id

      let basket = await BasketModel.findOne({ customerId });

      // Create basket if it doesn't exist
      if (!basket) {
        basket = new BasketModel({
          customerId,
          items: [],
        });
      }

      const existingItem = basket.items.find((item) => item.cakeId === cakeId);

      if (existingItem) {
        existingItem.quantity += quantity;

        existingItem.subtotal = existingItem.quantity * existingItem.unitPrice;
      } else {
        basket.items.push({
          cakeId: cakeId,
          cakeName: cake.name,
          quantity: quantity,
          unitPrice: cake.price,
          subtotal: cake.price * quantity,
        });
      }

      basket.totalAmount = basket.items.reduce(
        (total, item) => total + item.subtotal,
        0,
      );

      await basket.save();

      return res.status(200).json({
        message: "Cake added to basket",
        basket,
      });
    } catch (error) {
      console.error("Error adding cake to basket:", error);

      return res.status(500).json({
        message: "Failed to add cake to basket",
      });
    }
  },
  getBasket: async (req, res) => {
    try {
      const customerId = "C001";

      const basket = await BasketModel.findOne({ customerId });

      if (!basket) {
        return res.status(404).json({
          message: "Basket not found",
        });
      }
      return res.status(200).json({
        basket,
      });
    } catch (error) {
      console.error("Error fetching basket:", error);

      return res.status(500).json({
        message: "Failed to fetch basket",
      });
    }
  },
  updateBasketItem: async (req, res) => {
    const { cakeId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        message: "A valid quantity is required",
      });
    }
    try {
      const customerId = "C001";
      const basket = await BasketModel.findOne({ customerId });
      if (!basket) {
        return res.status(404).json({
          message: "Basket not found",
        });
      }
      const item = basket.items.find((item) => item.cakeId === cakeId);
      if (!item) {
        return res.status(404).json({
          message: "Cake not found in basket",
        });
      }
      item.quantity = quantity;
      item.subtotal = item.quantity * item.unitPrice;
      basket.totalAmount = basket.items.reduce(
        (total, item) => total + item.subtotal,
        0,
      );

      await basket.save();

      return res.status(200).json({
        message: "Basket item updated",
        basket,
      });
    } catch (error) {
      console.error("Error updating basket item:", error);

      return res.status(500).json({
        message: "Failed to update basket item",
      });
    }
  },
  removeFromBasket: async (req, res) => {
    const { cakeId } = req.params;

    try {
      const customerId = "C001";

      const basket = await BasketModel.findOne({ customerId });

      if (!basket) {
        return res.status(404).json({
          message: "Basket not found",
        });
      }

      const itemIndex = basket.items.findIndex(
        (item) => item.cakeId === cakeId,
      );

      if (itemIndex === -1) {
        return res.status(404).json({
          message: "Cake not found in basket",
        });
      }

      basket.items.splice(itemIndex, 1);

      basket.totalAmount = basket.items.reduce(
        (total, item) => total + item.subtotal,
        0,
      );

      await basket.save();

      return res.status(200).json({
        message: "Cake removed from basket",
        basket,
      });
    } catch (error) {
      console.error("Error removing cake from basket:", error);

      return res.status(500).json({
        message: "Failed to remove cake from basket",
      });
    }
  },
  checkout: async (req, res) => {
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
      console.error("Error during checkout:", error);

      return res.status(500).json({
        message: "Failed to create order",
      });
    }
  },
  getOrder: async (req, res) => {
    try {
      const { orderId } = req.params;

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
      console.error("Error fetching order:", error);

      return res.status(500).json({
        message: "Failed to fetch order",
      });
    }
  },
  getOrders: async (req, res) => {
    try {
      const customerId = "C001";

      const orders = await OrderModel.find({ customerId }).sort({
        createdAt: -1,
      });

      return res.status(200).json({
        orders,
      });
    } catch (error) {
      console.error("Error fetching orders:", error);

      return res.status(500).json({
        message: "Failed to fetch orders",
      });
    }
  },
};

module.exports = orderController;
