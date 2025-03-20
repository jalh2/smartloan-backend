const User = require('../models/User');

// Register new user
exports.register = async (req, res) => {
  try {
    const { name, password, phoneNumber } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'Phone number already registered'
      });
    }

    // Create user with only the required fields
    const user = await User.create({
      name,
      password,
      phoneNumber,
      role: 'user' // Explicitly set role to user for mobile app registrations
    });

    // Don't send password in response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      data: userResponse
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to register user'
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;

    // Get user with password and role
    const user = await User.findOne({ phoneNumber }).select('+password +role');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Don't send password in response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      success: true,
      data: userResponse
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to login'
    });
  }
};

// Create admin user
exports.createAdmin = async (req, res) => {
  try {
    const { name, phoneNumber, password } = req.body;

    // Check if admin already exists
    const existingAdmin = await User.findOne({ phoneNumber });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        error: 'Phone number already registered'
      });
    }

    const admin = await User.create({
      name,
      phoneNumber,
      password,
      role: 'admin'
    });

    // Don't send password in response
    const adminResponse = admin.toObject();
    delete adminResponse.password;

    res.status(201).json({
      success: true,
      data: adminResponse
    });
  } catch (error) {
    console.error('Admin creation error:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to create admin'
    });
  }
};

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get users'
    });
  }
};

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get user profile'
    });
  }
};
