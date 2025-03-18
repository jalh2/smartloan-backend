const mongoose = require('mongoose');
const crypto = require('crypto');

const loanApplicationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  contactNumber: {
    type: String,
    required: [true, 'Contact number is required'],
    trim: true
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: [18, 'Must be at least 18 years old']
  },
  amountRequested: {
    type: Number,
    required: [true, 'Loan amount is required'],
    min: [1, 'Amount must be greater than 0']
  },
  platformUsage: {
    type: String,
    required: [true, 'Platform usage information is required'],
    enum: ['Once', 'Twice', 'More'],
    default: 'Once'
  },
  repaymentDate: {
    type: Date,
    required: [true, 'Repayment date is required']
  },
  paymentMode: {
    type: String,
    default: 'Via mobile money platform',
    required: true
  },
  // These are fixed values as per requirements
  agentSimNumber: {
    type: String,
    default: '0886-551-207'
  },
  agentName: {
    type: String,
    default: 'Andrew Gombay business'
  },
  // Additional fields for loan management
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected', 'Paid'],
    default: 'Pending'
  },
  applicationDate: {
    type: Date,
    default: Date.now
  },
  // Encrypted reference number for the loan
  referenceNumber: {
    type: String,
    unique: true
  }
}, {
  timestamps: true
});

// Generate encrypted reference number before saving
loanApplicationSchema.pre('save', function(next) {
  if (!this.referenceNumber) {
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 1000);
    const dataToEncrypt = `${this._id}-${timestamp}-${random}`;
    
    // Create a hash of the data using SHA-256
    const hash = crypto.createHash('sha256');
    hash.update(dataToEncrypt);
    this.referenceNumber = hash.digest('hex').substring(0, 12).toUpperCase();
  }
  next();
});

const LoanApplication = mongoose.model('LoanApplication', loanApplicationSchema);

module.exports = LoanApplication;
