const Inventory = require('../models/Inventory');

const addItem = async (req, res) => {
  const userEmail = req.user.email; // userEmail is retrieved from the JWT token (see verifyCookies.js)

  const { itemName, description, itemPrice, itemQuantity } = req.body;

  if(!itemName || !description || !itemPrice || !itemQuantity) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  try {
    // Retrieve the user's inventory
    let inventory = await Inventory.findOne({userEmail});

    // If the user's inventory doesn't exist, create new inventory
    if (!inventory) {
      inventory = new Inventory({
        userEmail,
        items: [],
      });
      console.log("inside if statement");
    }

    const newItem = {
      itemName: itemName,
      description: description,
      itemPrice: itemPrice,
      itemQuantity: itemQuantity,
    };

    inventory.items.push(newItem);
    inventory.markModified('items'); // Important: let know that the items array has been modified
    await inventory.save();

    res.status(201).json({ message: 'Item added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}

const updateItem = async (req, res) => {
  try {
    
    const userEmail = req.user.email;
    const {itemName, description, itemPrice, itemQuantity } = req.body;

    if(!itemName || !description || !itemPrice || !itemQuantity) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Find the user's inventory
    const inventory = await Inventory.findOne({ userEmail });

    if (!inventory) {
      return res.status(404).json({ message: 'User\'s inventory not found' });
    }

    // Find the item to update by itemName
    const itemToUpdate = inventory.items.find(item => item.itemName === itemName);

    // Check if the item to update exists in the user's inventory
    if (!itemToUpdate) {
      return res.status(404).json({ message: 'Item not found in inventory' });
    }

    // Update the item with the provided data
    itemToUpdate.itemName = itemName;
    itemToUpdate.description = description;
    itemToUpdate.itemPrice = itemPrice;
    itemToUpdate.itemQuantity = itemQuantity;

    // Save the updated inventory
    try {
      inventory.markModified('items'); // Important: let know that the items array has been modified
      await inventory.save();
      res.status(200).json({ message: 'Item updated successfully', inventory: inventory.items });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }    

    // res.status(200).json({ message: 'Item updated successfully', inventory: inventory.items });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getInventory = async (req, res) => {
  try {
    const userEmail = req.user.email;

    // Find the user's inventory
    const inventory = await Inventory.findOne({ userEmail });

    if (!inventory) {
      return res.status(404).json({ message: 'User\'s inventory not found' });
    }

    // Return the everything from the inventory
    res.status(200).json({ inventory });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = {
  addItem,
  updateItem,
  getInventory,
  // Add more controller functions as needed
};
