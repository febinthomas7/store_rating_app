import { useEffect, useState } from "react";
import { api } from "../api/axios";
import type { StoreOwnerDashboardData } from "../types";

export default function StoreOwnerDashboard() {
  const [data, setData] = useState<StoreOwnerDashboardData | null>(null);

  useEffect(() => {
    api
      .get<StoreOwnerDashboardData>("/store-owner/dashboard")
      .then(({ data }) => setData(data));
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div>
      <h2>{data.store} - Dashboard</h2>
      <p>Average Rating: {Number(data.averageRating).toFixed(1)}</p>
      <h3>Ratings Submitted</h3>
      <table border={1} cellPadding={8}>
        <thead>
          <tr>
            <th>User</th>
            <th>Email</th>
            <th>Rating</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {data.ratings.map((r, i) => (
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
