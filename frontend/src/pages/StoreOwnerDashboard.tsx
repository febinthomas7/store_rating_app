import { useEffect, useState } from "react";
import type { StoreOwnerDashboardData } from "../types";
import { userStoreDashboard } from "../api/user";
import Table from "../components/Table";

export default function StoreOwnerDashboard() {
  const [data, setData] = useState<StoreOwnerDashboardData | null>(null);

  useEffect(() => {
    userStoreDashboard().then((data) => setData(data));
  }, []);
  const ratingColumns = [
    { header: "User", accessor: "name", sortable: true },
    { header: "Email", accessor: "email" },
    {
      header: "Rating",
      accessor: (r: any) => (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
          ★ {Number(r.rating).toFixed(1)}
        </span>
      ),
      sortable: true,
      sortKey: "rating",
    },
    {
      header: "Date",
      accessor: (r: any) =>
        r.created_at ? new Date(r.created_at).toLocaleDateString() : "-",
      sortable: true,
      sortKey: "created_at",
    },
  ];
  const totalReviews = data?.ratings?.length || 0;
  const avgRating = Number(data?.averageRating || 0).toFixed(1);
  return (
    <div className="min-h-screen w-full max-w-6xl mx-auto p-6 flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">
          {data?.store || "Store"} Dashboard
        </h2>
        <p className="text-sm text-gray-500">
          Overview of customer ratings and feedback
        </p>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-5 border border-gray-200 rounded-xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Average Rating
            </p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">
              {avgRating} <span className="text-amber-500 text-xl">★</span>
            </h3>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg font-bold text-lg">
            ★
          </div>
        </div>

        <div className="bg-white p-5 border border-gray-200 rounded-xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Total Reviews
            </p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">
              {totalReviews}
            </h3>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg font-bold text-lg">
            💬
          </div>
        </div>
      </div>

      {/* Ratings Table */}
      <Table
        title="Submitted Ratings"
        description="All ratings and reviews submitted by customers"
        columns={ratingColumns}
        data={data?.ratings || []}
        searchPlaceholder="Search customer or email..."
      />
    </div>
  );
}
