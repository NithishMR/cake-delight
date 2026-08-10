const RatingModel = require("../model/Rating");

const ratingController = {
  submitRating: async (req, res) => {
    try {
      const { cakeId, customerId, rating } = req.body;

      if (!cakeId || !customerId || rating === undefined) {
        return res.status(400).json({
          message: "cakeId, customerId and rating are required",
        });
      }

      if (rating < 1 || rating > 5) {
        return res.status(400).json({
          message: "Rating must be between 1 and 5",
        });
      }

      const existingRating = await RatingModel.findOne({
        cakeId,
        customerId,
      });

      if (!existingRating) {
        return res.status(404).json({
          message: "Rating request not found",
        });
      }

      if (existingRating.status === "COMPLETED") {
        return res.status(400).json({
          message: "Rating has already been submitted",
        });
      }

      existingRating.rating = rating;
      existingRating.status = "COMPLETED";

      await existingRating.save();

      return res.status(200).json({
        message: "Rating submitted successfully",
        rating: existingRating,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: "Failed to submit rating",
      });
    }
  },
  getPendingRatings: async (req, res) => {
    try {
      const { customerId } = req.params;

      const pendingRatings = await RatingModel.find({
        customerId,
        status: "PENDING",
      });

      return res.status(200).json({
        ratings: pendingRatings,
      });
    } catch (error) {
      console.error("Error fetching pending ratings:", error);

      return res.status(500).json({
        message: "Failed to fetch pending ratings",
      });
    }
  },
  getCakeRating: async (req, res) => {
    try {
      const { cakeId } = req.params;

      const result = await RatingModel.aggregate([
        {
          $match: {
            cakeId: cakeId,
            status: "COMPLETED",
          },
        },
        {
          $group: {
            _id: "$cakeId",
            averageRating: { $avg: "$rating" },
            totalRatings: { $sum: 1 },
          },
        },
      ]);
      if (result.length === 0) {
        return res.status(200).json({
          cakeId,
          averageRating: 0,
          totalRatings: 0,
        });
      }

      return res.status(200).json({
        cakeId,
        averageRating: result[0].averageRating,
        totalRatings: result[0].totalRatings,
      });
    } catch (error) {
      console.error("Error fetching cake rating:", error);

      return res.status(500).json({
        message: "Failed to fetch cake rating",
      });
    }
  },
  getAllCakeRatings: async (req, res) => {
    try {
      const ratings = await RatingModel.aggregate([
        {
          $match: {
            status: "COMPLETED",
          },
        },
        {
          $group: {
            _id: "$cakeId",
            averageRating: { $avg: "$rating" },
            totalRatings: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            cakeId: "$_id",
            averageRating: 1,
            totalRatings: 1,
          },
        },
      ]);

      return res.status(200).json({
        ratings,
      });
    } catch (error) {
      console.error("Error fetching all cake ratings:", error);

      return res.status(500).json({
        message: "Failed to fetch cake ratings",
      });
    }
  },
  getCustomerRatings: async (req, res) => {
    try {
      const { customerId } = req.params;

      const ratings = await RatingModel.find({
        customerId,
        status: "COMPLETED",
      });

      return res.status(200).json({
        ratings,
      });
    } catch (error) {
      console.error("Error fetching customer ratings:", error);

      return res.status(500).json({
        message: "Failed to fetch customer ratings",
      });
    }
  },
};

module.exports = ratingController;
