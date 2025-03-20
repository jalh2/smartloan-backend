const express = require('express');
const router = express.Router();
const {
  createLoanApplication,
  getAllLoanApplications,
  getLoanByReference,
  updateLoanStatus
} = require('../controllers/loanController');

// Create loan application
router.post('/', createLoanApplication);

// Get all loans
router.get('/', getAllLoanApplications);

// Get loan by reference number
router.get('/reference/:referenceNumber', getLoanByReference);

// Update loan status by reference number
router.patch('/reference/:referenceNumber', updateLoanStatus);

module.exports = router;
