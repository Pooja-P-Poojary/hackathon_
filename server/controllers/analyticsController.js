// server/controllers/analyticsController.js

// Analytics data
// This is the backend version of the data currently used
// by the Analytics frontend.

const workload = [
  {
    name: "Prof. A",
    dept: "Computer Networks",
    hrs: 16,
    max: 20,
    given: 2,
    received: 1,
    net: -1,
  },
  {
    name: "Prof. B",
    dept: "Database Systems",
    hrs: 18,
    max: 20,
    given: 1,
    received: 3,
    net: 2,
  },
  {
    name: "Prof. C",
    dept: "Operating Systems",
    hrs: 14,
    max: 20,
    given: 0,
    received: 1,
    net: 1,
  },
  {
    name: "Prof. D",
    dept: "Java Programming",
    hrs: 19,
    max: 20,
    given: 3,
    received: 0,
    net: -3,
  },
  {
    name: "Prof. E",
    dept: "Artificial Intelligence",
    hrs: 12,
    max: 20,
    given: 1,
    received: 1,
    net: 0,
  },
];

const cancellations = [
  {
    name: "Prof. A",
    count: 1,
  },
  {
    name: "Prof. D",
    count: 2,
  },
  {
    name: "Prof. C",
    count: 0,
  },
];

const requests = [
  {
    id: "#1024",
    course: "Computer Networks",
    when: "Tuesday · 10:00–11:00 AM · Lab 2",
    status: "cancelled",
    original: "Prof. A",
    substitute: "Prof. B",
    reason:
      "Medical leave — requires 2 days off for a scheduled procedure.",

    flow: [
      {
        who: "Prof. A",
        what: "Request initiated",
      },
      {
        who: "Prof. B",
        what: "Peer accepted",
      },
      {
        who: "HOD",
        what: "Approved",
      },
      {
        who: "Prof. A",
        what: "Cancelled after approval",
      },
    ],

    audit: [
      {
        actor: "Prof. A",
        action: "Initiated substitution request",
        ts: "10:02 AM",
        type: "",
      },
      {
        actor: "Prof. B",
        action: "Accepted request",
        ts: "10:07 AM",
        type: "approve",
      },
      {
        actor: "HOD",
        action: "Approved substitution",
        ts: "10:15 AM",
        type: "approve",
        comment:
          "Conflict check clear, workload within limit.",
      },
      {
        actor: "Prof. A",
        action: "Cancelled substitution",
        ts: "9:30 AM (next day)",
        type: "cancel",
        comment:
          "Duty postponed — original class resumed.",
      },
    ],
  },

  {
    id: "#1031",
    course: "Database Systems",
    when: "Thursday · 2:00–3:00 PM · Room 4B",
    status: "pending",
    original: "Prof. C",
    substitute: "Prof. E",
    reason: "Attending departmental workshop off-campus.",

    flow: [
      {
        who: "Prof. C",
        what: "Request initiated",
      },
      {
        who: "Prof. E",
        what: "Awaiting response",
      },
    ],

    audit: [
      {
        actor: "Prof. C",
        action: "Initiated substitution request",
        ts: "9:14 AM",
        type: "",
      },
      {
        actor: "Prof. E",
        action: "Request pending peer response",
        ts: "—",
        type: "",
      },
    ],
  },

  {
    id: "#1037",
    course: "Operating Systems",
    when: "Friday · 11:00 AM–12:00 PM · Lab 1",
    status: "declined",
    original: "Prof. D",
    substitute: "Prof. C",
    reason: "Personal emergency.",

    flow: [
      {
        who: "Prof. D",
        what: "Request initiated",
      },
      {
        who: "Prof. C",
        what: "Declined — schedule conflict",
      },
    ],

    audit: [
      {
        actor: "Prof. D",
        action: "Initiated substitution request",
        ts: "8:40 AM",
        type: "",
      },
      {
        actor: "Prof. C",
        action: "Declined request",
        ts: "8:52 AM",
        type: "decline",
        comment:
          "Already covering another slot at this time.",
      },
    ],
  },
];


// ==========================================
// GET ALL ANALYTICS
// ==========================================

const getAnalytics = async (req, res) => {
  try {
    const totalRequests = 18;
    const approved = 12;
    const declined = 3;
    const withdrawn = 1;
    const cancelled = 2;

    res.status(200).json({
      success: true,

      statistics: {
        totalRequests,
        approved,
        declined,
        withdrawn,
        cancelled,
      },

      workload,

      cancellations,

      requests,
    });
  } catch (error) {
    console.error("Analytics error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load analytics",
      error: error.message,
    });
  }
};


// ==========================================
// GET WORKLOAD
// ==========================================

const getWorkload = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: workload,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load workload data",
    });
  }
};


// ==========================================
// GET CANCELLATIONS
// ==========================================

const getCancellations = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: cancellations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load cancellation data",
    });
  }
};


// ==========================================
// GET REQUESTS + AUDIT
// ==========================================

const getRequests = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: requests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load request data",
    });
  }
};


module.exports = {
  getAnalytics,
  getWorkload,
  getCancellations,
  getRequests,
};