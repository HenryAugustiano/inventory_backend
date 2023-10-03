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
        inventoryTransactions: [],
      });
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

const deleteItem = async (req, res) => {
  try {
    // Retrieve the user's email from the JWT token
    const userEmail = req.user.email;
    // Retrieve the item name from the request body
    const { itemName } = req.body;

    // Find the user's inventory
    const inventory = await Inventory.findOne({ userEmail });
    if (!inventory) {
      return res.status(404).json({ message: 'User\'s inventory not found' });
    }

    // Get item index
    const itemIndex = inventory.items.findIndex(item => item.itemName === itemName)
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in inventory' });
    }


    // Delete the item from the inventory
    // Filter out the item to delete from the inventory's 'items' array
    inventory.items = inventory.items.filter(item => item.itemName !== itemName);
    inventory.markModified('items'); // Important: let know that the items array has been modified
    await inventory.save();

    return res.status(200).json({ message: 'Item deleted successfully', inventory: inventory.items });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}

const sellItem = async (req, res) => {
  try {
    const userEmail = req.user.email;
    const { itemName, itemSold } = req.body;

    const inventory = await Inventory.findOne({ userEmail });

    const itemIndex = inventory.items.findIndex(item => item.itemName === itemName);

    // Ensure the item exists in the inventory
    if (itemIndex === -1 || inventory.items[itemIndex].itemQuantity < itemSold) {
      return res.status(400).json({ message: 'Invalid item or insufficient quantity' });
    }
    
    // Decrease the item quantity
    inventory.items[itemIndex].itemQuantity -= itemSold;
    inventory.markModified('items'); // Important: let know that the items array has been modified

    // Add transaction history
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Check if there's an existing transaction for the current month
    const currentMonthTransaction = inventory.inventoryTransactions.find(
      transaction => transaction.month === currentMonth && transaction.year === currentYear
    );

    if (currentMonthTransaction) {
      // Update existing transaction for the current month
      currentMonthTransaction.totalItemsSold += itemSold;
      // Check if the item already exists in the soldItems array
      const soldItemIndex = currentMonthTransaction.soldItems.findIndex(
        soldItem => soldItem.itemName === itemName
      );
      if (soldItemIndex !== -1) {
        currentMonthTransaction.soldItems[soldItemIndex].quantitySold += itemSold;
      } else {
        // Add a new entry for the item in soldItems array
        currentMonthTransaction.soldItems.push({
          itemName,
          quantitySold: itemSold,
          totalSales: itemSold * inventory.items[itemIndex].itemPrice,
        });
      }
    } else {
      // Create a new transaction for the current month
      const newTransaction = {
        month: currentMonth,
        year: currentYear,
        totalItemsSold: itemSold,
        soldItems: [
          {
            itemName,
            quantitySold: itemSold,
            totalSales: itemSold * inventory.items[itemIndex].itemPrice,
          },
        ],
      };
      inventory.inventoryTransactions.push(newTransaction);
    }

    inventory.markModified('inventoryTransactions'); // Important: let know that the inventoryTransactions array has been modified
    await inventory.save();


    return res.status(200).json({ message: 'Item sold successfully', inventory: inventory.items });

  } catch (error) {
    console.error(error);
  }
}



module.exports = {
  addItem,
  updateItem,
  getInventory,
  deleteItem,
  sellItem,
  // Add more controller functions as needed
};
