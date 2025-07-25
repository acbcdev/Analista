"use client";

import { useState } from "react";
import { type TipMenu, useStoreTipMenu } from "@/store/tipMenu";
import Layout from "../../components/layout/layout";
import { DashboardHeader } from "./components/DashboardHeader";
import { MenusList } from "./components/MenusList";
import { SearchFilter } from "./components/SearchFilter";
import { StatsCards } from "./components/StatsCards";

export default function TipMenuPage() {
	const tipMenus = useStoreTipMenu((state) => state.tipMenus);
	const removeTipMenu = useStoreTipMenu((state) => state.removeTipMenu);
	const updateTipMenu = useStoreTipMenu((state) => state.updateTipMenu);
	const addTipMenu = useStoreTipMenu((state) => state.addTipMenu);
	const [searchTerm, setSearchTerm] = useState("");

	const filteredMenus = tipMenus.filter(
		(menu) =>
			menu.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			menu.description.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	const deleteMenu = (id: string) => {
		removeTipMenu(id);
	};

	const toggleMenuStatus = (id: string) => {
		const menu = tipMenus.find((m) => m.id === id);
		if (menu) {
			updateTipMenu(id, { isActive: !menu.isActive });
		}
	};

	const duplicateMenu = (id: string) => {
		const menuToDuplicate = tipMenus.find((menu) => menu.id === id);
		if (menuToDuplicate) {
			const newMenu: TipMenu = {
				...menuToDuplicate,
				id: Date.now().toString(),
				name: `${menuToDuplicate.name} (Copy)`,
				createdAt: Date.now(),
				updatedAt: Date.now(),
				isActive: false,
			};
			addTipMenu(newMenu);
		}
	};

	return (
		<Layout>
			<div className="container mx-auto p-6 max-w-6xl">
				<div className="space-y-6">
					<DashboardHeader />

					<SearchFilter
						searchTerm={searchTerm}
						onSearchChange={setSearchTerm}
					/>

					<StatsCards tipMenus={tipMenus} />

					<MenusList
						filteredMenus={filteredMenus}
						searchTerm={searchTerm}
						onDuplicate={duplicateMenu}
						onToggleStatus={toggleMenuStatus}
						onDelete={deleteMenu}
					/>
				</div>
			</div>
		</Layout>
	);
}
