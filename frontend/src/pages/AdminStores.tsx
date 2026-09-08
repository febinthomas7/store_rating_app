import { useEffect, useState } from "react";
import axios from "axios";
import type { Store } from "../types";
import { adminStores } from "../api/admin";

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
  const [errors, setErrors] = useState<string[]>([]);

  const fetchStores = async () => {
    const { data } = await adminStores({ ...filters, sortBy, order });
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
    setErrors([]);
    try {
      await adminStores({ ...newStore, owner_id: newStore.owner_id || null });
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
    <div>
      <h2>Manage Stores</h2>

      <form onSubmit={handleCreate}>
        <h3>Add Store</h3>
        <input
          placeholder="Name (20-60 chars)"
          value={newStore.name}
          onChange={(e) => setNewStore({ ...newStore, name: e.target.value })}
          required
        />
        <input
          placeholder="Email"
          value={newStore.email}
          onChange={(e) => setNewStore({ ...newStore, email: e.target.value })}
        />
        <textarea
          placeholder="Address"
          value={newStore.address}
          onChange={(e) =>
            setNewStore({ ...newStore, address: e.target.value })
          }
        />
        <input
          placeholder="Owner User ID (optional)"
          value={newStore.owner_id}
          onChange={(e) =>
            setNewStore({ ...newStore, owner_id: e.target.value })
          }
        />
        <button type="submit">Add</button>
      </form>

      <h3>Filters</h3>
      <input
        placeholder="Name"
        value={filters.name}
        onChange={(e) => setFilters({ ...filters, name: e.target.value })}
      />
      <input
        placeholder="Email"
        value={filters.email}
        onChange={(e) => setFilters({ ...filters, email: e.target.value })}
      />
      <input
        placeholder="Address"
        value={filters.address}
        onChange={(e) => setFilters({ ...filters, address: e.target.value })}
      />
      <button onClick={fetchStores}>Apply Filters</button>

      <table border={1} cellPadding={8}>
        <thead>
          <tr>
            <th onClick={() => toggleSort("name")}>Name</th>
            <th onClick={() => toggleSort("email")}>Email</th>
            <th onClick={() => toggleSort("address")}>Address</th>
            <th onClick={() => toggleSort("rating")}>Rating</th>
          </tr>
        </thead>
        <tbody>
          {stores.map((s) => (
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
