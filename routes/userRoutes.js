const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyCookies = require('../middleware/verifyCookies');

// Define user routes
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/info', verifyCookies, userController.getUserInfo);
// Add more routes as needed

module.exports = router;
