import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router";
import "@/assets/tailwind.css";
import { router } from "./routes.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
