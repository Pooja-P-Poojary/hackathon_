const mongoose = require("mongoose");
const User = require("./models/User");
const Exchange = require("./models/exchange");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const seedDemoData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    // Clear existing demo users/exchanges
    await User.deleteMany({
      email: {
        $in: ["faculty@demo.com", "hod@demo.com"],
      },
    });

    await Exchange.deleteMany({
      course: "Computer Networks",
    });

    // -----------------------------
    // CREATE DEMO USERS
    // -----------------------------

    const hashedPassword = await bcrypt.hash("Demo@123", 10);

const faculty = await User.create({
  name: "Prof. A",
  email: "faculty@demo.com",
  password: hashedPassword,
  role: "faculty",
});

const hod = await User.create({
  name: "HOD",
  email: "hod@demo.com",
  password: hashedPassword,
  role: "hod",
});
    console.log("Demo users created");

    // -----------------------------
    // CREATE DEMO EXCHANGE REQUEST
    // -----------------------------

    const exchange = await Exchange.create({
      originalFaculty: faculty.name,
      substituteFaculty: "Prof. B",
      course: "Computer Networks",
      date: "Tuesday",
      startTime: "10:00 AM",
      endTime: "11:00 AM",
      room: "Lab 2",
      reason: "Medical leave — requires 2 days off.",
      exchangeType: "ONE_WAY",
      status: "PENDING_HOD",
      hodComment: "",
    });

    console.log("Demo exchange request created");

    console.log("\n==============================");
    console.log("DEMO LOGIN DETAILS");
    console.log("==============================");

    console.log("Faculty:");
    console.log("Email: faculty@demo.com");
    console.log("Password: Demo@123");

    console.log("\nHOD:");
    console.log("Email: hod@demo.com");
    console.log("Password: Demo@123");

    console.log("\nExchange ID:", exchange._id);

    console.log("==============================\n");

    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
};

seedDemoData();