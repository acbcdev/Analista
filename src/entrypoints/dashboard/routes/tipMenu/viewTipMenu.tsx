"use client";

import { ArrowLeft, Copy, Edit } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	type TipMenu,
	type TipMenuItem,
	useStoreTipMenu,
} from "@/store/tipMenu";
import { formatMenuItem } from "../../../../lib/formater";
import Layout from "../../components/layout/layout";

export function ViewTipMenu() {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const { tipMenus } = useStoreTipMenu();

	// Loading state
	const [isLoading, setIsLoading] = useState(true);
	const [menu, setMenu] = useState<TipMenu | null>(null);

	// Load menu data on component mount
	useEffect(() => {
		if (!id) {
			navigate("/tipMenu");
			return;
		}

		const foundMenu = tipMenus.find((m) => m.id === id);
		if (!foundMenu) {
			setIsLoading(false);
			return;
		}

		setMenu(foundMenu);
		setIsLoading(false);
	}, [id, tipMenus, navigate]);

	const copyMenuToClipboard = async () => {
		if (!menu) return;

		try {
			const menuText = menu.items
				.map((item: TipMenuItem, index: number) => {
					const displayText = formatMenuItem(item, menu.globalSettings);
					return `${index + 1}. ${displayText} - ${item.price} tokens`;
				})
				.join("\n");

			const fullMenuText = `${menu.name}\n${
				menu.description ? `${menu.description}\n` : ""
			}\n${menuText}`;

			await navigator.clipboard.writeText(fullMenuText);
			toast.success("Complete menu copied to clipboard!");
		} catch {
			toast.error("Failed to copy menu to clipboard");
		}
	};

	const copyItemToClipboard = async (item: TipMenuItem) => {
		if (!menu) return;

		try {
			const displayText = formatMenuItem(item, menu.globalSettings);
			await navigator.clipboard.writeText(displayText);
			toast.success(`Item copied: "${displayText}"`);
		} catch {
			toast.error("Failed to copy item to clipboard");
		}
	};

	const copyPriceToClipboard = async (price: number) => {
		try {
			await navigator.clipboard.writeText(price.toString());
			toast.success(`Price copied: ${price} tokens`);
		} catch {
			toast.error("Failed to copy price to clipboard");
		}
	};

	if (isLoading) {
		return (
			<Layout>
				<div className="container mx-auto p-6 max-w-4xl">
					<div className="flex items-center justify-center h-64">
						<div className="text-lg">Loading menu...</div>
					</div>
				</div>
			</Layout>
		);
	}

	if (!menu) {
		return (
			<Layout>
				<div className="container mx-auto p-6 max-w-4xl">
					<div className="flex items-center justify-center h-64">
						<div className="text-center">
							<h2 className="text-xl font-semibold mb-2">Menu Not Found</h2>
							<p className="text-muted-foreground mb-4">
								The menu you're looking for doesn't exist.
							</p>
							<Button onClick={() => navigate("/tipMenu")}>
								Go Back to Menus
							</Button>
						</div>
					</div>
				</div>
			</Layout>
		);
	}

	return (
		<Layout>
			<div className="container mx-auto p-6 max-w-4xl">
				<div className="space-y-6">
					{/* Header */}
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<Link to="/tipMenu">
								<Button variant="ghost" size="icon">
									<ArrowLeft className="h-4 w-4" />
								</Button>
							</Link>
							<div>
								<h1 className="text-3xl font-bold">{menu.name}</h1>
								<p className="text-muted-foreground">
									{menu.description || "Tip menu preview"}
								</p>
							</div>
						</div>
						<div className="flex items-center gap-2">
							<Button
								variant="outline"
								onClick={copyMenuToClipboard}
								className="flex items-center gap-2"
							>
								<Copy className="h-4 w-4" />
								Copy Menu
							</Button>
							<Button
								variant="outline"
								onClick={() => navigate(`/tipMenu/edit/${menu.id}`)}
								className="flex items-center gap-2"
							>
								<Edit className="h-4 w-4" />
								Edit Menu
							</Button>
						</div>
					</div>

					{/* Menu Information */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center justify-between">
								Menu Information
								<span
									className={`px-3 py-1 text-sm rounded-full ${
										menu.isActive
											? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
											: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
									}`}
								>
									{menu.isActive ? "Active" : "Inactive"}
								</span>
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<p className="text-sm font-medium text-muted-foreground">
										Total Items
									</p>
									<p className="text-2xl font-bold">{menu.items.length}</p>
								</div>
								<div>
									<p className="text-sm font-medium text-muted-foreground">
										Created
									</p>
									<p className="text-lg">
										{new Date(menu.createdAt).toLocaleDateString()}
									</p>
								</div>
								<div>
									<p className="text-sm font-medium text-muted-foreground">
										Last Updated
									</p>
									<p className="text-lg">
										{new Date(menu.updatedAt).toLocaleDateString()}
									</p>
								</div>
								<div>
									<p className="text-sm font-medium text-muted-foreground">
										Average Price
									</p>
									<p className="text-2xl font-bold">
										{menu.items.length > 0
											? Math.round(
													menu.items.reduce(
														(sum, item) => sum + item.price,
														0,
													) / menu.items.length,
												)
											: 0}{" "}
										tokens
									</p>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Global Settings */}
					<Card>
						<CardHeader>
							<CardTitle>Global Settings</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<div>
									<p className="text-sm font-medium text-muted-foreground">
										Text Format
									</p>
									<p className="text-lg capitalize">
										{menu.globalSettings.textFormat.replace(/([A-Z])/g, " $1")}
									</p>
								</div>
								<div>
									<p className="text-sm font-medium text-muted-foreground">
										Emoji
									</p>
									<p className="text-2xl">{menu.globalSettings.emoji}</p>
								</div>
								<div>
									<p className="text-sm font-medium text-muted-foreground">
										Emoji Position
									</p>
									<p className="text-lg capitalize">
										{menu.globalSettings.emojiPosition}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Menu Items */}
					<Card>
						<CardHeader>
							<CardTitle>Menu Items ({menu.items.length})</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-3">
								{menu.items.map((item, index) => (
									<div
										key={item.id}
										className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
									>
										<div className="flex items-center gap-3">
											<span className="text-sm font-medium text-muted-foreground bg-muted px-2 py-1 rounded">
												{index + 1}
											</span>
											<button
												type="button"
												onClick={() => copyItemToClipboard(item)}
												className="text-left font-medium hover:text-primary transition-colors cursor-pointer"
												title="Click to copy text"
											>
												{formatMenuItem(item, menu.globalSettings)}
											</button>
										</div>
										<button
											type="button"
											onClick={() => copyPriceToClipboard(item.price)}
											className="text-green-600 font-bold px-3 py-1 rounded hover:bg-green-50 transition-colors cursor-pointer"
											title="Click to copy price"
										>
											{item.price} tokens
										</button>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</Layout>
	);
}
