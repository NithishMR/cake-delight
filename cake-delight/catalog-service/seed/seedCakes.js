const CakeModel = require("../model/Cake");
const seedCakes = require("./seedData");

const seedDatabase = async () => {
  try {
    const cakeCount = await CakeModel.countDocuments();

    if (cakeCount > 0) {
      console.log(
        `Catalog already contains ${cakeCount} cake(s). Skipping seed.`,
      );

      return;
    }

    await CakeModel.insertMany(seedCakes);

    console.log(`Catalog seeded successfully with ${seedCakes.length} cakes.`);
  } catch (error) {
    console.error("Error seeding catalog:", error.message);

    throw error;
  }
};

module.exports = seedDatabase;
