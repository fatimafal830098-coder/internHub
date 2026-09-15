import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import api from "../api";
import { clearUser } from "../redux/authSlice";
import NotificationPanel from "./NotificationPanel";

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) {
        setNotifications([]);
        return;
      }

      try {
        const response = await api.get("/notifications");

        setNotifications(
          Array.isArray(response.data)
            ? response.data
            : response.data.notifications || []
        );
      } catch (error) {
        console.error(
          "Failed to load notifications:",
          error
        );
      }
    };

    fetchNotifications();
  }, [user]);

  // Mark one notification as read
  const handleRead = async (notificationId) => {
    try {
      await api.patch(
        `/notifications/${notificationId}/read`
      );

      setNotifications((currentNotifications) =>
        currentNotifications.map((notification) =>
          notification._id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );
    } catch (error) {
      console.error(
        "Failed to mark notification as read:",
        error
      );
    }
  };

  // Mark all notifications as read
  const handleReadAll = async () => {
    try {
      await api.patch("/notifications/read-all");

      setNotifications((currentNotifications) =>
        currentNotifications.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );
    } catch (error) {
      console.error(
        "Failed to mark all notifications as read:",
        error
      );
    }
  };

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      dispatch(clearUser());
      setNotifications([]);
      navigate("/login");
    }
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">InternHub</Link>
      </div>

      <div className="navbar-links">
        <Link to="/">Home</Link>

        <Link to="/internships">
          Internships
        </Link>

        {!user && (
          <>
            <Link to="/login">Login</Link>

            <Link to="/register">
              Register
            </Link>
          </>
        )}

        {user?.role === "student" && (
          <>
            <Link to="/applications">
              Applications
            </Link>

            <Link to="/profile">
              Profile
            </Link>

            <Link to="/chat">
              Chat
            </Link>
          </>
        )}

        {user?.role === "recruiter" && (
          <>
            <Link to="/recruiter-dashboard">
              Dashboard
            </Link>

            <Link to="/applications">
              Applications
            </Link>

            <Link to="/profile">
              Profile
            </Link>

            <Link to="/chat">
              Chat
            </Link>
          </>
        )}

        {user?.role === "admin" && (
          <>
            <Link to="/admin-dashboard">
              Admin Dashboard
            </Link>

            <Link to="/profile">
              Profile
            </Link>
          </>
        )}

        {user && (
          <>
            {/* Notification Bell */}
            <div className="notification-wrapper">
              <button
                type="button"
                className="notification-button"
                onClick={() =>
                  setShowNotifications(
                    !showNotifications
                  )
                }
                aria-label="Notifications"
              >
                🔔

                {unreadCount > 0 && (
                  <span className="notification-badge">
                    {unreadCount > 99
                      ? "99+"
                      : unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="notification-dropdown">
                  <NotificationPanel
                    notifications={notifications}
                    onRead={handleRead}
                  />

                  {unreadCount > 0 && (
                    <button
                      type="button"
                      className="mark-all-button"
                      onClick={handleReadAll}
                    >
                      Mark All as Read
                    </button>
                  )}
                </div>
              )}
            </div>

            <button
              type="button"
              className="logout-button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;