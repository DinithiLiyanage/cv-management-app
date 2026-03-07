const router = require("express").Router();
const applicationController = require("../Controllers/applicationController");
const authMiddleware = require("../Middleware/authMiddleware");

// All routes require authentication
router.use(authMiddleware);

// Application routes
router.post("/", applicationController.createApplication);
router.get("/user", applicationController.getUserApplications);
router.get("/job/:jobId/user", applicationController.getUserApplicationForJob);
router.get("/:id", applicationController.getApplicationById);
router.put("/:id", applicationController.updateApplication);
router.delete("/:id", applicationController.deleteApplication);

// Admin routes for job applications
router.get("/job/:jobId", applicationController.getJobApplications);
router.put("/:id/status", applicationController.updateApplicationStatus);

module.exports = router;
