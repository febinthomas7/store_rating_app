import { Link, useNavigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };
  const navLinks = {
    ADMIN: [
      { to: "/admin", label: "Dashboard" },
      { to: "/admin/users", label: "Users" },
      { to: "/admin/stores", label: "Stores" },
    ],
    USER: [{ to: "/store", label: "Stores" }],
    STORE_OWNER: [{ to: "/store/owner", label: "Owner Dashboard" }],
  };

  const isActive = (path: string) => location.pathname === path;

  const linkStyle = (path: string) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive(path)
        ? "bg-indigo-600 text-white"
        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
    }`;

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 flex flex-col font-sans">
      <header className="sticky top-3 z-40 m-3 rounded-lg bg-black ">
        <div className=" mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <nav className="flex items-center gap-2">
              {navLinks[user?.role]?.map((nav, i) => {
                return (
                  <Link key={i} to={nav.to} className={linkStyle(nav.to)}>
                    {nav.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-3">
                <div className="hidden md:flex flex-col text-right">
                  <div className="flex items-center justify-end gap-2">
                    <span
                      className={`px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded ${
                        user.role === "ADMIN"
                          ? "bg-purple-500/20 text-purple-300"
                          : user.role === "STORE_OWNER"
                            ? "bg-blue-500/20 text-blue-300"
                            : "bg-emerald-500/20 text-emerald-300"
                      }`}
                    >
                      {user.role}
                    </span>
                  </div>
                  <span className="text-[11px] text-zinc-400">
                    {user.name || user.email}
                  </span>
                </div>

                <Link
                  to="/update-password"
                  className="p-2 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm transition"
                  title="Update Password"
                >
                  ⚙️
                </Link>

                <button
                  onClick={handleLogout}
                  className=" text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-md transition-colors cursor-pointer"
                  title="Logout"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l3 3m0 0l-3 3m3-3H8.25"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}
