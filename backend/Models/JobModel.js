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
        location: { type: String },
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
JobSchema.index({ deadline: 1, status: 1 }); // Index for deadline queries

// Static method to check and update expired jobs
JobSchema.statics.updateExpiredJobs = async function () {
    const now = new Date();
    const result = await this.updateMany(
        {
            status: "open",
            deadline: { $lt: now },
            source: "internal",
        },
        {
            $set: { status: "closed" },
        },
    );
    return result.modifiedCount;
};

// Pre-find hook to automatically close expired jobs when querying
JobSchema.pre(/^find/, async function () {
    // Only run for internal job queries
    const query = this.getQuery();
    if (query.source === "internal" || query._id) {
        const now = new Date();
        await this.model.updateMany(
            {
                status: "open",
                deadline: { $lt: now },
                source: "internal",
            },
            {
                $set: { status: "closed" },
            },
        );
    }
});

module.exports = mongoose.model("Job", JobSchema);
