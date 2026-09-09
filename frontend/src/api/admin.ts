import { api } from "./axios";

export const adminStores = async (userData: any) => {
  const res = await api.get("/admin/list-stores", { params: userData });
  return res.data;
};

export const listUsers = async (userData: any) => {
  const res = await api.get("/admin/list-users", { params: userData });
  return res.data;
};

export const addUser = async (userData: any) => {
  const res = await api.post("/admin/users", userData);
  return res.data;
};

export const addStore = async (userData: any) => {
  const res = await api.post("/admin/stores", userData);
  return res.data;
};
