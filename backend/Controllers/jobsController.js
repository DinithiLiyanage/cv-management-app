require("dotenv").config();
const axios = require("axios");

const createError = require("../Utils/appError.js");
const appKey = process.env.ADZUNA_APP_KEY;
const appId = process.env.ADZUNA_APP_ID;

exports.getAllJobs = async (req, res, next) => {
  try {
    const country = "us";
    const page = 1;

    const params = {
      app_key: appKey,
      app_id: appId,
    };

    const response = await axios.get(
      `https://api.adzuna.com/v1/api/jobs/${country}/search/${page}`,
      { params }
    );

    // Map Adzuna jobs to your own job model
    const jobs = (response.data.results || []).map((job) => ({
      id: job.id,
      title: job.title,
      company: job.company?.display_name || "Unknown",
      location: job.location?.display_name || "Unknown",
      category: job.category?.label || "",
      salary_min: job.salary_min,
      salary_max: job.salary_max,
      description: job.description,
      url: job.redirect_url,
    }));
    
    res.json(jobs);
  } catch (error) {
    console.log("Error fetching jobs from Adzuna API:", error);
    next(new createError("Failed to fetch jobs", 500));
  }
};
