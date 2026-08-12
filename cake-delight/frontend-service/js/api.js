const API_BASE_URL = `http://${window.location.hostname}:30081`;

const API = {
  cakes: `${API_BASE_URL}/api/cakes`,
  basket: `${API_BASE_URL}/api/basket`,
  orders: `${API_BASE_URL}/api/order`,
  ratings: `${API_BASE_URL}/api/ratings`,
  notifications: `${API_BASE_URL}/api/notifications`,
};
