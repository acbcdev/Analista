import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router";
import "@/assets/tailwind.css";
import { router } from "./routes.tsx";
import Providers from "@/components/providers.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  </React.StrictMode>
);
