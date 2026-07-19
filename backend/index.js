const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const {
    scheduleJobStatusUpdates,
    checkExpiredJobsNow,
} = require("./Utils/jobScheduler");

const PORT = process.env.PORT || 3001;

const app = express();

const cleanupOrganizationIndexes = async () => {
    try {
        const indexes = await mongoose.connection.db
            .collection("organizations")
            .indexes();
        const legacyIndex = indexes.find((index) => index.name === "id_1");

        if (legacyIndex) {
            await mongoose.connection.db
                .collection("organizations")
                .dropIndex("id_1");
            console.log("Dropped legacy organizations.id index");
        }
    } catch (error) {
        console.warn("Skipping organization index cleanup:", error.message);
    }
};

// Middlewares
app.use(cors());
app.use(express.json());

// Route
app.use("/api/auth", require("./Routers/authRoute"));
app.use("/api/jobs", require("./Routers/jobsRoute"));
app.use("/api/user", require("./Routers/userRoute"));
app.use("/api/organizations", require("./Routers/orgRoute"));
app.use("/api/applications", require("./Routers/applicationRoute"));

const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/JobApp";

// Mongo DB connection
mongoose
    .connect(mongoUri)
    .then(() => {
        console.log("Connected to MongoDB!");

        cleanupOrganizationIndexes();

        // Check for expired jobs immediately on startup
        checkExpiredJobsNow();

        // Start the scheduled task for auto-closing expired jobs
        scheduleJobStatusUpdates();
    })
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
