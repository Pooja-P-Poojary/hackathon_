const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = require("./config/db");
const Exchange = require("./models/Exchange");

const seedData = async () => {
  try {
    await connectDB();

    // Remove existing exchange data
    await Exchange.deleteMany({});

    // Create dummy exchange request
    const exchange = await Exchange.create({
      originalFaculty: "Prof. A",
      substituteFaculty: "Prof. B",
      course: "Computer Networks",
      date: "Tuesday",
      startTime: "10:00",
      endTime: "11:00",
      room: "Lab 2",
      reason: "Medical Leave",
      exchangeType: "ONE_WAY",
      status: "PENDING_HOD",
    });

    console.log("Dummy exchange created:");
    console.log(exchange);

    process.exit();
  } catch (error) {
    console.error("Seed Error:", error.message);
    process.exit(1);
  }
};

seedData();