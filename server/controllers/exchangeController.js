const Exchange = require("../models/Exchange");


// GET pending HOD approvals
const getPendingApprovals = async (req, res) => {
  try {
    const exchanges = await Exchange.find({
      status: "PENDING_HOD",
    }).sort({ createdAt: -1 });

    res.status(200).json(exchanges);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch pending approvals",
      error: error.message,
    });
  }
};


// APPROVE or REJECT an exchange
const updateExchangeDecision = async (req, res) => {
  try {
    const { action, comment } = req.body;

    const exchange = await Exchange.findById(req.params.id);

    if (!exchange) {
      return res.status(404).json({
        message: "Exchange request not found",
      });
    }

    // Make sure only pending requests can be approved/rejected
    if (exchange.status !== "PENDING_HOD") {
      return res.status(400).json({
        message: `Exchange is already ${exchange.status}`,
      });
    }

    if (action === "approve") {
      exchange.status = "APPROVED";
      exchange.hodComment = comment || "";
    } 
    
    else if (action === "reject") {
      exchange.status = "REJECTED";
      exchange.hodComment = comment || "";
    } 
    
    else {
      return res.status(400).json({
        message: "Invalid action. Use approve or reject.",
      });
    }

    await exchange.save();

    res.status(200).json({
      message: `Exchange ${action}d successfully`,
      exchange,
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to update exchange",
      error: error.message,
    });
  }
};


module.exports = {
  getPendingApprovals,
  updateExchangeDecision,
};