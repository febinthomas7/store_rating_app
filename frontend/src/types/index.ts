export type Role = "ADMIN" | "USER" | "STORE_OWNER";

export interface User {
  id: number;
  name: string;
  email: string;
  address?: string;
  role: Role;
  rating?: number | null;
}

export interface Store {
  id: number;
  name: string;
  email?: string;
  address: string;
  rating?: number;
  overallRating?: number;
  userRating?: number | null;
}

export interface RatingEntry {
  userId: number;
  name: string;
  email: string;
  rating: number;
  created_at: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalStores: number;
  totalRatings: number;
}

export interface StoreOwnerDashboardData {
  store: string;
  averageRating: number;
  ratings: RatingEntry[];
}
