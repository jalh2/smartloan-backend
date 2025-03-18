const LoanApplication = require('../models/LoanApplication');

// Create new loan application
exports.createLoanApplication = async (req, res) => {
  try {
    const loanApplication = new LoanApplication(req.body);
    await loanApplication.save();
    res.status(201).json({
      success: true,
      data: loanApplication
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Get all loan applications
exports.getAllLoanApplications = async (req, res) => {
  try {
    const loanApplications = await LoanApplication.find()
      .sort({ createdAt: -1 }); // Most recent first
    
    res.status(200).json({
      success: true,
      count: loanApplications.length,
      data: loanApplications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get single loan application by reference number
exports.getLoanApplication = async (req, res) => {
  try {
    const loanApplication = await LoanApplication.findOne({
      referenceNumber: req.params.referenceNumber
    });

    if (!loanApplication) {
      return res.status(404).json({
        success: false,
        error: 'Loan application not found'
      });
    }

    res.status(200).json({
      success: true,
      data: loanApplication
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Update loan application status
exports.updateLoanStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const loanApplication = await LoanApplication.findOneAndUpdate(
      { referenceNumber: req.params.referenceNumber },
      { status },
      { new: true, runValidators: true }
    );

    if (!loanApplication) {
      return res.status(404).json({
        success: false,
        error: 'Loan application not found'
      });
    }

    res.status(200).json({
      success: true,
      data: loanApplication
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Get loan applications by status
exports.getLoansByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const loanApplications = await LoanApplication.find({ status })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: loanApplications.length,
      data: loanApplications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get user's loan history by contact number
exports.getUserLoanHistory = async (req, res) => {
  try {
    const { contactNumber } = req.params;
    const loanHistory = await LoanApplication.find({ contactNumber })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: loanHistory.length,
      data: loanHistory
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
