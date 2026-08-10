const ORDER_SERVICE_URL = "http://localhost:3002";

const cartItems = document.getElementById("cart-items");
const cartSummary = document.getElementById("cart-summary");

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

    displayBasket(data.basket);
  } catch (error) {
    console.error("Error loading basket:", error);

    cartItems.innerHTML = `
      <p class="error-message">
        Unable to load basket.
      </p>
    `;
  }
};

const displayBasket = (basket) => {
  if (!basket || basket.items.length === 0) {
    displayEmptyBasket();
    return;
  }

  cartItems.innerHTML = "";

  basket.items.forEach((item) => {
    const cartItem = document.createElement("div");

    cartItem.className = "cart-item";

    cartItem.innerHTML = `
      <div class="cart-item-info">

        <h2>${item.cakeName}</h2>

        <p>
          Unit Price: ₹${item.unitPrice}
        </p>

        <p>
          Subtotal: ₹${item.subtotal}
        </p>

      </div>

      <div class="quantity-controls">

        <button
          class="quantity-button decrease-button"
        >
          -
        </button>

        <span class="quantity">
          ${item.quantity}
        </span>

        <button
          class="quantity-button increase-button"
        >
          +
        </button>

      </div>

      <button class="remove-button">
        Remove
      </button>
    `;

    cartItems.appendChild(cartItem);

    const decreaseButton = cartItem.querySelector(".decrease-button");

    const increaseButton = cartItem.querySelector(".increase-button");

    const removeButton = cartItem.querySelector(".remove-button");

    decreaseButton.addEventListener("click", () => {
      if (item.quantity > 1) {
        updateBasketItem(item.cakeId, item.quantity - 1);
      }
    });

    increaseButton.addEventListener("click", () => {
      updateBasketItem(item.cakeId, item.quantity + 1);
    });

    removeButton.addEventListener("click", () => {
      removeBasketItem(item.cakeId);
    });
  });

  cartSummary.innerHTML = `
    <div class="cart-summary">

      <p class="cart-total">
        Total: ₹${basket.totalAmount}
      </p>

      <button
        class="checkout-button"
        id="checkout-button"
      >
        Proceed to Checkout
      </button>

    </div>
  `;

  const checkoutButton = document.getElementById("checkout-button");

  checkoutButton.addEventListener("click", () => {
    window.location.href = "checkout.html";
  });
};

const displayEmptyBasket = () => {
  cartItems.innerHTML = `
    <div class="empty-cart">

      <h2>Your basket is empty</h2>

      <p>
        Add some delicious cakes to your basket.
      </p>

    </div>
  `;

  cartSummary.innerHTML = "";
};

const updateBasketItem = async (cakeId, quantity) => {
  try {
    const response = await fetch(
      `${ORDER_SERVICE_URL}/api/basket/items/${cakeId}`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          quantity: quantity,
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Failed to update basket");

      return;
    }

    displayBasket(data.basket);
  } catch (error) {
    console.error("Error updating basket:", error);

    alert("Unable to update basket");
  }
};

const removeBasketItem = async (cakeId) => {
  try {
    const response = await fetch(
      `${ORDER_SERVICE_URL}/api/basket/items/${cakeId}`,
      {
        method: "DELETE",
      },
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Failed to remove item");

      return;
    }

    displayBasket(data.basket);
  } catch (error) {
    console.error("Error removing basket item:", error);

    alert("Unable to remove item");
  }
};

loadBasket();
