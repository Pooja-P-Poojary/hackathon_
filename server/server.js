const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const exchangeRoutes = require("./routes/exchangeRoutes");

const app = express();

// Connect MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/exchanges", exchangeRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "ClassFlow API is running",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});