const mongoose = require("mongoose");

const exchangeSchema = new mongoose.Schema(
  {
    originalFaculty: {
      type: String,
      required: true,
    },

    substituteFaculty: {
      type: String,
      required: true,
    },

    course: {
      type: String,
      required: true,
    },

    date: {
      type: String,
      required: true,
    },

    startTime: {
      type: String,
      required: true,
    },

    endTime: {
      type: String,
      required: true,
    },

    room: {
      type: String,
      required: true,
    },

    reason: {
      type: String,
      required: true,
    },

    exchangeType: {
      type: String,
      enum: ["ONE_WAY", "MUTUAL_SWAP"],
      required: true,
    },

    status: {
      type: String,
      enum: [
        "INITIATED",
        "ACCEPTED_BY_PEER",
        "DECLINED_BY_PEER",
        "PENDING_HOD",
        "APPROVED",
        "REJECTED",
        "WITHDRAWN",
        "CANCELLED",
      ],
      default: "INITIATED",
    },

    hodComment: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Exchange", exchangeSchema);