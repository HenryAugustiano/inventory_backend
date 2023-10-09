require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

app.use(cors()); //allow cross-origin requests from localhost
app.use(bodyParser.json());
app.use(cookieParser());

// Route handlers
const userRoutes = require('./routes/userRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
//Ex: localhost:3000/api/users/register

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});


/**
 * Flow of the application:
 * Index.js is the entry point of the application, it routes incoming requests to the appropriate route handler (ex:userRoutes.js).
 * userRoutes.js calls the appropriate controller function (ex: userController.js) to handle the request.
 */

app.use('/api/users', userRoutes);
app.use('/api/inventory', inventoryRoutes);
// Add more routes as needed


// MongoDB Atlas connection URL
const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Start the server
const PORT = process.env.PORT || 3001;
const IP_ADDRESS = '0.0.0.0';

app.listen(PORT, IP_ADDRESS, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;