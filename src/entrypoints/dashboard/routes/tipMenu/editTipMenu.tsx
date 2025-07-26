import { ArrowLeft, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	type TipMenu,
	type TipMenuItem,
	useStoreTipMenu,
} from "@/store/tipMenu";
import type { emojiPosition, textCase } from "@/types";
import Layout from "../../components/layout/layout";
import { AddMenuItem } from "./components/AddMenuItem";
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

export function EditTipMenu() {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const { tipMenus, updateTipMenu } = useStoreTipMenu();

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
		textFormat: "global" as textCase,
	});

	// Loading state
	const [isLoading, setIsLoading] = useState(true);
	const [menuNotFound, setMenuNotFound] = useState(false);

	// Load menu data on component mount
	useEffect(() => {
		if (!id) {
			navigate("/tipMenu");
			return;
		}

		const menu = tipMenus.find((m) => m.id === id);
		if (!menu) {
			setMenuNotFound(true);
			setIsLoading(false);
			return;
		}

		// Load menu data
		setMenuName(menu.name);
		setMenuDescription(menu.description);
		setGlobalSettings(menu.globalSettings);
		setItems(menu.items);
		setIsLoading(false);
	}, [id, tipMenus, navigate]);

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

	const updateTipMenuData = () => {
		if (!id || !menuName.trim() || items.length === 0) {
			toast.error("Please provide a menu name and at least one menu item");
			return;
		}

		const updatedMenu: TipMenu = {
			id: id,
			name: menuName,
			description: menuDescription,
			items: items,
			globalSettings: globalSettings,
			isActive: true,
			createdAt: tipMenus.find((m) => m.id === id)?.createdAt || Date.now(),
			updatedAt: Date.now(),
		};

		updateTipMenu(id, updatedMenu);
		toast.success("Menu updated successfully!");
		navigate("/tipMenu");
	};

	if (isLoading) {
		return (
			<div className="container mx-auto p-6 max-w-4xl">
				<div className="flex items-center justify-center h-64">
					<div className="text-lg">Loading menu...</div>
				</div>
			</div>
		);
	}

	if (menuNotFound) {
		return (
			<div className="container mx-auto p-6 max-w-4xl">
				<div className="flex items-center justify-center h-64">
					<div className="text-center">
						<h2 className="text-xl font-semibold mb-2">Menu Not Found</h2>
						<p className="text-muted-foreground mb-4">
							The menu you're looking for doesn't exist.
						</p>
						<button
							type="button"
							onClick={() => navigate("/tipMenu")}
							className="bg-primary text-primary-foreground px-4 py-2 rounded-md"
						>
							Go Back to Menus
						</button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto p-6 max-w-4xl">
			<div className="space-y-6">
				{/* Header */}
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-4">
						<Link to="/tipMenu">
							<Button variant="ghost" size="icon" asChild>
								<ArrowLeft className="p-1" />
							</Button>
						</Link>
						<div>
							<h1 className="text-3xl font-bold">Edit Tip Menu</h1>
							<p className="text-muted-foreground">
								Modify your existing tip menu configuration
							</p>
						</div>
					</div>
					<Button
						onClick={updateTipMenuData}
						className="bg-blue-600 hover:bg-blue-700"
						disabled={!menuName.trim() || items.length === 0}
					>
						<Save className="h-4 w-4 mr-2" />
						Update Menu
					</Button>
				</div>

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
	);
}
