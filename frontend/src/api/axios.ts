import axios from "axios";

export const api = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}/api`,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 405) {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);
