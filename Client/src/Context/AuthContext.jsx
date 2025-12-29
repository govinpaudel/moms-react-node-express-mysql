import { createContext, useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const redirectingRef = useRef(false);

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("loggedUser") || "null");
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL;

  /* -------------------- Axios instance -------------------- */
  const axiosInstance = axios.create({
    baseURL: API_URL,
    timeout: 20000,
  });

  /* -------------------- helpers -------------------- */
  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("loggedUser");
    setUser(null);

    if (!redirectingRef.current) {
      redirectingRef.current = true;
      navigate("/login", { replace: true });
    }
  };

  const login = (loginResponse) => {
    const { data, access_token, refresh_token } = loginResponse;

    localStorage.setItem("access_token", access_token);
    localStorage.setItem("refresh_token", refresh_token);
    localStorage.setItem("loggedUser", JSON.stringify(data));

    setUser(data);
    navigate("/apphome", { replace: true });
  };

  /* -------------------- refresh token -------------------- */
  const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem("refresh_token");
      if (!refreshToken) throw new Error("No refresh token");

      const res = await axios.post(`${API_URL}refreshtoken`, {
        refresh_token: refreshToken,
      });

      if (typeof res.data === "string") throw new Error("Invalid response");

      localStorage.setItem("access_token", res.data.access_token);
      return res.data.access_token;
    } catch (err) {
      logout();
      return null;
    }
  };

  /* -------------------- axios interceptors -------------------- */
  useEffect(() => {
    const requestInterceptor = axiosInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("access_token");
        if (token) {
          config.headers["X-Authorization"] = `Bearer ${token}`;
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          const newToken = await refreshAccessToken();
          if (newToken) {
            originalRequest.headers["X-Authorization"] = `Bearer ${newToken}`;
            return axiosInstance(originalRequest);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  /* -------------------- initial auth check -------------------- */
  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
        axiosInstance, // now available immediately
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

/* -------------------- hook -------------------- */
export const useAuth = () => {
  return useContext(AuthContext);
};
