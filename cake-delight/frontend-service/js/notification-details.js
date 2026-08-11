const CUSTOMER_ID = "C001";

const notificationDetails = document.getElementById("notification-details");

const urlParams = new URLSearchParams(window.location.search);

const notificationId = urlParams.get("id");

// Get customer's notifications
const getNotifications = async () => {
  const response = await fetch(`${API.notifications}/${CUSTOMER_ID}`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch notifications");
  }

  return data.notifications;
};

// Get order details
const getOrder = async (orderId) => {
  const response = await fetch(`${API.orders}/${orderId}`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch order");
  }

  return data.order;
};

// Get cake details
const getCake = async (cakeId) => {
  try {
    const response = await fetch(`${API.cakes}/${cakeId}`);

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching cake ${cakeId}:`, error);

    return null;
  }
};

// Mark notification as read
const markAsRead = async (id) => {
  try {
    const response = await fetch(`${API.notifications}/${id}/read`, {
      method: "PATCH",
    });

    if (!response.ok) {
      console.error("Failed to mark notification as read");
    }
  } catch (error) {
    console.error("Error marking notification as read:", error);
  }
};

// Load notification details
const loadNotificationDetails = async () => {
  if (!notificationId) {
    notificationDetails.innerHTML = `
      <p class="error-message">
        Notification ID was not provided.
      </p>
    `;

    return;
  }

  try {
    // Get all customer notifications
    const notifications = await getNotifications();

    // Find requested notification
    const notification = notifications.find(
      (item) => item._id === notificationId,
    );

    if (!notification) {
      notificationDetails.innerHTML = `
        <p class="error-message">
          Notification not found.
        </p>
      `;

      return;
    }

    // Mark notification as read
    if (!notification.isRead) {
      await markAsRead(notification._id);
      notification.isRead = true;
    }

    // Get related order
    let order = null;

    if (notification.orderId) {
      order = await getOrder(notification.orderId);
    }

    displayNotification(notification, order);
  } catch (error) {
    console.error("Error loading notification details:", error);

    notificationDetails.innerHTML = `
      <p class="error-message">
        Unable to load notification details.
      </p>
    `;
  }
};

// Display notification
const displayNotification = async (notification, order) => {
  const notificationDate = new Date(notification.createdAt).toLocaleString();

  let orderItemsHTML = "";

  if (order && order.items) {
    for (const item of order.items) {
      const cake = await getCake(item.cakeId);

      const cakeName = cake ? cake.name : item.cakeName || "Cake";

      orderItemsHTML += `
        <div class="order-item">

          <div class="order-item-info">

            <strong>
              ${cakeName}
            </strong>

            <span>
              × ${item.quantity}
            </span>

          </div>

          <span>
            ₹${item.subtotal}
          </span>

        </div>
      `;
    }
  }

  notificationDetails.innerHTML = `
    <div class="notification-detail-card">

      <div class="notification-header">

        <h1>Notification</h1>

        <p class="notification-date">
          ${notificationDate}
        </p>

      </div>

      <div class="notification-message">

        <h2>
          ${notification.message}
        </h2>

      </div>

      ${
        order
          ? `
            <div class="order-summary">

              <h2>Order Summary</h2>

              <p>
                Order ID:
                <strong>${order._id}</strong>
              </p>

              <div class="order-items">

                ${orderItemsHTML}

              </div>

              <div class="order-total">

                <span>
                  Total
                </span>

                <strong>
                  ₹${order.totalAmount}
                </strong>

              </div>

              <p class="order-status">
                Status:
                <strong>
                  ${order.status}
                </strong>
              </p>

            </div>
          `
          : ""
      }

      ${
        order
          ? `
            <button
              class="view-order-button"
              id="view-order-button"
            >
              View Full Order
            </button>
          `
          : ""
      }

      <button
        class="back-button"
        id="back-button"
      >
        Back to Notifications
      </button>

    </div>
  `;

  const backButton = document.getElementById("back-button");

  backButton.addEventListener("click", () => {
    window.location.href = "notifications.html";
  });

  if (order) {
    const viewOrderButton = document.getElementById("view-order-button");

    viewOrderButton.addEventListener("click", () => {
      window.location.href = `order-details.html?id=${order._id}`;
    });
  }
};

loadNotificationDetails();
