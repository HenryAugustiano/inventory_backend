const jwt = require('jsonwebtoken');

const verifyCookies = (req, res, next) => {
  try {
    const token = req.cookies.jwt;
  
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Invalid token' });
      }
  
      req.user = decoded; // To access the user's information from the token
      next();
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = verifyCookies;
