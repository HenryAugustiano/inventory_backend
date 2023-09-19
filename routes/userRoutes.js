const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Define user routes
router.post('/register', userController.register);
router.post('/login', userController.login);
// Add more routes as needed

module.exports = router;
