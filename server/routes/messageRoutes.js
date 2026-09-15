const express = require("express");

const {
  getMessages,
  sendMessage,
  markMessagesAsRead,
} = require("../controllers/messageController");

const protect = require("../middleware/protect");

const router = express.Router();

// Get conversation with another user
router.get("/:userId", protect, getMessages);

// Send a message
router.post("/", protect, sendMessage);

// Mark messages from another user as read
router.patch("/:userId/read", protect, markMessagesAsRead);

module.exports = router;