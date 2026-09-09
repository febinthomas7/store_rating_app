import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true, // Automatically sends cookies
});

// Intercept responses to handle expired sessions globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 405) {
      // Token expired or invalid on the backend
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);
