import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import toast from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = sessionStorage.getItem("auth-token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    // Let browser set Content-Type with boundary for FormData
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    const message =
      error.response?.data?.message || error.message || "Something went wrong";

    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("auth-token");
        sessionStorage.removeItem("auth-storage");
        if (!window.location.pathname.includes("/auth/")) {
          window.location.href = "/auth/login";
        }
      }
    }

    if (error.response?.status === 403) {
      toast.error("You do not have permission to perform this action");
    }

    if (error.response?.status && error.response.status >= 500) {
      toast.error("Server error. Please try again later.");
    }

    return Promise.reject(error);
  }
);

export default api;
