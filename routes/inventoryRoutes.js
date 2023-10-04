const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const verifyCookies = require('../middleware/verifyCookies');

// Define user routes
router.post('/addInventory',verifyCookies, inventoryController.addItem);
router.put('/updateInventory',verifyCookies, inventoryController.updateItem);
router.get('/getInventory',verifyCookies, inventoryController.getInventory);
router.delete('/deleteInventory',verifyCookies, inventoryController.deleteItem);
router.post('/sellItem',verifyCookies, inventoryController.sellItem);
router.get('/getItem',verifyCookies, inventoryController.getItem);
// Add more routes as needed

module.exports = router;
