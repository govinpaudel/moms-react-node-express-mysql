import { createContext, useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const redirectingRef = useRef(false);
  const isRefreshingRef = useRef(false);
  const refreshQueueRef = useRef([]);

  const [loggedUser, setLoggedUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("loggedUser") || "null");
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL;

  /* ================== AXIOS INSTANCE ================== */
  const axiosInstanceRef = useRef(null);

  if (!axiosInstanceRef.current) {
    axiosInstanceRef.current = axios.create({
      baseURL: API_URL,
      timeout: 20000,
    });
  }

  const axiosInstance = axiosInstanceRef.current;

  /* ================== LOGOUT ================== */
  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("loggedUser");
    setLoggedUser(null);

    if (!redirectingRef.current) {
      redirectingRef.current = true;
      navigate("/login", { replace: true });
    }
  };

  /* ================== LOGIN ================== */
  const login = (loginResponse) => {
    const { data, access_token, refresh_token } = loginResponse;

    localStorage.setItem("access_token", access_token);
    localStorage.setItem("refresh_token", refresh_token);
    localStorage.setItem("loggedUser", JSON.stringify(data));

    setLoggedUser(data);
    navigate("/apphome", { replace: true });
  };

  /* ================== REFRESH TOKEN ================== */
  const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem("refresh_token");
      if (!refreshToken) throw new Error("No refresh token");

      const res = await axios.post(`${API_URL}refreshtoken`, {
        refresh_token: refreshToken,
      });

      if (!res.data?.access_token) throw new Error("Invalid refresh response");

      localStorage.setItem("access_token", res.data.access_token);
      return res.data.access_token;
    } catch {
      logout(); // 🔥 AUTO LOGOUT if refresh fails
      return null;
    }
  };

  /* ================== AXIOS INTERCEPTORS ================== */
  useEffect(() => {
    /* ---------- REQUEST ---------- */
    const requestInterceptor = axiosInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("access_token");

        if (token) {
          config.headers["X-Authorization"] = `Bearer ${token}`;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    /* ---------- RESPONSE ---------- */
    const responseInterceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401) {
          // Already retried → logout
          if (originalRequest._retry) {
            logout();
            return Promise.reject(error);
          }

          originalRequest._retry = true;

          // 🔒 Refresh queue (prevents multiple refresh calls)
          if (isRefreshingRef.current) {
            return new Promise((resolve, reject) => {
              refreshQueueRef.current.push({ resolve, reject });
            })
              .then((token) => {
                originalRequest.headers["X-Authorization"] = `Bearer ${token}`;
                return axiosInstance(originalRequest);
              })
              .catch(Promise.reject);
          }

          isRefreshingRef.current = true;

          const newToken = await refreshAccessToken();
          isRefreshingRef.current = false;

          if (!newToken) {
            refreshQueueRef.current = [];
            return Promise.reject(error);
          }

          // Resolve queued requests
          refreshQueueRef.current.forEach((p) => p.resolve(newToken));
          refreshQueueRef.current = [];

          originalRequest.headers["X-Authorization"] = `Bearer ${newToken}`;
          return axiosInstance(originalRequest);
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  /* ================== INITIAL LOAD ================== */
  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        loggedUser,
        loading,
        login,
        logout,
        isAuthenticated: !!loggedUser,
        axiosInstance,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

/* ================== HOOK ================== */
export const useAuth = () => useContext(AuthContext);
