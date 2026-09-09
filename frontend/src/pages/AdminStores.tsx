import { useEffect, useState } from "react";
import axios from "axios";
import type { Store } from "../types";
import { addStore, adminStores } from "../api/admin";

interface NewStoreForm {
  name: string;
  email: string;
  address: string;
  owner_id: string;
}

export default function AdminStores() {
  const [stores, setStores] = useState<Store[]>([]);
  const [filters, setFilters] = useState({ name: "", email: "", address: "" });
  const [sortBy, setSortBy] = useState("name");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [newStore, setNewStore] = useState<NewStoreForm>({
    name: "",
    email: "",
    address: "",
    owner_id: "",
  });

  const fetchStores = async () => {
    const data = await adminStores({ ...filters, sortBy, order });
    setStores(data);
  };

  useEffect(() => {
    fetchStores();
  }, [sortBy, order]);

  const toggleSort = (col: string) => {
    if (sortBy === col) setOrder(order === "asc" ? "desc" : "asc");
    else {
      setSortBy(col);
      setOrder("asc");
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addStore({ ...newStore, owner_id: newStore.owner_id || null });
      setNewStore({ name: "", email: "", address: "", owner_id: "" });
      fetchStores();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const data = err.response?.data;
        console.error(
          "Create store failed:",
          data?.errors || data?.message || err.message,
        );
      } else {
        console.error("Create store failed:", err);
      }
    }
  };

  return (
    <div className="h-dvh w-full flex flex-col items-center justify-center p-4">
      <h2 className="text-2xl font-bold mb-4">Manage Stores</h2>

      <form onSubmit={handleCreate} className="flex flex-col gap-2 w-75">
        <h3 className="text-xl font-semibold mb-2">Add Store</h3>
        <input
          placeholder="Name (20-60 chars)"
          value={newStore.name}
          onChange={(e) => setNewStore({ ...newStore, name: e.target.value })}
          className="border border-gray-300 rounded px-2 py-1"
          required
        />
        <input
          placeholder="Email"
          value={newStore.email}
          onChange={(e) => setNewStore({ ...newStore, email: e.target.value })}
          className="border border-gray-300 rounded px-2 py-1"
        />
        <textarea
          placeholder="Address"
          value={newStore.address}
          onChange={(e) =>
            setNewStore({ ...newStore, address: e.target.value })
          }
          className="border border-gray-300 rounded px-2 py-1"
        />
        <input
          placeholder="Owner User ID (optional)"
          value={newStore.owner_id}
          onChange={(e) =>
            setNewStore({ ...newStore, owner_id: e.target.value })
          }
          className="border border-gray-300 rounded px-2 py-1"
        />
        <button type="submit">Add</button>
      </form>

      <h3 className="text-xl font-semibold mb-2">Filters</h3>
      <input
        placeholder="Name"
        value={filters.name}
        onChange={(e) => setFilters({ ...filters, name: e.target.value })}
        className="border border-gray-300 rounded px-2 py-1"
      />
      <input
        placeholder="Email"
        value={filters.email}
        onChange={(e) => setFilters({ ...filters, email: e.target.value })}
        className="border border-gray-300 rounded px-2 py-1"
      />
      <input
        placeholder="Address"
        value={filters.address}
        onChange={(e) => setFilters({ ...filters, address: e.target.value })}
        className="border border-gray-300 rounded px-2 py-1"
      />
      <button
        onClick={fetchStores}
        className="bg-blue-500 text-white py-2 px-4 rounded"
      >
        Apply Filters
      </button>

      <table
        border={1}
        cellPadding={8}
        className="border-collapse border border-gray-300 w-3/4 mt-4"
      >
        <thead>
          <tr>
            <th onClick={() => toggleSort("name")} className="cursor-pointer">
              Name
            </th>
            <th onClick={() => toggleSort("email")} className="cursor-pointer">
              Email
            </th>
            <th
              onClick={() => toggleSort("address")}
              className="cursor-pointer"
            >
              Address
            </th>
            <th onClick={() => toggleSort("rating")} className="cursor-pointer">
              Rating
            </th>
          </tr>
        </thead>
        <tbody className="text-center">
          {stores?.map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.email}</td>
              <td>{s.address}</td>
              <td>{Number(s.rating).toFixed(1)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
