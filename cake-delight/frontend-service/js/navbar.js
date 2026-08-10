const NOTIFICATION_SERVICE_URL = "http://localhost:3004";
const CUSTOMER_ID = "C001";

const updateNotificationBadge = async () => {
  try {
    const response = await fetch(
      `${NOTIFICATION_SERVICE_URL}/api/notifications/${CUSTOMER_ID}`,
    );

    const data = await response.json();

    if (!response.ok) {
      return;
    }

    const unreadCount = data.notifications.filter(
      (notification) => !notification.isRead,
    ).length;

    const notificationLink = document.getElementById("notification-link");

    if (!notificationLink) {
      return;
    }

    let badge = document.getElementById("notification-badge");

    if (unreadCount === 0) {
      if (badge) {
        badge.remove();
      }

      return;
    }

    if (!badge) {
      badge = document.createElement("span");

      badge.id = "notification-badge";
      badge.className = "notification-badge";

      notificationLink.appendChild(badge);
    }

    badge.textContent = unreadCount;
  } catch (error) {
    console.error("Error loading notification count:", error);
  }
};

updateNotificationBadge();
