import { useEffect, useState } from "react";
import { api } from "../api/axios";
import type { Store } from "../types";

export default function StoreList() {
  const [stores, setStores] = useState<Store[]>([]);
  const [filters, setFilters] = useState({ name: "", address: "" });
  const [sortBy, setSortBy] = useState("name");
  const [order, setOrder] = useState<"asc" | "desc">("asc");

  const fetchStores = async () => {
    const { data } = await api.get<Store[]>("/user/stores", {
      params: { ...filters, sortBy, order },
    });
    setStores(data);
  };

  useEffect(() => {
    fetchStores();
  }, [sortBy, order]);

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStores();
  };

  const submitRating = async (storeId: number, rating: number) => {
    await api.post(`/user/stores/${storeId}/rating`, { rating });
    fetchStores();
  };

  const toggleSort = (col: string) => {
    if (sortBy === col) setOrder(order === "asc" ? "desc" : "asc");
    else {
      setSortBy(col);
      setOrder("asc");
    }
  };

  return (
    <div>
      <h2>Stores</h2>
      <form onSubmit={handleFilterSubmit}>
        <input
          placeholder="Search by name"
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
        />
        <input
          placeholder="Search by address"
          value={filters.address}
          onChange={(e) => setFilters({ ...filters, address: e.target.value })}
        />
        <button type="submit">Search</button>
      </form>

      <table border={1} cellPadding={8}>
        <thead>
          <tr>
            <th onClick={() => toggleSort("name")}>Name</th>
            <th onClick={() => toggleSort("address")}>Address</th>
            <th onClick={() => toggleSort("overallRating")}>Overall Rating</th>
            <th>Your Rating</th>
            <th>Rate</th>
          </tr>
        </thead>
        <tbody>
          {stores.map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.address}</td>
              <td>{Number(s.overallRating).toFixed(1)}</td>
              <td>{s.userRating || "-"}</td>
              <td>
                <select
                  defaultValue={s.userRating || ""}
                  onChange={(e) => submitRating(s.id, Number(e.target.value))}
                >
                  <option value="" disabled>
                    Rate
                  </option>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
