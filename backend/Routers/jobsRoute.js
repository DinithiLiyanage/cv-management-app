const router = require("express").Router();
const jobsController = require("../Controllers/jobsController");
const authMiddleware = require("../Middleware/authMiddleware");

// External job routes
router.get("", jobsController.getAllJobs);
router.post("/search", jobsController.searchJobs);
router.get("/external/:id", jobsController.getExternalJobById);

// Internal job routes (protected)
router.post("/",authMiddleware, jobsController.createJob);
router.get("/internal/:id", authMiddleware, jobsController.getInternalJobById);
// router.put("/:id", authMiddleware, jobsController.updateJob);
// router.delete("/:id", authMiddleware, jobsController.deleteJob);
router.get("/:orgId", authMiddleware, jobsController.getOpenInternalJobsByOrg);

module.exports = router;
