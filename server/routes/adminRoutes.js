const express = require("express");

const {
  getDashboardStats,
  getAllUsers,
  getStudents,
  getRecruiters,
  getAllInternships,
  getPendingInternships,
  getAllApplications,
  deleteUser,
  rejectInternship,
} = require("../controllers/adminController");

const protect = require("../middleware/protect");
const role = require("../middleware/role");

const router = express.Router();

// Dashboard statistics
router.get(
  "/dashboard",
  protect,
  role("admin"),
  getDashboardStats
);

// Users
router.get(
  "/users",
  protect,
  role("admin"),
  getAllUsers
);

router.get(
  "/students",
  protect,
  role("admin"),
  getStudents
);

router.get(
  "/recruiters",
  protect,
  role("admin"),
  getRecruiters
);

// Delete user
router.delete(
  "/users/:id",
  protect,
  role("admin"),
  deleteUser
);

// Internships
router.get(
  "/internships",
  protect,
  role("admin"),
  getAllInternships
);

router.get(
  "/internships/pending",
  protect,
  role("admin"),
  getPendingInternships
);

// Reject internship
router.patch(
  "/internships/:id/reject",
  protect,
  role("admin"),
  rejectInternship
);

// Applications
router.get(
  "/applications",
  protect,
  role("admin"),
  getAllApplications
);

module.exports = router;