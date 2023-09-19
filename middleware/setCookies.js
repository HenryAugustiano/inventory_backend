// middleware/setCookies.js
const jwt = require('jsonwebtoken');

const setCookies = (token, res) => {
  res.cookie('jwt', token, {
    httpOnly: true, // Prevent JavaScript access to the cookie
    maxAge: 3600000, // Cookie expiration time in milliseconds (1 hour)
  });
};

module.exports = setCookies;
