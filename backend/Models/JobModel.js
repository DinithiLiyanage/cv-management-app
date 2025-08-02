const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // Adzuna job ID
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  category: { type: String },
  salary_min: { type: Number },
  salary_max: { type: Number },
  description: { type: String },
  url: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Job", JobSchema);
