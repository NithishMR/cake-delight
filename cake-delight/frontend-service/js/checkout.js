const ORDER_SERVICE_URL = "http://localhost:3002";

const checkoutSummary = document.getElementById("checkout-summary");

const loadBasket = async () => {
  try {
    const response = await fetch(`${ORDER_SERVICE_URL}/api/basket`);

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 404) {
        displayEmptyBasket();
        return;
      }

      throw new Error(data.message || "Failed to fetch basket");
    }

    displayCheckoutSummary(data.basket);
  } catch (error) {
    console.error("Error loading checkout:", error);

    checkoutSummary.innerHTML = `
            <p class="message error-message">
                Unable to load checkout.
            </p>
        `;
  }
};

const displayEmptyBasket = () => {
  checkoutSummary.innerHTML = `
        <div class="message">

            <h2>Your basket is empty</h2>

            <p>
                Add some cakes before proceeding to checkout.
            </p>

        </div>
    `;
};

const displayCheckoutSummary = (basket) => {
  if (!basket || basket.items.length === 0) {
    displayEmptyBasket();
    return;
  }

  checkoutSummary.innerHTML = `
        <div class="checkout-summary">

            <h2>Order Summary</h2>

            <div id="checkout-items"></div>

            <div class="checkout-total">

                <span>Total</span>

                <span>
                    ₹${basket.totalAmount}
                </span>

            </div>

            <button
                class="place-order-button"
                id="place-order-button"
            >
                Place Order
            </button>

        </div>
    `;

  const checkoutItems = document.getElementById("checkout-items");

  basket.items.forEach((item) => {
    const itemElement = document.createElement("div");

    itemElement.className = "checkout-item";

    itemElement.innerHTML = `
            <span>
                ${item.cakeName}
                × ${item.quantity}
            </span>

            <span>
                ₹${item.subtotal}
            </span>
        `;

    checkoutItems.appendChild(itemElement);
  });

  const placeOrderButton = document.getElementById("place-order-button");

  placeOrderButton.addEventListener("click", checkout);
};

const checkout = async () => {
  const placeOrderButton = document.getElementById("place-order-button");

  placeOrderButton.disabled = true;

  placeOrderButton.textContent = "Placing Order...";

  try {
    const response = await fetch(`${ORDER_SERVICE_URL}/api/order/checkout`, {
      method: "POST",
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Failed to place order");

      placeOrderButton.disabled = false;

      placeOrderButton.textContent = "Place Order";

      return;
    }

    alert("Order placed successfully");

    /*
     * The backend returns:
     *
     * {
     *     message: "...",
     *     order: {...}
     * }
     *
     * We can use the returned order ID
     * when we build the order details page.
     */

    console.log("Created order:", data.order);

    window.location.href = `order-details.html?id=${data.order._id}`;
  } catch (error) {
    console.error("Error during checkout:", error);

    alert("Unable to place order");

    placeOrderButton.disabled = false;

    placeOrderButton.textContent = "Place Order";
  }
};

loadBasket();
