const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema(
    {
        jobId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        jobSource: {
            type: String,
            enum: ["external", "internal"],
            required: true,
        },
        // Applicant information
        fullName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
        },

        // Application documents
        resumeUrl: {
            type: String,
            required: true,
        },
        
        skills: {
            type: [String],
            default: [],
        },

        // Application details
        coverLetterText: {
            type: String,
        },
        yearsOfExperience: {
            type: Number,
        },
        currentCompany: {
            type: String,
        },
        linkedInUrl: {
            type: String,
        },
        websiteUrl: {
            type: String,
        },
        skills: {
            type: [String],
            default: [],
        },

        // Application status
        status: {
            type: String,
            enum: [
                "pending",
                "reviewing",
                "shortlisted",
                "rejected",
                "accepted",
            ],
            default: "pending",
        },

        // Admin notes
        notes: {
            type: String,
        },

        // Timestamps for status changes
        reviewedAt: {
            type: Date,
        },
        respondedAt: {
            type: Date,
        },
    },
    { timestamps: true },
);

// Indexes
ApplicationSchema.index({ jobId: 1, userId: 1 }, { unique: true }); // Prevent duplicate applications
ApplicationSchema.index({ userId: 1, status: 1 });
ApplicationSchema.index({ jobId: 1, status: 1 });

const Application =
    mongoose.models.Application ||
    mongoose.model("Application", ApplicationSchema);

module.exports = Application;
