const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const exchangeRoutes = require("./routes/exchangeRoutes");
const codeRoutes = require("./routes/codeRoutes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/exchanges", exchangeRoutes);
app.use("/api/analytics", codeRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "ClassFlow API is running",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});