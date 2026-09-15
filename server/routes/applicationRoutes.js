const express = require("express");

const {
  applyForInternship,
  getMyApplications,
  getRecruiterApplications,
  updateApplicationStatus,
} = require("../controllers/applicationController");

const protect = require("../middleware/protect");
const role = require("../middleware/role");

const router = express.Router();

// Student: apply for an internship
router.post(
  "/",
  protect,
  role("student"),
  applyForInternship
);

// Student: view own applications
router.get(
  "/mine",
  protect,
  role("student"),
  getMyApplications
);

// Recruiter: view applications received
router.get(
  "/recruiter",
  protect,
  role("recruiter"),
  getRecruiterApplications
);

// Recruiter: update application status
router.patch(
  "/:id/status",
  protect,
  role("recruiter"),
  updateApplicationStatus
);

module.exports = router;