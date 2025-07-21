import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router";
import "@/assets/tailwind.css";
import { NuqsAdapter } from "nuqs/adapters/react-router/v7";
import { router } from "./routes.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<NuqsAdapter>
			<RouterProvider router={router} />
		</NuqsAdapter>
	</React.StrictMode>,
);
