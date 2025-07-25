import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "@/assets/tailwind.css";
import { Toaster } from "@/components/ui/sonner";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<App />
		<Toaster />
	</React.StrictMode>,
);
