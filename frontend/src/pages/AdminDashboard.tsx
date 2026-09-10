import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { DashboardStats } from "../types";
import { adminDashboard } from "../api/admin";

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    adminDashboard().then((data) => setStats(data));
  }, []);

  return (
    <div className="min-h-screen w-full max-w-6xl mx-auto p-6 flex flex-col gap-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>
        <p className="text-sm text-gray-500">
          Overview of platform metrics and administrative tools
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-6 border border-gray-200 rounded-xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Total Users
            </p>
            <h3 className="text-3xl font-extrabold text-gray-900 mt-2">
              {stats?.totalUsers ?? 0}
            </h3>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg text-xl font-bold">
            👥
          </div>
        </div>

        <div className="bg-white p-6 border border-gray-200 rounded-xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Total Stores
            </p>
            <h3 className="text-3xl font-extrabold text-gray-900 mt-2">
              {stats?.totalStores ?? 0}
            </h3>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg text-xl font-bold">
            🏪
          </div>
        </div>

        <div className="bg-white p-6 border border-gray-200 rounded-xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Total Ratings
            </p>
            <h3 className="text-3xl font-extrabold text-gray-900 mt-2">
              {stats?.totalRatings ?? 0}
            </h3>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg text-xl font-bold">
            ★
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="text-base font-semibold text-gray-700">Management</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Link
            to="/admin/users"
            className="group bg-white p-6 border border-gray-200 rounded-xl shadow-sm hover:border-indigo-500 hover:shadow-md transition flex flex-col gap-2"
          >
            <div className="flex justify-between items-center">
              <h4 className="text-lg font-bold text-gray-800 group-hover:text-indigo-600 transition">
                Manage Users
              </h4>
              <span className="text-gray-400 group-hover:translate-x-1 transition-transform">
                →
              </span>
            </div>
            <p className="text-xs text-gray-500">
              View registered users, assign roles, and add new admin or store
              owner accounts.
            </p>
          </Link>

          <Link
            to="/admin/stores"
            className="group bg-white p-6 border border-gray-200 rounded-xl shadow-sm hover:border-indigo-500 hover:shadow-md transition flex flex-col gap-2"
          >
            <div className="flex justify-between items-center">
              <h4 className="text-lg font-bold text-gray-800 group-hover:text-indigo-600 transition">
                Manage Stores
              </h4>
              <span className="text-gray-400 group-hover:translate-x-1 transition-transform">
                →
              </span>
            </div>
            <p className="text-xs text-gray-500">
              View all listed stores, assign store owners, and filter directory
              records.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
