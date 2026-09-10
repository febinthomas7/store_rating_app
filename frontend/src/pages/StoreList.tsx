import { useEffect, useState } from "react";
import type { Store } from "../types";
import { getStoreList, submitRatingToStore } from "../api/user";
import { Input } from "../components/Input";
import Table from "../components/Table";

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
  const storeColumns = [
    { header: "Name", accessor: "name", sortable: true },
    { header: "Address", accessor: "address", sortable: true },
    {
      header: "Overall Rating",
      accessor: (s: any) => (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
          ★ {Number(s.overallRating || 0).toFixed(1)}
        </span>
      ),
      sortable: true,
      sortKey: "overallRating",
    },
    {
      header: "Your Rating",
      accessor: (s: any) => (
        <span className="font-semibold text-gray-700">
          {s.userRating ? `★ ${s.userRating}` : "-"}
        </span>
      ),
    },
    {
      header: "Rate",
      accessor: (s: any) => (
        <select
          value={s.userRating || ""}
          onChange={(e) => submitRating(s.id, Number(e.target.value))}
          className="px-2 py-1 border border-gray-300 rounded-lg text-xs font-medium bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
        >
          <option value="" disabled>
            Rate Store
          </option>
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n} Star{n > 1 ? "s" : ""}
            </option>
          ))}
        </select>
      ),
    },
  ];
  return (
    <div className="min-h-screen w-full max-w-6xl mx-auto p-6 flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Browse Stores</h2>
        <p className="text-sm text-gray-500">
          Search for registered stores and submit your ratings
        </p>
      </div>

      {/* 1. Filters Section at Top */}
      <form
        onSubmit={handleFilterSubmit}
        className="bg-white p-5 border border-gray-200 rounded-xl shadow-sm flex flex-col gap-4"
      >
        <h3 className="text-sm font-semibold text-gray-700">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Name"
            type="text"
            placeholder="Search by store name"
            value={filters.name}
            onChange={(e: any) =>
              setFilters({ ...filters, name: e.target.value })
            }
          />
          <Input
            label="Address"
            type="text"
            placeholder="Search by address"
            value={filters.address}
            onChange={(e: any) =>
              setFilters({ ...filters, address: e.target.value })
            }
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-gray-900 hover:bg-black text-white text-sm font-medium py-2 px-5 rounded-lg transition"
          >
            Search Stores
          </button>
        </div>
      </form>

      {/* 2. Stores Table */}
      <Table
        title="Available Stores"
        columns={storeColumns}
        data={stores}
        searchPlaceholder="Filter listed stores..."
      />
    </div>
  );
}
