import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { login } from "../api/auth";

import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { Input } from "../components/Input";
import { Button } from "../components/Button";

export default function Login() {
  const [email, setEmail] = useState("tfebin39@gmail.com");
  const [password, setPassword] = useState("Tfebin20@2003");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const { setUser } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login({ email, password });
      setUser(res.user);
      toast.success("Login successful!");
    } catch (err) {
      console.log(err);
      if (err.response?.status === 429) {
        toast.error("Too many request, try after 15 minutes");
      } else {
        toast.error("Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-dvh w-full flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold mb-4">Login</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-75">
        <Input
          label="Email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          label="Password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Button
          type="submit"
          isLoading={loading}
          loadingText="loading.."
          className="bg-blue-500 text-white py-2 px-4 rounded"
          disabled={loading}
        >
          Login
        </Button>
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
