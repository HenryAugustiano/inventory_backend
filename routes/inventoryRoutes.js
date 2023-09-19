const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const verifyCookies = require('../middleware/verifyCookies');

// Define user routes
router.post('/addInventory',verifyCookies, inventoryController.addItem);
router.put('/updateInventory',verifyCookies, inventoryController.updateItem);
router.get('/getInventory',verifyCookies, inventoryController.getInventory);
// Add more routes as needed

module.exports = router;
