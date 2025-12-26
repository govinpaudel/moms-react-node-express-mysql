// axiosInstance.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// -----------------------------
// Helper: logout user
// -----------------------------
const logout = () => {
  sessionStorage.removeItem("access_token");
  sessionStorage.removeItem("refresh_token");
  window.location.href = "/login";
};

// -----------------------------
// Create axios instance
// -----------------------------
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// -----------------------------
// Request interceptor: attach access token
// -----------------------------
axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("access_token");
    if (token) {
       // Use X-Authorization instead of Authorization
      config.headers["X-Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// -----------------------------
// Response interceptor: handle 401 and refresh token
// -----------------------------
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only retry once
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = sessionStorage.getItem("refresh_token");

      if (refreshToken) {
        try {
          // Call your /refreshtoken API
          const res = await axios.post(`${API_URL}/refreshtoken`, {
            refresh_token: refreshToken,
          });

          const newAccessToken = res.data.access_token;

          if (!newAccessToken) throw new Error("No new access token returned");

          // Save new access token
          sessionStorage.setItem("access_token", newAccessToken);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          // Refresh token invalid or expired → logout
          logout();
        }
      } else {
        logout();
      }
    }

    // For other errors, reject
    return Promise.reject(error);
  }
);

export default axiosInstance;
