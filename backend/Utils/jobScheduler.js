const cron = require("node-cron");
const Job = require("../Models/JobModel");

/**
 * Scheduled task to automatically close jobs past their deadline
 * Runs every hour to check for expired job postings
 */
const scheduleJobStatusUpdates = () => {
    // Run every hour at minute 0 (e.g., 1:00, 2:00, 3:00, etc.)
    cron.schedule("0 * * * *", async () => {
        try {
            console.log("Running job deadline check...");

            const now = new Date();

            // Find all open jobs with deadlines that have passed
            const result = await Job.updateMany(
                {
                    status: "open",
                    deadline: { $lt: now },
                    source: "internal", // Only update internal jobs
                },
                {
                    $set: { status: "closed" },
                },
            );

            if (result.modifiedCount > 0) {
                console.log(
                    `✓ Closed ${result.modifiedCount} job(s) past deadline`,
                );
            }
        } catch (error) {
            console.error("Error updating job statuses:", error);
        }
    });

    console.log("✓ Job status scheduler started (runs every hour)");
};

/**
 * Immediately check and update expired jobs on server start
 */
const checkExpiredJobsNow = async () => {
    try {
        console.log("Checking for expired jobs on startup...");

        const now = new Date();

        const result = await Job.updateMany(
            {
                status: "open",
                deadline: { $lt: now },
                source: "internal",
            },
            {
                $set: { status: "closed" },
            },
        );

        if (result.modifiedCount > 0) {
            console.log(
                `✓ Closed ${result.modifiedCount} job(s) past deadline on startup`,
            );
        } else {
            console.log("✓ No expired jobs found");
        }
    } catch (error) {
        console.error("Error checking expired jobs on startup:", error);
    }
};

module.exports = {
    scheduleJobStatusUpdates,
    checkExpiredJobsNow,
};
