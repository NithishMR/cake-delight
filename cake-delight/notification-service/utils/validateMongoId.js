const mongoose = require("mongoose");
function validateMongoId(id) {
  if (!mongoose.isValidObjectId(id)) {
    return false;
  }

  return String(new mongoose.Types.ObjectId(id)) === id;
}

module.exports = validateMongoId;
