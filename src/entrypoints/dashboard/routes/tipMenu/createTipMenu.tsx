"use client";

import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import {
	type TipMenu,
	type TipMenuItem,
	useStoreTipMenu,
} from "@/store/tipMenu";
import type { emojiPosition, textCase } from "@/types";
import Layout from "../../components/layout/layout";
import { AddMenuItem } from "./components/AddMenuItem";
import { CreateMenuHeader } from "./components/CreateMenuHeader";
import { MenuInformation } from "./components/MenuInformation";
import { MenuItemsList } from "./components/MenuItemsList";

// Función para copiar texto al clipboard
const copyToClipboard = async (text: string, type: "text" | "price") => {
	try {
		await navigator.clipboard.writeText(text);
		toast.success(
			type === "text"
				? `Text copied: "${text}"`
				: `Price copied: ${text} tokens`,
		);
	} catch {
		toast.error("Failed to copy to clipboard");
	}
};

type GlobalSettings = {
	textFormat: textCase;
	emoji: string;
	emojiPosition: emojiPosition;
};

export function CreateTipMenu() {
	const navigate = useNavigate();
	const { addTipMenu } = useStoreTipMenu();

	// Menu information state
	const [menuName, setMenuName] = useState("");
	const [menuDescription, setMenuDescription] = useState("");

	// Global settings state
	const [globalSettings, setGlobalSettings] = useState<GlobalSettings>({
		textFormat: "capitalizeWords",
		emoji: "⭐",
		emojiPosition: "end",
	});

	// Individual item state
	const [items, setItems] = useState<TipMenuItem[]>([]);
	const [newItem, setNewItem] = useState({
		text: "",
		price: 0,
		textFormat: "global" as
			| "none"
			| "capitalize"
			| "capitalizeWords"
			| "global",
	});

	const addItem = () => {
		if (newItem.text.trim() && newItem.price > 0) {
			const item: TipMenuItem = {
				id: Date.now().toString(),
				text: newItem.text.trim(),
				price: newItem.price,
				settings: {
					textFormat: newItem.textFormat,
					// Solo guardamos configuraciones específicas si no es "global"
					...(newItem.textFormat !== "global" && {
						emoji: "",
						emojiPosition: "start",
						useGlobalEmoji: false,
					}),
				},
			};
			// Añadir el item y ordenar por precio de mayor a menor
			const updatedItems = [...items, item].sort((a, b) => a.price - b.price);
			setItems(updatedItems);
			setNewItem({ text: "", price: 0, textFormat: "global" });
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			e.preventDefault();
			addItem();
		}
	};

	const removeItem = (index: number) => {
		setItems(items.filter((_, i) => i !== index));
	};

	const saveTipMenu = () => {
		if (!menuName.trim() || items.length === 0) {
			alert("Please provide a menu name and at least one menu item");
			return;
		}

		const tipMenu: TipMenu = {
			id: Date.now().toString(),
			name: menuName,
			description: menuDescription,
			items: items,
			globalSettings: globalSettings,
			isActive: true,
			createdAt: Date.now(),
			updatedAt: Date.now(),
		};

		addTipMenu(tipMenu);
		navigate("/tipMenu");
	};

	return (
		<Layout>
			<div className="container mx-auto p-6 max-w-4xl">
				<div className="space-y-6">
					<CreateMenuHeader
						menuName={menuName}
						hasItems={items.length > 0}
						onSave={saveTipMenu}
					/>

					<MenuInformation
						menuName={menuName}
						menuDescription={menuDescription}
						onMenuNameChange={setMenuName}
						onMenuDescriptionChange={setMenuDescription}
					/>

					<AddMenuItem
						newItem={newItem}
						globalSettings={globalSettings}
						onNewItemChange={setNewItem}
						onGlobalSettingsChange={setGlobalSettings}
						onAddItem={addItem}
						onKeyPress={handleKeyPress}
					/>

					<MenuItemsList
						items={items}
						globalSettings={globalSettings}
						onCopyToClipboard={copyToClipboard}
						onRemoveItem={removeItem}
					/>
				</div>
			</div>
		</Layout>
	);
}
