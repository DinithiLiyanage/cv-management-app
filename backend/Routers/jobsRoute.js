const router = require("express").Router();
const jobsController = require("../Controllers/jobsController");
const authMiddleware = require("../Middleware/authMiddleware");

// Search jobs (both external and internal)
router.post("/search", jobsController.searchJobs);

// External job routes
router.get("", jobsController.getAllExternalJobs);
router.get("/external/:id", jobsController.getExternalJobById);

// Internal job routes
router.get("/internal", jobsController.getAllInternalJobs);
router.get("/internal/:id", authMiddleware, jobsController.getInternalJobById);
router.post("/", authMiddleware, jobsController.createJob);
router.get(
    "/org/:orgId",
    authMiddleware,
    jobsController.getOpenInternalJobsByOrg,
);

module.exports = router;
