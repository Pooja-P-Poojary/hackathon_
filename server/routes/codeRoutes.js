const express = require("express");

const {
  getAnalytics,
  getWorkload,
  getCancellations,
  getRequests,
} = require("../controllers/analyticsController");

const router = express.Router();


// Get complete analytics
router.get("/", getAnalytics);


// Get faculty workload
router.get("/workload", getWorkload);


// Get cancellation frequency
router.get("/cancellations", getCancellations);


// Get substitution requests + audit
router.get("/requests", getRequests);


module.exports = router;