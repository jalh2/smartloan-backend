const LoanApplication = require('../models/LoanApplication');

// Create new loan application
exports.createLoanApplication = async (req, res) => {
  try {
    const loanApplication = new LoanApplication({
      ...req.body,
      status: 'pending' // Ensure status is always pending for new applications
    });
    await loanApplication.save();
    res.status(201).json({
      success: true,
      data: loanApplication
    });
  } catch (error) {
    console.error('Loan creation error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create loan application'
    });
  }
};

// Get all loan applications
exports.getAllLoanApplications = async (req, res) => {
  try {
    const loanApplications = await LoanApplication.find()
      .sort({ createdAt: -1 }); // Most recent first
    
    // Convert all status values to lowercase for consistency
    const formattedLoans = loanApplications.map(loan => {
      const loanObj = loan.toObject();
      if (loanObj.status) {
        loanObj.status = loanObj.status.toLowerCase();
      }
      return loanObj;
    });
    
    res.status(200).json({
      success: true,
      count: formattedLoans.length,
      data: formattedLoans
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get single loan application by reference number
exports.getLoanByReference = async (req, res) => {
  try {
    const loanApplication = await LoanApplication.findOne({ 
      referenceNumber: req.params.referenceNumber 
    });

    if (!loanApplication) {
      return res.status(404).json({
        success: false,
        message: 'Loan application not found'
      });
    }

    // Convert status to lowercase for consistency
    const loanObj = loanApplication.toObject();
    if (loanObj.status) {
      loanObj.status = loanObj.status.toLowerCase();
    }

    res.status(200).json({
      success: true,
      data: loanObj
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update loan status by reference number
exports.updateLoanStatus = async (req, res) => {
  try {
    let { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    // Convert status to lowercase for consistency
    status = status.toLowerCase();

    // Validate status
    const validStatuses = ['pending', 'approved', 'rejected', 'awaiting_payment', 'paid'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: ' + validStatuses.join(', ')
      });
    }

    const loanApplication = await LoanApplication.findOne({ 
      referenceNumber: req.params.referenceNumber 
    });

    if (!loanApplication) {
      return res.status(404).json({
        success: false,
        message: 'Loan application not found'
      });
    }

    // Update status and save
    loanApplication.status = status;
    await loanApplication.save();

    // Convert response status to lowercase for consistency
    const loanObj = loanApplication.toObject();
    loanObj.status = loanObj.status.toLowerCase();

    res.status(200).json({
      success: true,
      data: loanObj
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
