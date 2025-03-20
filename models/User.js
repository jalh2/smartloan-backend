const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Remove any existing indexes before creating new ones
mongoose.set('strictQuery', false);

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    select: false // Don't return password in queries by default
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

// Drop existing indexes and recreate them
userSchema.pre('save', async function(next) {
  try {
    // Only hash password if it's modified
    if (this.isModified('password')) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
    next();
  } catch (error) {
    next(error);
  }
});

// Method to check if password matches
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Drop and recreate indexes on model compilation
userSchema.statics.resetIndexes = async function() {
  try {
    await this.collection.dropIndexes();
    await this.collection.createIndex({ phoneNumber: 1 }, { unique: true });
  } catch (error) {
    console.error('Error resetting indexes:', error);
  }
};

const User = mongoose.model('User', userSchema);

// Reset indexes when the model is first loaded
User.resetIndexes().catch(console.error);

module.exports = User;
