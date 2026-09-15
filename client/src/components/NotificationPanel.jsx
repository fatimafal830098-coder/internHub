function NotificationPanel({ notifications = [], onRead }) {
  return (
    <div className="notification-panel">
      <h3>Notifications</h3>

      {notifications.length === 0 ? (
        <p>No notifications yet.</p>
      ) : (
        notifications.map((notification) => (
          <div
            key={notification._id}
            className="notification-item"
          >
            <p>{notification.message}</p>

            <small>
              {new Date(notification.createdAt).toLocaleString()}
            </small>

            {!notification.isRead && (
              <button
                type="button"
                onClick={() => onRead(notification._id)}
              >
                Mark as Read
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default NotificationPanel;