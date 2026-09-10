import { createRoot } from "react-dom/client";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import { Suspense } from "react";
import FallBack from "./components/FallBack";
import { ToastProvider } from "./context/ToastContext";
createRoot(document.getElementById("root")!).render(
  <Suspense fallback={<FallBack />}>
    <ToastProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ToastProvider>
  </Suspense>,
);
