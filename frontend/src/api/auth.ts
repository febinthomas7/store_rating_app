import { api } from "./axios";

export const login = async (credentials: any) => {
  const res = await api.post("/auth/login", credentials);
  return res.data;
};

export const signup = async (userData: any) => {
  const res = await api.post("/auth/signup", userData);
  return res.data;
};

export const updatePassword = async (userData: any) => {
  const res = await api.post("/auth/UpdatePassword", userData);
  return res.data;
};
