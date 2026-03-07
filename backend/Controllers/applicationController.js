const Application = require("../Models/ApplicationModel");
const Job = require("../Models/JobModel");
const createError = require("../Utils/appError");

// Submit a new application
exports.createApplication = async (req, res, next) => {
    try {
        const userId = req.user_id;
        const {
            jobId,
            jobSource,
            fullName,
            email,
            phone,
            resumeUrl,
            coverLetterText,
            yearsOfExperience,
            currentCompany,
            linkedInUrl,
            websiteUrl,
            skills,
        } = req.body;

        // Check if user has already applied for this job
        const existingApplication = await Application.findOne({
            jobId,
            userId,
        });

        if (existingApplication) {
            return res.status(400).json({
                message:
                    "You have already applied for this job. Use the edit feature to update your application.",
                applicationId: existingApplication._id,
            });
        }

        // Verify job exists for internal jobs
        if (jobSource === "internal") {
            const job = await Job.findById(jobId);
            if (!job) {
                return res.status(404).json({ message: "Job not found" });
            }
            if (job.status !== "open") {
                return res.status(400).json({
                    message: "This job is no longer accepting applications",
                });
            }
        }

        const newApplication = new Application({
            jobId,
            userId,
            jobSource,
            fullName,
            email,
            phone,
            resumeUrl,
            coverLetterText,
            yearsOfExperience,
            currentCompany,
            linkedInUrl,
            websiteUrl,
            skills,
            status: "pending",
        });

        await newApplication.save();

        res.status(201).json({
            message: "Application submitted successfully",
            applicationId: newApplication._id,
        });
    } catch (error) {
        console.log("Error creating application:", error);
        if (error.code === 11000) {
            return res.status(400).json({
                message: "You have already applied for this job",
            });
        }
        next(new createError("Failed to submit application", 500));
    }
};

// Get all applications by a user
exports.getUserApplications = async (req, res, next) => {
    try {
        const userId = req.user_id;
        const applications = await Application.find({ userId })
            .populate(
                "jobId",
                "title company location salary_min salary_max status",
            )
            .sort({ createdAt: -1 });

        res.json(applications);
    } catch (error) {
        console.log("Error fetching user applications:", error);
        next(new createError("Failed to fetch applications", 500));
    }
};

// Get a single application by ID
exports.getApplicationById = async (req, res, next) => {
    try {
        const userId = req.user_id;
        const applicationId = req.params.id;

        const application = await Application.findOne({
            _id: applicationId,
            userId,
        }).populate(
            "jobId",
            "title company location category salary_min salary_max deadline status",
        );

        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }

        res.json(application);
    } catch (error) {
        console.log("Error fetching application:", error);
        next(new createError("Failed to fetch application", 500));
    }
};

// Get user's application for a specific job
exports.getUserApplicationForJob = async (req, res, next) => {
    try {
        const userId = req.user_id;
        const jobId = req.params.jobId;

        const application = await Application.findOne({
            jobId,
            userId,
        }).populate(
            "jobId",
            "title company location category salary_min salary_max deadline status",
        );

        if (!application) {
            return res.status(404).json({ message: "No application found" });
        }

        res.json(application);
    } catch (error) {
        console.log("Error fetching application:", error);
        next(new createError("Failed to fetch application", 500));
    }
};

