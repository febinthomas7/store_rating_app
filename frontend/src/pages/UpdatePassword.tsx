import { useState, FormEvent } from "react";
import axios from "axios";
import { updatePassword } from "../api/auth";
import { useToast } from "../context/ToastContext";
import { Input } from "../components/Input";

export default function UpdatePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const toast = useToast();
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage("");
    try {
      const { data } = await updatePassword({
        currentPassword,
        newPassword,
      });
      toast.success("Password updated successfully!");
      setMessage(data.message);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(
          err.response?.data?.message || "Failed to update password.",
        );
      } else {
        toast.error("Failed to update password.");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
      <h2 className="text-xl font-bold text-gray-800 mb-1">Update Password</h2>
      <p className="text-xs text-gray-500 mb-6">
        Enter your current password and choose a secure new one.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Current Password"
          type="password"
          placeholder="Enter Current password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />

        <Input
          label="New Password"
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <p className="text-[11px] text-gray-400 mt-1">
          Must be 8–16 characters with at least 1 uppercase letter and 1 special
          character.
        </p>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-lg transition"
        >
          Update Password
        </button>
      </form>

      {message && (
        <p className="mt-4 p-2 text-center text-xs font-medium rounded-md bg-gray-100 text-gray-700">
          {message}
        </p>
      )}
    </div>
  );
}
