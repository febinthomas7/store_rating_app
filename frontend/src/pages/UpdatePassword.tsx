import { useState, FormEvent } from "react";
import axios from "axios";
import { api } from "../api/axios";

export default function UpdatePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage("");
    try {
      const { data } = await api.put<{ message: string }>("/auth/password", {
        currentPassword,
        newPassword,
      });
      setMessage(data.message);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setMessage(err.response?.data?.message || "Failed to update password.");
      } else {
        setMessage("Failed to update password.");
      }
    }
  };

  return (
    <div>
      <h2>Update Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Current Password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="New Password (8-16 chars, 1 uppercase, 1 special)"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button type="submit">Update</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
