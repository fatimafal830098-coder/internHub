const express = require("express");

const {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} = require("../controllers/notificationController");

const protect = require("../middleware/protect");

const router = express.Router();

// Get logged-in user's notifications
router.get("/", protect, getNotifications);

// Mark all notifications as read
router.patch("/read-all", protect, markAllNotificationsAsRead);

// Mark one notification as read
router.patch("/:id/read", protect, markNotificationAsRead);

module.exports = router;