const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  // itemId: mongoose.Schema.Types.ObjectId, // Item's ID automatically generated by MongoDB
  userEmail: {
    type: String,
    required: true,
  },
  items: {
    type: Object,
    default: {},
  },
});

const Inventory = mongoose.model('Inventory', inventorySchema);

module.exports = Inventory;
