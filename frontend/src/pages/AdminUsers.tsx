import { useEffect, useState } from "react";
import axios from "axios";
import type { User, Role } from "../types";
import { adminUsers } from "../api/admin";

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
    role: "user",
  });
  const fetchUsers = async () => {
    const { data } = await adminUsers({ ...filters, sortBy, order });
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
      await adminUsers({ ...newUser, role: newUser.role || "user" });
      setNewUser({
        name: "",
        email: "",
        password: "",
        address: "",
        role: "user",
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
    <div>
      <h2>Manage Users</h2>

      <form onSubmit={handleCreate}>
        <h3>Add User</h3>
        <input
          placeholder="Name (20-60 chars)"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          required
        />
        <input
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          required
        />
        <input
          placeholder="Password"
          type="password"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          required
        />
        <textarea
          placeholder="Address"
          value={newUser.address}
          onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
        />
        <select
          value={newUser.role}
          onChange={(e) =>
            setNewUser({ ...newUser, role: e.target.value as Role })
          }
        >
          <option value="user">Normal User</option>
          <option value="admin">Admin</option>
          <option value="store_owner">Store Owner</option>
        </select>
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
      <select
        value={filters.role}
        onChange={(e) => setFilters({ ...filters, role: e.target.value })}
      >
        <option value="">All Roles</option>
        <option value="user">Normal User</option>
        <option value="admin">Admin</option>
        <option value="store_owner">Store Owner</option>
      </select>
      <button onClick={fetchUsers}>Apply Filters</button>

      <table border={1} cellPadding={8}>
        <thead>
          <tr>
            <th onClick={() => toggleSort("name")}>Name</th>
            <th onClick={() => toggleSort("email")}>Email</th>
            <th onClick={() => toggleSort("address")}>Address</th>
            <th onClick={() => toggleSort("role")}>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
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
