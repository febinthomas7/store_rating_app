import { useEffect, useState } from "react";
import axios from "axios";
import type { Store } from "../types";
import { addStore, adminStores } from "../api/admin";
import Table from "../components/Table";
import { useToast } from "../context/ToastContext";
import { Input } from "../components/Input";
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toast = useToast();

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
      setIsModalOpen(false); //
      setNewStore({ name: "", email: "", address: "", owner_id: "" });
      toast.success("created succesfully");
      fetchStores();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const data = err.response?.data;
        toast.error(
          "Create store failed: " +
            (data?.errors || data?.message || err.message),
        );
        console.error(
          "Create store failed:",
          data?.errors || data?.message || err.message,
        );
      } else {
        console.error("Create store failed:", err);
      }
    }
  };
  const storeColumns = [
    { header: "Store Name", accessor: "name", sortable: true },
    { header: "Store Email", accessor: "email" },
    { header: "Address", accessor: "address" },
    { header: "Owner", accessor: "ownerName" },
    {
      header: "Rating",
      accessor: (store: any) => (
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
          ★ {Number(store.rating).toFixed(1)}
        </span>
      ),
      sortable: true,
      sortKey: "rating",
    },
  ];

  return (
    <div className="min-h-screen w-full max-w-6xl mx-auto p-6 flex flex-col gap-6">
      {/* Page Heading */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Manage Stores</h2>
          <p className="text-sm text-gray-500">
            Filter and manage all registered stores
          </p>
        </div>
      </div>

      {/* 1. Filters Section at Top */}
      <div className="bg-white p-5 border border-gray-200 rounded-xl shadow-sm flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-gray-700">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Name"
            type="text"
            placeholder="Search by name"
            value={filters.name}
            onChange={(e) => setFilters({ ...filters, name: e.target.value })}
          />
          <Input
            label="Email"
            type="email"
            placeholder="Search by email"
            value={filters.email}
            onChange={(e) => setFilters({ ...filters, email: e.target.value })}
          />
          <Input
            label="Address"
            type="text"
            placeholder="Search by address"
            value={filters.address}
            onChange={(e) =>
              setFilters({ ...filters, address: e.target.value })
            }
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={fetchStores}
            className="bg-gray-900 hover:bg-black text-white text-sm font-medium py-2 px-5 rounded-lg transition"
          >
            Apply Filters
          </button>
        </div>
      </div>

      {/* 2. Stores Table */}
      <Table
        title="Store "
        columns={storeColumns}
        data={stores}
        onAdd={() => setIsModalOpen(true)}
        addButtonLabel="+ Add Store"
      />

      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-xl shadow-2xl border border-gray-200 p-6 flex flex-col gap-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-lg font-bold text-gray-800">Add New Store</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="flex flex-col gap-3">
              <Input
                label="Name"
                type="text"
                placeholder="Name (20-60 chars)"
                value={newStore.name}
                onChange={(e) =>
                  setNewStore({ ...newStore, name: e.target.value })
                }
                required
              />

              <Input
                label="Email"
                type="email"
                placeholder="Email"
                value={newStore.email}
                onChange={(e) =>
                  setNewStore({ ...newStore, email: e.target.value })
                }
                required
              />

              <Input
                label="Address"
                type="text"
                placeholder="Address"
                value={newStore.address}
                onChange={(e) =>
                  setNewStore({ ...newStore, address: e.target.value })
                }
              />

              <Input
                label="User Id"
                type="text"
                placeholder="Owner User ID (optional)"
                value={newStore.owner_id}
                onChange={(e) =>
                  setNewStore({ ...newStore, owner_id: e.target.value })
                }
              />

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-5 rounded-lg text-sm transition"
                >
                  Add Store
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
