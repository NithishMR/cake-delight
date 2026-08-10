const ORDER_SERVICE_URL = "http://localhost:3002";

const orderDetails = document.getElementById("order-details");

const urlParams = new URLSearchParams(window.location.search);

const orderId = urlParams.get("id");

const loadOrder = async () => {
  if (!orderId) {
    orderDetails.innerHTML = `
            <p class="error-message">
                Order ID was not provided.
            </p>
        `;

    return;
  }

  try {
    const response = await fetch(`${ORDER_SERVICE_URL}/api/order/${orderId}`);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch order");
    }

    displayOrder(data.order);
  } catch (error) {
    console.error("Error loading order:", error);

    orderDetails.innerHTML = `
            <p class="error-message">
                Unable to load order details.
            </p>
        `;
  }
};

const displayOrder = (order) => {
  orderDetails.innerHTML = `
        <div class="order-card">

            <h1>Order Details</h1>

            <p>
                Order ID: ${order._id}
            </p>

            <p class="order-status">
                Status: ${order.status}
            </p>

            <div id="order-items"></div>

            <div class="order-total">

                <span>Total</span>

                <span>
                    ₹${order.totalAmount}
                </span>

            </div>

            ${
              order.status === "PENDING"
                ? `
                        <div class="payment-section">

                            <h2>Mock Payment</h2>

                            <p>
                                This is a demo payment.
                                No real payment will be processed.
                            </p>

                            <button
                                class="pay-button"
                                id="pay-button"
                            >
                                Pay Now
                            </button>

                        </div>
                      `
                : ""
            }

            ${
              order.status === "COMPLETED"
                ? `
                        <div class="completed-message">
                            ✓ Payment successful. Your order
                            has been completed.
                        </div>
                      `
                : ""
            }

        </div>
    `;

  const orderItems = document.getElementById("order-items");

  order.items.forEach((item) => {
    const itemElement = document.createElement("div");

    itemElement.className = "order-item";

    itemElement.innerHTML = `
            <span>
                ${item.cakeName}
                × ${item.quantity}
            </span>

            <span>
                ₹${item.subtotal}
            </span>
        `;

    orderItems.appendChild(itemElement);
  });

  if (order.status === "PENDING") {
    const payButton = document.getElementById("pay-button");

    payButton.addEventListener("click", () => completePayment(order._id));
  }
};

const completePayment = async (orderId) => {
  const payButton = document.getElementById("pay-button");

  payButton.disabled = true;

  payButton.textContent = "Processing Payment...";

  try {
    const response = await fetch(
      `${ORDER_SERVICE_URL}/api/order/${orderId}/status`,
      {
        method: "PATCH",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          status: "COMPLETED",
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Payment failed");

      payButton.disabled = false;

      payButton.textContent = "Pay Now";

      return;
    }

    alert("Payment successful");

    /*
     * Reload the order.
     *
     * The Order Service has now:
     *
     * PENDING → COMPLETED
     *
     * and publishes order.completed
     * to RabbitMQ.
     */

    displayOrder(data.order);
  } catch (error) {
    console.error("Error processing payment:", error);

    alert("Unable to process payment");

    payButton.disabled = false;

    payButton.textContent = "Pay Now";
  }
};

loadOrder();
