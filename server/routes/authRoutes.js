const express = require("express");

const {
  register,
  login,
  logout,
  getMe,
} = require("../controllers/authController");

const protect = require("../middleware/protect");

const router = express.Router();

// Register
router.post("/register", register);

// Login
router.post("/login", login);

// Logout
router.post("/logout", logout);

// Get currently logged-in user
router.get("/me", protect, getMe);

module.exports = router;