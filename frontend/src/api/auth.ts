import { api } from "./axios";

export const login = async (credentials: any) => {
  const res = await api.post("/auth/login", credentials);
  return res.data;
};

export const signup = async (userData: any) => {
  const res = await api.post("/auth/signup", userData);
  return res.data;
};

export const logout = async () => {
  const res = await api.post("/auth/logout", {}, { withCredentials: true });
  return res.data;
};

export const updatePassword = async (userData: any) => {
  const res = await api.put("/auth/password", userData);
  return res.data;
};

export const authcheck = async () => {
  const res = await api.get("/auth/me", { withCredentials: true });
  return res.data;
};
