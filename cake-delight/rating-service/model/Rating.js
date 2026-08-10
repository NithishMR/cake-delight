const mongoose = require("mongoose");
const ratingSchema = new mongoose.Schema(
  {
    cakeId: {
      type: String,
      required: true,
    },

    customerId: {
      type: String,
      required: true,
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },

    status: {
      type: String,
      enum: ["PENDING", "COMPLETED"],
      default: "PENDING",
    },
  },
  {
    timestamps: true,
  },
);

ratingSchema.index({ cakeId: 1, customerId: 1 }, { unique: true });

const RatingModel = mongoose.model("Rating", ratingSchema);

module.exports = RatingModel;
