const express = require('express');
const router = express.Router();
const {
  createLoanApplication,
  getAllLoanApplications,
  getLoanApplication,
  updateLoanStatus,
  getLoansByStatus,
  getUserLoanHistory
} = require('../controllers/loanController');

// Create new loan application
router.post('/', createLoanApplication);

// Get all loan applications
router.get('/', getAllLoanApplications);

// Get loan application by reference number
router.get('/reference/:referenceNumber', getLoanApplication);

// Update loan application status
router.patch('/reference/:referenceNumber', updateLoanStatus);

// Get loans by status
router.get('/status/:status', getLoansByStatus);

// Get user's loan history
router.get('/history/:contactNumber', getUserLoanHistory);

module.exports = router;
