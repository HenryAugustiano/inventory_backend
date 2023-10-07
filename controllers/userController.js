require('dotenv').config();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const setCookies = require('../middleware/setCookies');
import { getSecret } from '../AWS_Secret';

// AWS Secret Manager
async function getSecret(secretName) {
  try {
    const secret = await getSecret(secretName);
    return secret;
  }
  catch (error) {
    console.error('Error retrieving secret:', error);
    throw error;
  }
}

const register = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'No user found' });
    }

    // Compare the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    // Generate a JWT token containing user information and use secret key to sign it
    const token = jwt.sign({ email: user.email, userId: user._id }, process.env.SECRET_KEY || getSecret('SECRET_KEY'), { expiresIn: '1h' });
    // Set the token as a cookie
    setCookies(token, res);

    res.status(200).json({ message: 'Authentication successful', token});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getUserInfo = async (req, res) => {
  try {
    const userEmail = req.user.email;
    return res.status(200).json({ email: userEmail });
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }    
};

const changePassword = async (req, res) => {
  try {

    const { email, password, newPassword } = req.body;

    if(!email || !password || !newPassword){
      return res.status(405).json({ message: 'Missing required fields' });
    }

    if(password === newPassword){
      return res.status(405).json({ message: 'New password cannot be the same as old password' });
    }

    const user = await User.findOne({ email });
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid){
      return res.status(401).json({ message: 'Authentication failed' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    user.markModified('password'); // Important: let know that the password has been modified
    await user.save();

    return res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {

    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
  
};

//Backend use only.
const deleteUser = async (req, res) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'No user found' });
    }
    await user.deleteOne();
    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    
  }
};

module.exports = {
  register,
  login,
  getUserInfo,
  deleteUser,
  changePassword,
  // Add more controller functions as needed
};
