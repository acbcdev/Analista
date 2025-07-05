import { createHashRouter, RouterProvider } from "react-router";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "@/assets/tailwind.css";

let router = createHashRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <div>Not Found</div>,
  },
]);
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
