require("dotenv").config();
const axios = require("axios");
const cache = require("../cache");

const createError = require("../Utils/appError.js");
const { ca } = require("date-fns/locale");
const appKey = process.env.ADZUNA_APP_KEY;
const appId = process.env.ADZUNA_APP_ID;
const Job = require("../Models/JobModel.js");
const UserOrg = require("../Models/userOrgModel.js");

exports.searchJobs = async (req, res, next) => {
    try {
        const country = req.body.country || "us";
        const page = 1;
        const what = req.body.what || "";
        const category = req.body.category || "";
        const salary_min = req.body.salary_min || "";
        const salary_max = req.body.salary_max || "";
        const full_time = req.body.full_time;
        const part_time = req.body.part_time;
        const contract = req.body.contract;
        const permanent = req.body.permanent;

        const params = {
            app_key: appKey,
            app_id: appId,
        };

        if (what) params.what = what;
        if (category) params.category = category;
        if (salary_min) params.salary_min = salary_min;
        if (salary_max) params.salary_max = salary_max;
        if (full_time == "1") params.full_time = full_time;
        if (part_time == "1") params.part_time = part_time;
        if (contract == "1") params.contract = contract;
        if (permanent == "1") params.permanent = permanent;

        const response = await axios.get(
            `https://api.adzuna.com/v1/api/jobs/${country}/search/${page}`,
            { params }
        );

        console.log("Adzuna API full response:", response.status);
        if (response.status == 200) {
            // console.log("Adzuna API response:", response.data.results);
            const jobs = (response.data.results || []).map((job) => ({
                id: job.id,
                externalId: job.id,
                title: job.title,
                company: job.company?.display_name || "Unknown",
                location: job.location?.display_name || "Unknown",
                category: job.category?.label || "",
                salary_min: job.salary_min,
                salary_max: job.salary_max,
                description: job.description,
                url: job.redirect_url,
                source: "external",
            }));

            jobs.forEach((job) => {
                cache.set(`job:${job.id}`, job);
            });

            res.json(jobs);
        }
    } catch (error) {
        console.log("Error fetching jobs from Adzuna API:", error);
        next(new createError("Failed to fetch jobs", 500));
    }
};

exports.getAllJobs = async (req, res, next) => {
    try {
        const country = "us";
        const page = 1;

        const params = {
            app_key: appKey,
            app_id: appId,
        };

        const cacheKey = `jobs:${country}:${page}`;

        // Check cache first
        const cached = cache.get(cacheKey);
        if (cached) {
            console.log("Serving from cache");
            return res.json(cached);
        }

        const response = await axios.get(
            `https://api.adzuna.com/v1/api/jobs/${country}/search/${page}`,
            { params }
        );

        // Map Adzuna jobs to your own job model
        const jobs = (response.data.results || []).map((job) => ({
            id: job.id,
            externalId: job.id,
            title: job.title,
            company: job.company?.display_name || "Unknown",
            location: job.location?.display_name || "Unknown",
            category: job.category?.label || "",
            salary_min: job.salary_min,
            salary_max: job.salary_max,
            description: job.description,
            url: job.redirect_url,
            source: "external",
        }));

        cache.set(cacheKey, jobs); // Cache the result

        // Cache individual jobs for quick access by ID
        jobs.forEach((job) => {
            cache.set(`job:${job.id}`, job);
        });

        res.json(jobs);
    } catch (error) {
        console.log("Error fetching jobs from Adzuna API:", error);
        next(new createError("Failed to fetch jobs", 500));
    }
};

exports.getExternalJobById = async (req, res, next) => {
    try {
        const jobId = req.params.id;
        const jobsCacheKey = `job:${jobId}`;
        const cachedJob = cache.get(jobsCacheKey);

        if (cachedJob) {
            return res.json(cachedJob);
        }
        return res.status(404).json({ message: "Job not found" });
    } catch (error) {
        console.log("Error fetching job from Adzuna API:", error);
        next(new createError("Failed to fetch job", 500));
    }
};

exports.createJob = async (req, res, next) => {
    try {
        const userId = req.user_id;
        const orgId = req.body.orgId;
        
        const membership = await UserOrg.findOne({
            userId,
            orgId,
            role: "admin",
        });

        if (!membership) {
            return res.status(403).json({ message: "Unauthorized" });
        }
        const newJob = new Job({
            orgId: req.body.orgId,
            source: "internal",
            title: req.body.title,
            company: req.body.company,
            location: req.body.location,
            category: req.body.category,
            salary_min: req.body.salary_min,
            salary_max: req.body.salary_max,
            description: req.body.description,
            url: req.body.url,
            requirements: req.body.requirements,
            responsibilities: req.body.responsibilities,
            benefits: req.body.benefits,
            jobType: req.body.jobType,
            deadline: req.body.deadline,
            createdBy: userId,
            status: "open",
        });

        await newJob.save();
        res.status(201).json({ message: "Job created successfully" });
    } catch (error) {
        console.log("Error creating job:", error);
        next(new createError("Failed to create job", 500));
    }
};

exports.getOpenInternalJobsByOrg = async (req, res, next) => {
    try {
        const orgId = req.params.orgId;
        const jobs = await Job.find({ orgId, source: "internal" , status: "open" });
        res.json(jobs);
    } catch (error) {
        console.log("Error fetching internal jobs:", error);
        next(new createError("Failed to fetch internal jobs", 500));
    }   
};

exports.getInternalJobById = async (req, res, next) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findOne({ _id: jobId, source: "internal" });
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }
        res.json(job);
    } catch (error) {
        console.log("Error fetching internal job:", error);
        next(new createError("Failed to fetch internal job", 500));
    }
};
