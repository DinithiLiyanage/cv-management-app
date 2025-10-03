const router = require("express").Router();
const jobsController = require("../Controllers/jobsController");
const authMiddleware = require("../Middleware/authMiddleware");

router.get("", jobsController.getAllJobs);
router.post("/search", jobsController.searchJobs);
router.get("/:id", jobsController.getJobById);

module.exports = router;
