const CakeModel = require("../model/Cake");
const validateMongoId = require("../utils/validateMongoId");

const cakeController = {
  getAllCakes: async (req, res, next) => {
    try {
      const cakes = await CakeModel.find({});

      return res.status(200).json({
        cakes,
      });
    } catch (error) {
      next(error);
    }
  },
  getCake: async (req, res, next) => {
    try {
      const id = req.params.id;
      if (!validateMongoId(id)) {
        return res.status(400).json({ message: "Invalid MongoDB ID" });
      }
      const cake = await CakeModel.findById(id);
      if (cake === null) {
        return res.status(404).json({ message: "Cake not found" });
      }
      return res.status(200).json(cake);
    } catch (error) {
      next(error);
    }
  },
  filterCake: async (req, res, next) => {
    try {
      const { name, category, minPrice, maxPrice } = req.query;
      const query = {};
      if (name) {
        query.name = {
          $regex: name,
          $options: "i",
        };
      }
      if (category) {
        query.category = category;
      }
      if (minPrice !== undefined || maxPrice !== undefined) {
        query.price = {};

        if (minPrice !== undefined) {
          const min = Number(minPrice);

          if (!Number.isFinite(min) || min < 0) {
            return res.status(400).json({
              message: "Invalid minimum price",
            });
          }

          query.price.$gte = min;
        }

        if (maxPrice !== undefined) {
          const max = Number(maxPrice);

          if (!Number.isFinite(max) || max < 0) {
            return res.status(400).json({
              message: "Invalid maximum price",
            });
          }

          query.price.$lte = max;
        }

        if (
          minPrice !== undefined &&
          maxPrice !== undefined &&
          Number(minPrice) > Number(maxPrice)
        ) {
          return res.status(400).json({
            message: "Minimum price cannot be greater than maximum price",
          });
        }
      }
      const cakes = await CakeModel.find(query);
      return res.status(200).json({ cakes });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = cakeController;