// Update an application (user can edit their own application)
exports.updateApplication = async (req, res, next) => {
    try {
        const userId = req.user_id;
        const applicationId = req.params.id;
        const {
            fullName,
            email,
            phone,
            resumeUrl,
            coverLetterUrl,
            portfolioUrl,
            additionalDocuments,
            coverLetterText,
            yearsOfExperience,
            currentCompany,
            linkedInUrl,
            websiteUrl,
            skills,
        } = req.body;

        const application = await Application.findOne({
            _id: applicationId,
            userId,
        }).populate("jobId");

        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }

        // Check if job is still open/before deadline
        if (application.jobSource === "internal") {
            const job = application.jobId;
            if (job.status === "closed" || job.status === "filled") {
                return res.status(400).json({
                    message: "This job is no longer accepting applications",
                });
            }
            if (job.deadline && new Date(job.deadline) < new Date()) {
                return res.status(400).json({
                    message: "Application deadline has passed",
                });
            }
        }

        // Update fields
        if (fullName) application.fullName = fullName;
        if (email) application.email = email;
        if (phone !== undefined) application.phone = phone;
        if (resumeUrl) application.resumeUrl = resumeUrl;
        if (coverLetterUrl !== undefined)
            application.coverLetterUrl = coverLetterUrl;
        if (portfolioUrl !== undefined) application.portfolioUrl = portfolioUrl;
        if (additionalDocuments !== undefined)
            application.additionalDocuments = additionalDocuments;
        if (coverLetterText !== undefined)
            application.coverLetterText = coverLetterText;
        if (yearsOfExperience !== undefined)
            application.yearsOfExperience = yearsOfExperience;
        if (currentCompany !== undefined)
            application.currentCompany = currentCompany;
        if (linkedInUrl !== undefined) application.linkedInUrl = linkedInUrl;
        if (websiteUrl !== undefined) application.websiteUrl = websiteUrl;
        if (skills !== undefined) application.skills = skills;

        await application.save();

        res.json({
            message: "Application updated successfully",
            application,
        });
    } catch (error) {
        console.log("Error updating application:", error);
        next(new createError("Failed to update application", 500));
    }
};

// Get all applications for a specific job (for organization admins)
exports.getJobApplications = async (req, res, next) => {
    try {
        const userId = req.user_id;
        const jobId = req.params.jobId;

        // Verify the job belongs to user's organization and user is admin
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        // Check authorization (user must be admin of the org that posted the job)
        const UserOrg = require("../Models/userOrgModel");
        const membership = await UserOrg.findOne({
            userId,
            orgId: job.orgId,
            role: "admin",
        });

        if (!membership) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const applications = await Application.find({ jobId })
            .populate("userId", "firstName lastName email")
            .sort({ createdAt: -1 });

        res.json(applications);
    } catch (error) {
        console.log("Error fetching job applications:", error);
        next(new createError("Failed to fetch applications", 500));
    }
};

// Update application status (for organization admins)
exports.updateApplicationStatus = async (req, res, next) => {
    try {
        const userId = req.user_id;
        const applicationId = req.params.id;
        const { status, notes } = req.body;

        const application =
            await Application.findById(applicationId).populate("jobId");
        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }

        // Check authorization
        const UserOrg = require("../Models/userOrgModel");
        const membership = await UserOrg.findOne({
            userId,
            orgId: application.jobId.orgId,
            role: "admin",
        });

        if (!membership) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        application.status = status;
        if (notes) application.notes = notes;

        if (status === "reviewing" && !application.reviewedAt) {
            application.reviewedAt = new Date();
        }
        if (
            ["accepted", "rejected"].includes(status) &&
            !application.respondedAt
        ) {
            application.respondedAt = new Date();
        }

        await application.save();

        res.json({
            message: "Application status updated successfully",
            application,
        });
    } catch (error) {
        console.log("Error updating application:", error);
        next(new createError("Failed to update application", 500));
    }
};

// Delete/withdraw application
exports.deleteApplication = async (req, res, next) => {
    try {
        const userId = req.user_id;
        const applicationId = req.params.id;

        const application = await Application.findOne({
            _id: applicationId,
            userId,
        });

        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }

        // Only allow withdrawal if status is pending
        if (application.status !== "pending") {
            return res.status(400).json({
                message:
                    "Cannot withdraw application that is already being reviewed",
            });
        }

        await Application.deleteOne({ _id: applicationId });

        res.json({ message: "Application withdrawn successfully" });
    } catch (error) {
        console.log("Error deleting application:", error);
        next(new createError("Failed to delete application", 500));
    }
};
