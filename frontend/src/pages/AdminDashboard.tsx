import { useEffect, useState } from "react";
import { api } from "../api/axios";
import { Link } from "react-router-dom";
import type { DashboardStats } from "../types";

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    api
      .get<DashboardStats>("/admin/dashboard")
      .then(({ data }) => setStats(data));
  }, []);

  return (
    <div className=" h-dvh w-full flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      <ul className="space-y-2">
        <li className="text-lg">Total Users: {stats?.totalUsers}</li>
        <li className="text-lg">Total Stores: {stats?.totalStores}</li>
        <li className="text-lg">Total Ratings: {stats?.totalRatings}</li>
      </ul>
      <nav className="mt-4">
        <Link to="/admin/users" className="text-blue-500 hover:underline">
          Manage Users
        </Link>{" "}
        |{" "}
        <Link to="/admin/stores" className="text-blue-500 hover:underline">
          Manage Stores
        </Link>
      </nav>
    </div>
  );
}
