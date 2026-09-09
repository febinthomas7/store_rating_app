import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { login } from "../api/auth";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("tfebin39@gmail.com");
  const [password, setPassword] = useState("Tfebin20@2003");

  const { setUser } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await login({ email, password });
      setUser(res.user);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error("Login failed:", err.response?.data || err.message);
      } else {
        console.error("Login failed:", err);
      }
    }
  };

  return (
    <div className="h-dvh w-full flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-75">
        <h1>Email</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          className="border border-gray-300 rounded px-2 py-1"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <h1>Password</h1>
        <input
          type="password"
          placeholder="Password"
          value={password}
          className="border border-gray-300 rounded px-2 py-1"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Login
        </button>
      </form>
      <p className="mt-4">
        New user?{" "}
        <Link to="/signup" className="text-blue-500 underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
