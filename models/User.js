const mongoose = require('mongoose');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    select: false // Don't return password in queries by default
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', function(next) {
  if (!this.isModified('password')) {
    return next();
  }

  const hash = crypto.createHash('sha256');
  hash.update(this.password + process.env.ENCRYPTION_KEY);
  this.password = hash.digest('hex');
  next();
});

// Method to check password
userSchema.methods.checkPassword = function(password) {
  const hash = crypto.createHash('sha256');
  hash.update(password + process.env.ENCRYPTION_KEY);
  const hashedPassword = hash.digest('hex');
  return this.password === hashedPassword;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
