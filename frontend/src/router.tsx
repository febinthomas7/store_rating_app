/* eslint-disable react-refresh/only-export-components */
import { createBrowserRouter, Outlet } from "react-router-dom";
import { lazy } from "react";
import { Navigate } from "react-router-dom";
// import { useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import StoreList from "./pages/StoreList";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminStores from "./pages/AdminStores";
import StoreOwnerDashboard from "./pages/StoreOwnerDashboard";

const UpdatePassword = lazy(() => import("./pages/UpdatePassword"));

const PageNotFound = lazy(() => import("./pages/PageNotFound"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));

const PrivateLayout = ({ allowedRoles }: { allowedRoles?: string[] }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

const PublicLayout = () => {
  // const { user } = useAuth();

  // if (!user) {
  //   return <Navigate to="/login" replace />;
  // }

  return <Outlet />;
};

const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <Signup /> },
    ],
  },

  // Protected Routes
  {
    element: <PrivateLayout />,
    children: [
      { path: "/update-password", element: <UpdatePassword /> },
      { path: "/store", element: <StoreList /> },
      { path: "/admin", element: <AdminDashboard /> },
      { path: "/admin/users", element: <AdminUsers /> },
      { path: "/admin/stores", element: <AdminStores /> },
      { path: "/store/owner", element: <StoreOwnerDashboard /> },
    ],
  },

  // Fallback
  { path: "*", element: <PageNotFound /> },
]);

export default router;
