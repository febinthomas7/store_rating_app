import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { signup } from "../api/auth";
import { useToast } from "../context/ToastContext";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
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
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signup(form);
      toast.success("Signup successful! Please login.");
      navigate("/login");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const data = err.response?.data;
        if (data && typeof data === "object" && "errors" in data) {
          const errors = (data as any).errors;
          for (const error of errors) {
            toast.error(error);
          }
        } else {
          toast.error("Signup failed: " + (data?.message || err.message));
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-dvh w-full flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-75">
        <Input
          label="Full Name"
          name="name"
          placeholder="Full Name (20-60 chars)"
          value={form.name}
          onChange={handleChange}
          required
        />

        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <Input
          label="Address"
          name="address"
          type="text"
          placeholder="Address (max 400 chars)"
          value={form.address}
          onChange={handleChange}
          required
        />

        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="Password (8-16 chars, 1 uppercase, 1 special char)"
          value={form.password}
          onChange={handleChange}
          required
        />
        <Button
          isLoading={loading}
          loadingText="loading.."
          disabled={loading}
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Sign Up
        </Button>

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
