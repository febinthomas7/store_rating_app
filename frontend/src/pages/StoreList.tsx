import { useEffect, useState } from "react";
import type { Store } from "../types";
import { getStoreList, submitRatingToStore } from "../api/user";

export default function StoreList() {
  const [stores, setStores] = useState<Store[]>([]);
  const [filters, setFilters] = useState({ name: "", address: "" });
  const [sortBy, setSortBy] = useState("name");
  const [order, setOrder] = useState<"asc" | "desc">("asc");

  const fetchStores = async () => {
    const data = await getStoreList({ ...filters, sortBy, order });
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
    await submitRatingToStore(storeId, rating);
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
    <div className="h-dvh w-full flex flex-col items-center justify-center p-4">
      <h2 className="text-2xl font-bold mb-4">Stores</h2>
      <form onSubmit={handleFilterSubmit}>
        <input
          placeholder="Search by name"
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
          className="border border-gray-300 rounded px-2 py-1"
        />
        <input
          placeholder="Search by address"
          value={filters.address}
          onChange={(e) => setFilters({ ...filters, address: e.target.value })}
          className="border border-gray-300 rounded px-2 py-1"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Search
        </button>
      </form>

      <table
        border={1}
        cellPadding={8}
        className="border-collapse border border-gray-300 w-3/4 mt-4"
      >
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
          {stores?.map((s) => (
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
