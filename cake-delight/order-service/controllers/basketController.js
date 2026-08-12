const config = require("../config/env");
const BasketModel = require("../model/Basket");
const OrderModel = require("../model/Order");
const catalogServiceUrl = config.catalogServiceUrl;
const basketController = {
  addToBasket: async (req, res, next) => {
    const { cakeId, quantity } = req.body;

    if (!cakeId || !Number.isInteger(quantity) || quantity < 1) {
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
      next(error);
    }
  },
  getBasket: async (req, res, next) => {
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
      next(error);
    }
  },
  updateBasketItem: async (req, res, next) => {
    const { cakeId } = req.params;
    const { quantity } = req.body;

    if (!Number.isInteger(quantity) || quantity < 1) {
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
      next(error);
    }
  },
  removeFromBasket: async (req, res, next) => {
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
      next(error);
    }
  },
};

module.exports = basketController;
