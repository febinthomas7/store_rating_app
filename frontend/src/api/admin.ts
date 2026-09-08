import { api } from "./axios";

export const adminStores = async (userData: any) => {
  const res = await api.post("/admin/stores", userData);
  return res.data;
};

export const adminUsers = async (userData: any) => {
  const res = await api.post("/admin/users", userData);
  return res.data;
};
