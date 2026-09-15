const express = require("express");

const {
  getProfile,
  updateProfile,
  getAllUsers,
  updateRecruiterApproval,
} = require("../controllers/userController");

const protect = require("../middleware/protect");
const role = require("../middleware/role");
const upload = require("../middleware/upload");

const router = express.Router();

// Get logged-in user's profile
router.get(
  "/profile",
  protect,
  getProfile
);

// Update profile with profile image, resume and company logo
router.put(
  "/profile",
  protect,
  upload.fields([
    {
      name: "profileImage",
      maxCount: 1,
    },
    {
      name: "resume",
      maxCount: 1,
    },
    {
      name: "companyLogo",
      maxCount: 1,
    },
  ]),
  updateProfile
);

// Admin: get all users
router.get(
  "/all",
  protect,
  role("admin"),
  getAllUsers
);

// Admin: approve/reject recruiter
router.patch(
  "/recruiters/:id/approval",
  protect,
  role("admin"),
  updateRecruiterApproval
);

module.exports = router;