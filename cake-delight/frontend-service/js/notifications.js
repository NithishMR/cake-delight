const NOTIFICATION_SERVICE_URL = "http://localhost:3004";

const CUSTOMER_ID = "C001";

const notificationsList = document.getElementById("notifications-list");

// Load notifications

const loadNotifications = async () => {
  try {
    const response = await fetch(`${API.notifications}/${CUSTOMER_ID}`);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch notifications");
    }

    displayNotifications(data.notifications);
  } catch (error) {
    console.error("Error loading notifications:", error);

    notificationsList.innerHTML = `
            <p class="error-message">
                Unable to load notifications.
            </p>
        `;
  }
};

// Display notifications

const displayNotifications = (notifications) => {
  if (!notifications || notifications.length === 0) {
    notificationsList.innerHTML = `
            <div class="empty-notifications">

                <h2>No notifications</h2>

                <p>
                    You don't have any notifications yet.
                </p>

            </div>
        `;

    return;
  }

  notificationsList.innerHTML = "";

  notifications.forEach((notification) => {
    const notificationElement = document.createElement("div");

    notificationElement.className = "notification";

    if (!notification.isRead) {
      notificationElement.classList.add("unread");
    }

    const notificationDate = new Date(notification.createdAt).toLocaleString();

    notificationElement.innerHTML = `

                <div class="notification-content">

                    <p class="notification-message">
                        ${notification.message}
                    </p>

                    <p class="notification-date">
                        ${notificationDate}
                    </p>

                </div>


                <button
                    class="delete-notification-button"
                >
                    Delete
                </button>

            `;

    notificationsList.appendChild(notificationElement);

    const deleteButton = notificationElement.querySelector(
      ".delete-notification-button",
    );

    /*
     * Delete button
     *
     * stopPropagation() prevents
     * the notification click handler
     * from running.
     */

    deleteButton.addEventListener("click", (event) => {
      event.stopPropagation();

      deleteNotification(notification._id);
    });

    /*
     * Notification click
     */

    notificationElement.addEventListener("click", () => {
      openNotification(notification);
    });
  });
};

// Open notification

const openNotification = async (notification) => {
  /*
   * If notification is unread,
   * mark it as read first.
   */

  if (!notification.isRead) {
    const success = await markAsRead(notification._id);

    if (!success) {
      return;
    }
  }

  /*
   * The notification contains
   * the orderId.
   *
   * Take the user to the
   * corresponding order.
   */

  window.location.href = `order-details.html?id=${notification.orderId}`;
};

// Mark notification as read

const markAsRead = async (notificationId) => {
  try {
    const response = await fetch(
      `${API.notifications}/${notificationId}/read`,
      {
        method: "PATCH",
      },
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Failed to mark notification as read");

      return false;
    }

    return true;
  } catch (error) {
    console.error("Error marking notification as read:", error);

    alert("Unable to mark notification as read");

    return false;
  }
};

// Delete notification

const deleteNotification = async (notificationId) => {
  try {
    const response = await fetch(`${API.notifications}/${notificationId}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Failed to delete notification");

      return;
    }

    loadNotifications();
  } catch (error) {
    console.error("Error deleting notification:", error);

    alert("Unable to delete notification");
  }
};

// Initial load

loadNotifications();
