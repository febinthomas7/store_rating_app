import { useEffect, useState } from "react";
import type { StoreOwnerDashboardData } from "../types";
import { userStoreDashboard } from "../api/user";

export default function StoreOwnerDashboard() {
  const [data, setData] = useState<StoreOwnerDashboardData | null>(null);

  useEffect(() => {
    userStoreDashboard().then((data) => setData(data));
  }, []);

  return (
    <div className=" h-dvh w-full flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold mb-4">{data?.store} - Dashboard</h2>
      <p className="text-lg">
        Average Rating: {Number(data?.averageRating).toFixed(1)}
      </p>
      <h3 className="text-xl font-semibold mb-2">Ratings Submitted</h3>
      <table
        border={1}
        cellPadding={8}
        className="border-collapse border border-gray-300 w-3/4"
      >
        <thead>
          <tr>
            <th>User</th>
            <th>Email</th>
            <th>Rating</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {data?.ratings.map((r, i) => (
            <tr key={i}>
              <td>{r.name}</td>
              <td>{r.email}</td>
              <td>{r.rating}</td>
              <td>{new Date(r.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
