const express = require("express");

const {
  getPendingApprovals,
  updateExchangeDecision,
} = require("../controllers/exchangeController");

const router = express.Router();


// Get pending HOD approvals
router.get(
  "/pending-approval",
  getPendingApprovals
);


// Approve / Reject exchange
router.patch(
  "/:id",
  updateExchangeDecision
);


module.exports = router;