
const API_BASE_URL = "http://localhost:5000/api/auth";

/**
 * Send requests to the authentication backend.
 * Authentication cookies are handled by the browser.
 */
async function apiRequest(endpoint, options = {}) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
  } catch {
    throw new Error(
      "Unable to connect to the server. Please check that the backend is running."
    );
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.message || "Something went wrong. Please try again."
    );
  }

  return data;
}

export const authService = {
  register: (userData) =>
    apiRequest("/register", {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  login: (credentials) =>
    apiRequest("/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  getProfile: () =>
    apiRequest("/me", {
      method: "GET",
    }),

  logout: () =>
    apiRequest("/logout", {
      method: "POST",
    }),
};
