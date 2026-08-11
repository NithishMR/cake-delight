const productList = document.getElementById("product-list");

const nameFilter = document.getElementById("name-filter");
const categoryFilter = document.getElementById("category-filter");
const minPriceFilter = document.getElementById("min-price");
const maxPriceFilter = document.getElementById("max-price");

const filterButton = document.getElementById("filter-button");
const clearFilterButton = document.getElementById("clear-filter-button");

// Get all cakes
const loadCakes = async () => {
  try {
    const response = await fetch(API.cakes);

    if (!response.ok) {
      throw new Error("Failed to fetch cakes");
    }

    const data = await response.json();

    displayCakes(data.cakes);
  } catch (error) {
    console.error("Error loading cakes:", error);

    productList.innerHTML = `
            <p class="error-message">
                Unable to load cakes. Please try again later.
            </p>
        `;
  }
};

// Filter cakes
const filterCakes = async () => {
  const name = nameFilter.value.trim();
  const category = categoryFilter.value;
  const minPrice = minPriceFilter.value;
  const maxPrice = maxPriceFilter.value;

  const params = new URLSearchParams();

  if (name) {
    params.append("name", name);
  }

  if (category) {
    params.append("category", category);
  }

  if (minPrice) {
    params.append("minPrice", minPrice);
  }

  if (maxPrice) {
    params.append("maxPrice", maxPrice);
  }

  try {
    const response = await fetch(`${API.cakes}/search?${params.toString()}`);

    if (!response.ok) {
      throw new Error("Failed to filter cakes");
    }

    const data = await response.json();

    displayCakes(data.cakes);
  } catch (error) {
    console.error("Error filtering cakes:", error);

    productList.innerHTML = `
            <p class="error-message">
                Unable to filter cakes.
            </p>
        `;
  }
};

// Display cakes
const displayCakes = (cakes) => {
  productList.innerHTML = "";

  if (cakes.length === 0) {
    productList.innerHTML = `
            <p class="error-message">
                No cakes found.
            </p>
        `;
    return;
  }

  cakes.forEach((cake) => {
    const card = document.createElement("div");

    card.className = "product-card";

    card.innerHTML = `
            <div class="image-placeholder">
                Cake Image
            </div>

            <h2>${cake.name}</h2>

            <p>${cake.description}</p>

            <p>Category: ${cake.category}</p>

            <p class="product-price">
                ₹${cake.price}
            </p>

            <button
                class="view-details-button"
                data-cake-id="${cake._id}"
            >
                View Details
            </button>

            ${
              cake.available
                ? `
                        <button
                            class="add-cart-button"
                            data-cake-id="${cake._id}"
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
        `;

    productList.appendChild(card);

    // View Details
    const viewDetailsButton = card.querySelector(".view-details-button");

    viewDetailsButton.addEventListener("click", () => {
      window.location.href = `cake-details.html?id=${cake._id}`;
    });

    // Add to Cart
    // Functionality will be implemented later.
    const addCartButton = card.querySelector(".add-cart-button");

    if (cake.available) {
      addCartButton.addEventListener("click", () => {
        addToCart(cake._id, 1);
      });
    }
  });
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
// Clear filters
const clearFilters = () => {
  nameFilter.value = "";
  categoryFilter.value = "";
  minPriceFilter.value = "";
  maxPriceFilter.value = "";

  loadCakes();
};

// Event listeners
filterButton.addEventListener("click", filterCakes);

clearFilterButton.addEventListener("click", clearFilters);

// Initial load
loadCakes();
