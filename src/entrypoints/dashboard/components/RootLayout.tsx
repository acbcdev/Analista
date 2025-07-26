import { Outlet } from "react-router";
import Layout from "./layout/layout";

export function RootLayout() {
	return (
		<Layout>
			<Outlet />
		</Layout>
	);
}
