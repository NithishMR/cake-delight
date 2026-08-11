const cakeDetails = document.getElementById("cake-details");

// Get cake ID from URL

const urlParams = new URLSearchParams(window.location.search);

const cakeId = urlParams.get("id");

// Load cake details

const loadCakeDetails = async () => {
  if (!cakeId) {
    cakeDetails.innerHTML = `
            <p class="error-message">
                Cake ID was not provided.
            </p>
        `;

    return;
  }

  try {
    const response = await fetch(`${API.cakes}/${cakeId}`);

    if (!response.ok) {
      throw new Error("Failed to fetch cake details");
    }

    const cake = await response.json();

    displayCake(cake);
  } catch (error) {
    console.error("Error loading cake details:", error);

    cakeDetails.innerHTML = `
            <p class="error-message">
                Unable to load cake details.
            </p>
        `;
  }
};

// Display cake

const displayCake = (cake) => {
  cakeDetails.innerHTML = `
        <div class="cake-details-card">

            <div class="image-placeholder">
                Cake Image
            </div>

            <h1>
                ${cake.name}
            </h1>

            <p class="cake-description">
                ${cake.description}
            </p>

            <p class="cake-category">
                Category: ${cake.category}
            </p>

            <p class="cake-price">
                ₹${cake.price}
            </p>

            <p class="cake-availability">
                ${cake.available ? "Available" : "Currently unavailable"}
            </p>

            ${
              cake.available
                ? `
                        <button
                            class="add-cart-button"
                            id="add-cart-button"
                        >
                            Add to Cart
                        </button>
                      `
                : `
                        <button
                            class="add-cart-button"
                            disabled
                        >
                            Currently Unavailable
                        </button>
                      `
            }

        </div>
    `;

  // Add to Cart
  // Functionality will be implemented later.

  if (cake.available) {
    const addCartButton = document.getElementById("add-cart-button");

    addCartButton.addEventListener("click", () => {
      addToCart(cake._id, 1);
    });
  }
};

const addToCart = async (cakeId, quantity) => {
  try {
    const response = await fetch(`${API.basket}/items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cakeId: cakeId,
        quantity: quantity,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Failed to add cake to basket");
      return;
    }

    alert("Cake added to basket");

    console.log("Updated basket:", data.basket);
  } catch (error) {
    console.error("Error adding cake to basket:", error);

    alert("Unable to add cake to basket");
  }
};
loadCakeDetails();
