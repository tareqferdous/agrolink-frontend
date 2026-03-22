import axios from "axios";
import { authClient } from "./auth-client";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// Request interceptor — token attach
api.interceptors.request.use(async (config) => {
  const { data } = await authClient.getSession();
  const token = data?.session?.token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Response interceptor — error handle
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    // 401 — session expired, redirect to login
    if (error.response?.status === 401) {
      await authClient.signOut();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }

    // Backend error message extract
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Something went wrong";

    return Promise.reject(new Error(message));
  },
);

export default api;
