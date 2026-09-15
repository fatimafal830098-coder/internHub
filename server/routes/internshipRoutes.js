const express = require("express");

const {
  createInternship,
  getInternships,
  getRecruiterInternships,
  getInternshipById,
  updateInternship,
  deleteInternship,
  approveInternship,
} = require("../controllers/internshipController");

const protect = require("../middleware/protect");
const role = require("../middleware/role");

const router = express.Router();

// Public: get all approved internships
router.get("/", getInternships);

// Recruiter: get own internships
router.get(
  "/recruiter",
  protect,
  role("recruiter"),
  getRecruiterInternships
);

// Get one internship
router.get("/:id", getInternshipById);

// Recruiter: create internship
router.post(
  "/",
  protect,
  role("recruiter"),
  createInternship
);

// Recruiter: update own internship
router.put(
  "/:id",
  protect,
  role("recruiter"),
  updateInternship
);

// Recruiter: delete own internship
router.delete(
  "/:id",
  protect,
  role("recruiter"),
  deleteInternship
);

// Admin: approve internship
router.patch(
  "/:id/approve",
  protect,
  role("admin"),
  approveInternship
);

module.exports = router;