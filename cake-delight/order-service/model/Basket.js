const mongoose = require("mongoose");

const basketItemSchema = new mongoose.Schema(
  {
    cakeId: {
      type: String,
      required: true,
    },

    cakeName: {
      type: String,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    _id: false,
  },
);

const basketSchema = new mongoose.Schema(
  {
    customerId: {
      type: String,
      default: "C001",
      unique: true,
    },

    items: {
      type: [basketItemSchema],
      default: [],
    },

    totalAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

const BasketModel = mongoose.model("Basket", basketSchema);

module.exports = BasketModel;
