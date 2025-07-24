// axiosInstance.js
import axios from 'axios';

// Request interceptor to attach token
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // This pulls from VITE_API_URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add Authorization Bearer Token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('access_token'); // Adjust if you store it elsewhere
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auto logout on 401/403 response
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401 || status === 403) {
      // Clear token and redirect
      sessionStorage.removeItem('access_token');
      window.location.href = '/login'; // Or use react-router `navigate()` if available
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
