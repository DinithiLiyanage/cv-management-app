const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const PORT = process.env.PORT || 3001;

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Route
app.use("/api/auth", require("./Routers/authRoute"));
app.use("/api/jobs", require("./Routers/jobsRoute"));

// Mongo DB connection
mongoose
  .connect("mongodb://127.0.0.1:27017/JobApp")
  .then(() => console.log("Connected to MongoDB!"))
  .catch((error) => console.error("Failed to connect:", error));

// Global error handler
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

// Server
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
