/* eslint-disable react-refresh/only-export-components */
import { createBrowserRouter, Outlet, Navigate } from "react-router-dom";
import { lazy } from "react";
import { useAuth } from "./context/AuthContext";
import StoreList from "./pages/StoreList";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminStores from "./pages/AdminStores";
import StoreOwnerDashboard from "./pages/StoreOwnerDashboard";
import FallBack from "./components/FallBack";
import { getRoleDefaultPath } from "./utils";

const UpdatePassword = lazy(() => import("./pages/UpdatePassword"));
const PageNotFound = lazy(() => import("./pages/PageNotFound"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));

const PrivateLayout = ({ allowedRoles }: { allowedRoles?: string[] }) => {
  const { user, loading } = useAuth();

  if (loading) return <FallBack />;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={getRoleDefaultPath(user.role)} replace />;
  }

  return <Outlet />;
};

const PublicLayout = () => {
  const { user, loading } = useAuth();

  if (loading) return <FallBack />;

  if (user) {
    return <Navigate to={getRoleDefaultPath(user.role)} replace />;
  }

  return <Outlet />;
};

const RootRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) return <FallBack />;
  if (!user) return <Navigate to="/login" replace />;

  return <Navigate to={getRoleDefaultPath(user.role)} replace />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootRedirect />,
  },

  {
    element: <PublicLayout />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <Signup /> },
    ],
  },

  {
    element: <PrivateLayout allowedRoles={["ADMIN", "USER", "STORE_OWNER"]} />,
    children: [{ path: "/update-password", element: <UpdatePassword /> }],
  },

  {
    element: <PrivateLayout allowedRoles={["USER", "ADMIN"]} />,
    children: [{ path: "/store", element: <StoreList /> }],
  },

  {
    element: <PrivateLayout allowedRoles={["STORE_OWNER", "ADMIN"]} />,
    children: [{ path: "/store/owner", element: <StoreOwnerDashboard /> }],
  },

  {
    element: <PrivateLayout allowedRoles={["ADMIN"]} />,
    children: [
      { path: "/admin", element: <AdminDashboard /> },
      { path: "/admin/users", element: <AdminUsers /> },
      { path: "/admin/stores", element: <AdminStores /> },
    ],
  },

  { path: "*", element: <PageNotFound /> },
]);

export default router;
