import { useState } from "react";
import type { FormEvent } from "react";

import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { signup } from "../api/auth";

interface SignupForm {
  name: string;
  email: string;
  address: string;
  password: string;
}

export default function Signup() {
  const [form, setForm] = useState<SignupForm>({
    name: "",
    email: "",
    address: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await signup(form);
      navigate("/login");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const data = err.response?.data;
        if (data && typeof data === "object" && "errors" in data) {
          const errors = (data as any).errors;
          console.error("Signup failed:", errors);
        } else {
          console.error("Signup failed:", err);
        }
      }
    }
  };

  return (
    <div className="h-dvh w-full flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-75">
        <h1>Full Name</h1>
        <input
          name="name"
          placeholder="Full Name (20-60 chars)"
          value={form.name}
          onChange={handleChange}
          className="border border-gray-300 rounded px-2 py-1"
          required
        />
        <h1>Email</h1>
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="border border-gray-300 rounded px-2 py-1"
          required
        />
        <h1>Address</h1>
        <textarea
          name="address"
          placeholder="Address (max 400 chars)"
          value={form.address}
          onChange={handleChange}
          className="border border-gray-300 rounded px-2 py-1"
        />
        <h1>Password</h1>
        <input
          name="password"
          type="password"
          placeholder="Password (8-16 chars, 1 uppercase, 1 special char)"
          value={form.password}
          onChange={handleChange}
          className="border border-gray-300 rounded px-2 py-1"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Sign Up
        </button>

        <p className="mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
