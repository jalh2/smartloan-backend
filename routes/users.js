const express = require('express');
const router = express.Router();
const {
  register,
  login,
  createAdmin,
  getAllUsers,
  getUserProfile
} = require('../controllers/userController');

// Register new user
router.post('/register', register);

// Login user
router.post('/login', login);

// Create admin user
router.post('/admin/create', createAdmin);

// Get all users (admin only)
router.get('/', getAllUsers);

// Get user profile
router.get('/profile', getUserProfile);

module.exports = router;
