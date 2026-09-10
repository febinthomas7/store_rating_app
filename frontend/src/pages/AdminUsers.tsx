import { useEffect, useState } from "react";
import axios from "axios";
import type { User, Role } from "../types";
import { addUser, listUsers } from "../api/admin";
import { Input } from "../components/Input";
import { useNavigate } from "react-router-dom";
import Table from "../components/Table";

interface NewUserForm {
  name: string;
  email: string;
  password: string;
  address: string;
  role: Role;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    address: "",
    role: "",
  });
  const [sortBy, setSortBy] = useState("name");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [newUser, setNewUser] = useState<NewUserForm>({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "USER",
  });
  const navigate = useNavigate();
  const fetchUsers = async () => {
    const data = await listUsers({ ...filters, sortBy, order });

    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
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
      await addUser({ ...newUser, role: newUser.role || "USER" });
      setNewUser({
        name: "",
        email: "",
        password: "",
        address: "",
        role: "USER",
      });
      setIsModalOpen(false);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const data = err.response?.data;
        console.error(
          "Create user failed:",
          data?.errors || data?.message || err.message,
        );
      } else {
        console.error("Create user failed:", err);
      }
    }
  };

  const storeColumns = [
    { header: "Id", accessor: "id" },
    { header: "Name", accessor: "name", sortable: true },
    { header: "Email", accessor: "email" },
    { header: "Address", accessor: "address" },
    { header: "Role", accessor: "role" },
  ];

  return (
    <div className="min-h-screen w-full max-w-6xl mx-auto p-6 flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Manage Users</h2>
          <p className="text-sm text-gray-500">
            Filter and manage user accounts
          </p>
        </div>
      </div>

      <div className="bg-white p-5 border border-gray-200 rounded-xl shadow-sm flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-gray-700">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-700">Role</label>
            <select
              value={filters.role}
              onChange={(e) => setFilters({ ...filters, role: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Roles</option>
              <option value="USER">Normal User</option>
              <option value="ADMIN">Admin</option>
              <option value="STORE_OWNER">Store Owner</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            onClick={fetchUsers}
            className="bg-gray-900 hover:bg-black text-white text-sm font-medium py-2 px-5 rounded-lg transition"
          >
            Apply Filters
          </button>
        </div>
      </div>

      <Table
        title="User Directory"
        columns={storeColumns}
        data={users}
        onAdd={() => setIsModalOpen(true)}
        addButtonLabel="+ Add User"
        onRowClick={(user) => navigate(`/admin/users/${user.id}`)}
      />

      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-xl shadow-2xl border border-gray-200 p-6 flex flex-col gap-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-lg font-bold text-gray-800">Add New User</h3>
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
                value={newUser.name}
                onChange={(e) =>
                  setNewUser({ ...newUser, name: e.target.value })
                }
                required
              />

              <Input
                label="Email"
                type="email"
                placeholder="Email"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
                required
              />

              <Input
                label="Password"
                type="password"
                placeholder="Password"
                value={newUser.password}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
                required
              />

              <Input
                label="Address"
                type="text"
                placeholder="Address"
                value={newUser.address}
                onChange={(e) =>
                  setNewUser({ ...newUser, address: e.target.value })
                }
              />

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-700">
                  Role
                </label>
                <select
                  value={newUser.role}
                  onChange={(e) =>
                    setNewUser({ ...newUser, role: e.target.value as Role })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="USER">Normal User</option>
                  <option value="ADMIN">Admin</option>
                  <option value="STORE_OWNER">Store Owner</option>
                </select>
              </div>

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
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
