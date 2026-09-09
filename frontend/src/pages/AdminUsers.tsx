import { useEffect, useState } from "react";
import axios from "axios";
import type { User, Role } from "../types";
import { addUser, listUsers } from "../api/admin";

interface NewUserForm {
  name: string;
  email: string;
  password: string;
  address: string;
  role: Role;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
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
  const fetchUsers = async () => {
    const data = await listUsers({ ...filters, sortBy, order });
    console.log("Fetched users data:", data);
    setUsers(data);
  };
  console.log("Fetched users:", users);

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

  return (
    <div className="h-dvh w-full flex flex-col items-center justify-center p-4">
      <h2 className="text-2xl font-bold mb-4">Manage Users</h2>

      <form onSubmit={handleCreate} className="flex flex-col gap-2 w-75">
        <h3 className="text-xl font-semibold mb-2">Add User</h3>
        <input
          placeholder="Name (20-60 chars)"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          className="border border-gray-300 rounded px-2 py-1"
          required
        />
        <input
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          className="border border-gray-300 rounded px-2 py-1"
          required
        />
        <input
          placeholder="Password"
          type="password"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          className="border border-gray-300 rounded px-2 py-1"
          required
        />
        <textarea
          placeholder="Address"
          value={newUser.address}
          onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
          className="border border-gray-300 rounded px-2 py-1"
        />
        <select
          value={newUser.role}
          onChange={(e) =>
            setNewUser({ ...newUser, role: e.target.value as Role })
          }
          className="border border-gray-300 rounded px-2 py-1"
        >
          <option value="USER">Normal User</option>
          <option value="ADMIN">Admin</option>
          <option value="STORE_OWNER">Store Owner</option>
        </select>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Add
        </button>
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
      <select
        value={filters.role}
        onChange={(e) => setFilters({ ...filters, role: e.target.value })}
        className="border border-gray-300 rounded px-2 py-1"
      >
        <option value="">All Roles</option>
        <option value="user">Normal User</option>
        <option value="admin">Admin</option>
        <option value="store_owner">Store Owner</option>
      </select>
      <button
        onClick={fetchUsers}
        className="bg-blue-500 text-white py-2 px-4 rounded"
      >
        Apply Filters
      </button>

      <table
        border={1}
        cellPadding={8}
        className="border-collapse border border-gray-300 w-3/4 mt-4"
      >
        <thead className="bg-gray-200">
          <tr className="cursor-pointer">
            <th onClick={() => toggleSort("name")}>Name</th>
            <th onClick={() => toggleSort("email")}>Email</th>
            <th onClick={() => toggleSort("address")}>Address</th>
            <th onClick={() => toggleSort("role")}>Role</th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {users?.map((u) => (
            <tr key={u.id} className="hover:bg-gray-100">
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.address}</td>
              <td>{u.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
