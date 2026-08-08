const mongoose = require("mongoose");

const cakeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    available: {
      type: Boolean,
      default: true,
    },

    imageReference: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

const CakeModel = mongoose.model("Cake", cakeSchema);

module.exports = CakeModel;
