import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { userDetails } from "../api/user";
import FallBack from "../components/FallBack";

interface UserProfile {
  id: number | string;
  name: string;
  email: string;
  address: string;
  role: string;
  rating?: string;
}

export default function UserDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);

        const data = await userDetails(id);

        if (Array.isArray(data)) {
          const matched = data.find((u: any) => String(u.id) === String(id));
          setUser(matched || null);
        } else {
          setUser(data);
        }
      } catch (err) {
        if (axios.isAxiosError(err)) {
          console.error(
            "Failed to load user details:",
            err.response?.data || err.message,
          );
        } else {
          console.error("Failed to load user details:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUser();
    }
  }, [id]);

  if (loading) return <FallBack />;

  if (!user) {
    return (
      <div className="min-h-screen max-w-6xl mx-auto p-6 flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500 font-medium">User not found.</p>
        <button
          onClick={() => navigate("/admin/users")}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
        >
          ← Back to Users
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full max-w-6xl mx-auto p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/users")}
            className="p-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-100 transition text-gray-700"
          >
            ← Back
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
            <p className="text-sm text-gray-500">
              User Profile &amp; Rating History
            </p>
          </div>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800 ${
            user.role === "ADMIN"
              ? "bg-purple-100 text-purple-800"
              : user.role === "STORE_OWNER"
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-800"
          }`}
        >
          {user.role}
        </span>
      </div>

      <div
        className={`bg-white border border-gray-200 rounded-xl p-6 shadow-sm grid grid-cols-1 ${user.role == "STORE_OWNER" ? "md:grid-cols-4" : "md:grid-cols-3"}  gap-6`}
      >
        {user.role == "STORE_OWNER" && (
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Average Rating
            </span>
            <p className="text-base font-bold text-gray-800 mt-1">
              {Number(user.rating).toFixed(1)}
            </p>
          </div>
        )}

        <div>
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            User ID
          </span>
          <p className="text-base font-bold text-gray-800 mt-1">{user.id}</p>
        </div>

        <div>
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Email Address
          </span>
          <p className="text-base font-bold text-gray-800 mt-1">{user.email}</p>
        </div>

        <div>
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Address
          </span>
          <p className="text-base font-bold text-gray-800 mt-1">
            {user.address || "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
}
