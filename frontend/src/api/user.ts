import { api } from "./axios";

export const userStoreList = async (userData: any) => {
  const res = await api.post("/users/store", userData);
  return res.data;
};

export const userStoreDashboard = async () => {
  const res = await api.get("/store/dashboard");
  return res.data;
};

export const getStoreList = async (userData: any) => {
  const res = await api.post("/users/stores", userData);
  return res.data;
};

export const submitRatingToStore = async (storeId: number, rating: any) => {
  const res = await api.post(`/users/stores/${storeId}/ratings`, { rating });
  return res.data;
};

export const userDetails = async (id) => {
  const res = await api.get(`/admin/user/${id}`);
  return res.data;
};
