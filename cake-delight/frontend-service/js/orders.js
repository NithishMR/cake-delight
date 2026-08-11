const ordersList = document.getElementById("orders-list");

const loadOrders = async () => {
  try {
    const response = await fetch(API.orders);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch orders");
    }

    displayOrders(data.orders);
  } catch (error) {
    console.error("Error loading orders:", error);

    ordersList.innerHTML = `
            <p class="error-message">
                Unable to load orders.
            </p>
        `;
  }
};

const displayOrders = (orders) => {
  if (!orders || orders.length === 0) {
    ordersList.innerHTML = `
            <div class="empty-orders">

                <h2>No orders yet</h2>

                <p>
                    Your orders will appear here.
                </p>

            </div>
        `;

    return;
  }

  ordersList.innerHTML = "";

  orders.forEach((order) => {
    const orderCard = document.createElement("div");

    orderCard.className = "order-card";

    const orderDate = new Date(order.createdAt).toLocaleString();

    orderCard.innerHTML = `
            <h2>
                Order #${order._id}
            </h2>

            <p class="order-info">
                Placed on: ${orderDate}
            </p>

            <div class="order-items">
                ${order.items
                  .map(
                    (item) => `
                    <div class="order-item">

                        <span>
                            ${item.cakeName}
                            × ${item.quantity}
                        </span>

                        <span>
                            ₹${item.subtotal}
                        </span>

                    </div>
                `,
                  )
                  .join("")}
            </div>

            <p class="order-total">
                Total: ₹${order.totalAmount}
            </p>

            <p class="order-status">
                Status: ${order.status}
            </p>

            <button
                class="view-order-button"
                data-order-id="${order._id}"
            >
                View Order
            </button>
        `;

    ordersList.appendChild(orderCard);

    const viewOrderButton = orderCard.querySelector(".view-order-button");

    viewOrderButton.addEventListener("click", () => {
      window.location.href = `order-details.html?id=${order._id}`;
    });
  });
};

loadOrders();
