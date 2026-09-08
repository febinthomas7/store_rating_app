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

  if (!stats) return <p>Loading...</p>;

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <ul>
        <li>Total Users: {stats.totalUsers}</li>
        <li>Total Stores: {stats.totalStores}</li>
        <li>Total Ratings: {stats.totalRatings}</li>
      </ul>
      <nav>
        <Link to="/admin/users">Manage Users</Link> |{" "}
        <Link to="/admin/stores">Manage Stores</Link>
      </nav>
    </div>
  );
}
