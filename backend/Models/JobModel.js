const mongoose = require("mongoose");
const { textSpanIntersection } = require("typescript");

const JobSchema = new mongoose.Schema(
    {
        externalId: { type: String, unique: true, sparse: true }, // Adzuna job ID
        orgId: { type: mongoose.Schema.Types.ObjectId, ref: "Organization" },
        source: {
            type: String,
            enum: ["external", "internal"],
            default: "external",
        },
        title: { type: String, required: true },
        company: { type: String },
        location: { type: String},
        category: { type: String },
        salary_min: { type: Number },
        salary_max: { type: Number },
        description: { type: String },
        url: { type: String },

        // Company-specific fields
        requirements: { type: [String] }, // Job requirements
        responsibilities: { type: [String] }, // Job responsibilities
        benefits: { type: [String] }, // Company benefits

        // Job status
        status: {
            type: String,
            enum: ["open", "filled", "closed"],
            default: "open",
        },

        // Job type
        jobType: {
            type: [String],
            enum: [
                "full_time",
                "part_time",
                "contract",
                "permanent",
                "internship",
            ],
            default: ["full_time"],
        },

        // Application deadline
        deadline: { type: Date },

        // Created by (admin user)
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true },
);

JobSchema.index({ orgId: 1, status: 1 });
JobSchema.index({ source: 1 });

module.exports = mongoose.model("Job", JobSchema);
