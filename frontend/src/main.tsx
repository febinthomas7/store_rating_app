import { createRoot } from "react-dom/client";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import { Suspense } from "react";
import FallBack from "./components/FallBack";

createRoot(document.getElementById("root")!).render(
  <Suspense fallback={<FallBack />}>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </Suspense>,
);
