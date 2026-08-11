const CUSTOMER_ID = "C001";

const pendingRatingsContainer = document.getElementById("pending-ratings");

const allRatingsContainer = document.getElementById("all-ratings");

// Get cake details from Catalog Service

const getCakeDetails = async (cakeId) => {
  try {
    const response = await fetch(`${API.cakes}/${cakeId}`);

    if (!response.ok) {
      throw new Error("Failed to fetch cake");
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching cake ${cakeId}:`, error);

    return null;
  }
};

// Load pending ratings

const loadPendingRatings = async () => {
  try {
    const response = await fetch(`${API.ratings}/pending/${CUSTOMER_ID}`);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch pending ratings");
    }

    displayPendingRatings(data.ratings);
  } catch (error) {
    console.error("Error loading pending ratings:", error);

    pendingRatingsContainer.innerHTML = `
      <p class="error-message">
        Unable to load pending ratings.
      </p>
    `;
  }
};

// Display pending ratings

const displayPendingRatings = async (ratings) => {
  if (!ratings || ratings.length === 0) {
    pendingRatingsContainer.innerHTML = `
      <p class="empty-message">
        You have no pending ratings.
      </p>
    `;

    return;
  }

  pendingRatingsContainer.innerHTML = "";

  for (const rating of ratings) {
    const cake = await getCakeDetails(rating.cakeId);

    const cakeName = cake ? cake.name : "Cake";

    const ratingCard = document.createElement("div");

    ratingCard.className = "rating-card";

    ratingCard.innerHTML = `
      <h3>
        ${cakeName}
      </h3>

      <p>
        Please rate this cake.
      </p>

      <div
        class="star-container"
        data-cake-id="${rating.cakeId}"
      >

        <button
          class="star"
          data-rating="1"
        >
          ★
        </button>

        <button
          class="star"
          data-rating="2"
        >
          ★
        </button>

        <button
          class="star"
          data-rating="3"
        >
          ★
        </button>

        <button
          class="star"
          data-rating="4"
        >
          ★
        </button>

        <button
          class="star"
          data-rating="5"
        >
          ★
        </button>

      </div>

      <button
        class="submit-rating-button"
        disabled
      >
        Submit Rating
      </button>
    `;

    pendingRatingsContainer.appendChild(ratingCard);

    setupRatingCard(ratingCard, rating.cakeId);
  }
};

// Set up one rating card

const setupRatingCard = (ratingCard, cakeId) => {
  const stars = ratingCard.querySelectorAll(".star");

  const submitButton = ratingCard.querySelector(".submit-rating-button");

  let selectedRating = 0;

  stars.forEach((star) => {
    star.addEventListener("click", () => {
      selectedRating = Number(star.dataset.rating);

      stars.forEach((currentStar) => {
        const currentRating = Number(currentStar.dataset.rating);

        if (currentRating <= selectedRating) {
          currentStar.classList.add("selected");
        } else {
          currentStar.classList.remove("selected");
        }
      });

      submitButton.disabled = false;
    });
  });

  submitButton.addEventListener("click", () => {
    submitRating(cakeId, selectedRating, submitButton);
  });
};

// Submit rating

const submitRating = async (cakeId, rating, submitButton) => {
  submitButton.disabled = true;

  submitButton.textContent = "Submitting...";

  try {
    const response = await fetch(API.ratings, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        cakeId: cakeId,
        customerId: CUSTOMER_ID,
        rating: rating,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Failed to submit rating");

      submitButton.disabled = false;

      submitButton.textContent = "Submit Rating";

      return;
    }

    alert("Rating submitted successfully");

    // Reload both sections

    loadPendingRatings();
    loadAllRatings();
  } catch (error) {
    console.error("Error submitting rating:", error);

    alert("Unable to submit rating");

    submitButton.disabled = false;

    submitButton.textContent = "Submit Rating";
  }
};

// Load all cake ratings

const loadAllRatings = async () => {
  try {
    const response = await fetch(API.ratings);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch ratings");
    }

    displayAllRatings(data.ratings);
  } catch (error) {
    console.error("Error loading cake ratings:", error);

    allRatingsContainer.innerHTML = `
      <p class="error-message">
        Unable to load cake ratings.
      </p>
    `;
  }
};

// Display all cake ratings

const displayAllRatings = async (ratings) => {
  if (!ratings || ratings.length === 0) {
    allRatingsContainer.innerHTML = `
      <p class="empty-message">
        No cake ratings available yet.
      </p>
    `;

    return;
  }

  allRatingsContainer.innerHTML = "";

  for (const rating of ratings) {
    const cake = await getCakeDetails(rating.cakeId);

    const cakeName = cake ? cake.name : "Cake";

    const roundedRating = Number(rating.averageRating).toFixed(1);

    const ratingElement = document.createElement("div");

    ratingElement.className = "rating-summary";

    ratingElement.innerHTML = `
      <div>

        <strong>
          ${cakeName}
        </strong>

        <p class="total-ratings">
          ${rating.totalRatings}
          rating(s)
        </p>

      </div>

      <div class="average-rating">
        ★ ${roundedRating}
      </div>
    `;

    allRatingsContainer.appendChild(ratingElement);
  }
};

// Initial load

loadPendingRatings();
loadAllRatings();
