"use client";

import { Copy, Edit, Eye, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import {
	type TipMenu,
	type TipMenuItem,
	useStoreTipMenu,
} from "@/store/tipMenu";
import Layout from "../../components/layout/layout";

const formatText = (
	text: string,
	format: "none" | "capitalize" | "capitalizeWords",
): string => {
	switch (format) {
		case "capitalize":
			return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
		case "capitalizeWords":
			return text
				.split(" ")
				.map(
					(word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
				)
				.join(" ");
		default:
			return text;
	}
};

const formatMenuItem = (
	item: TipMenuItem,
	globalSettings: TipMenu["globalSettings"],
): string => {
	const textFormat =
		item.settings.textFormat === "global"
			? globalSettings.textFormat
			: item.settings.textFormat;

	const emoji = item.settings.useGlobalEmoji
		? globalSettings.emoji
		: item.settings.emoji;

	const emojiPosition = item.settings.useGlobalEmoji
		? globalSettings.emojiPosition
		: item.settings.emojiPosition;

	const formattedText = formatText(item.text, textFormat);

	if (emojiPosition === "start" && emoji) {
		return `${emoji} ${formattedText}`;
	} else if (emojiPosition === "end" && emoji) {
		return `${formattedText} ${emoji}`;
	}

	return formattedText;
};

export default function TipMenuPage() {
	const { tipMenus, removeTipMenu, updateTipMenu, addTipMenu } =
		useStoreTipMenu();
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
					{/* Header */}
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
						<div>
							<h1 className="text-3xl font-bold">Tip Menu Manager</h1>
							<p className="text-muted-foreground">
								Manage all your tip menus in one place
							</p>
						</div>
						<Button asChild className="w-fit">
							<Link to="/tipMenu/create">
								<Plus className="h-4 w-4 mr-2" />
								Create New Menu
							</Link>
						</Button>
					</div>

					{/* Search and filters */}
					<Card>
						<CardContent className="pt-6">
							<div className="flex flex-col sm:flex-row gap-4">
								<div className="flex-1 space-y-1">
									<Label htmlFor="search">Search menus</Label>
									<Input
										id="search"
										placeholder="Search by name or description..."
										value={searchTerm}
										onChange={(e) => setSearchTerm(e.target.value)}
									/>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Stats */}
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
						<Card>
							<CardContent className="pt-6">
								<div className="text-center">
									<div className="text-2xl font-bold text-primary">
										{tipMenus.length}
									</div>
									<div className="text-sm text-muted-foreground">
										Total Menus
									</div>
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardContent className="pt-6">
								<div className="text-center">
									<div className="text-2xl font-bold text-green-600">
										{tipMenus.filter((menu) => menu.isActive).length}
									</div>
									<div className="text-sm text-muted-foreground">
										Active Menus
									</div>
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardContent className="pt-6">
								<div className="text-center">
									<div className="text-2xl font-bold text-blue-600">
										{tipMenus.reduce(
											(total, menu) => total + menu.items.length,
											0,
										)}
									</div>
									<div className="text-sm text-muted-foreground">
										Total Items
									</div>
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardContent className="pt-6">
								<div className="text-center">
									<div className="text-2xl font-bold text-purple-600">
										{tipMenus.length > 0
											? Math.round(
													tipMenus.reduce(
														(total, menu) =>
															total +
															menu.items.reduce(
																(sum, item) => sum + item.price,
																0,
															),
														0,
													) /
														tipMenus.reduce(
															(total, menu) => total + menu.items.length,
															0,
														),
												)
											: 0}
									</div>
									<div className="text-sm text-muted-foreground">Avg Price</div>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Menus List */}
					<div className="space-y-4">
						{filteredMenus.length === 0 ? (
							<Card>
								<CardContent className="pt-6">
									<div className="text-center py-8 text-muted-foreground">
										{searchTerm
											? "No menus found matching your search."
											: "No tip menus created yet. Create your first menu!"}
									</div>
								</CardContent>
							</Card>
						) : (
							filteredMenus.map((menu) => (
								<Card key={menu.id} className="overflow-hidden">
									<CardHeader>
										<div className="flex items-start justify-between">
											<div className="space-y-2">
												<div className="flex items-center gap-2">
													<CardTitle className="text-xl">{menu.name}</CardTitle>
													<span
														className={`px-2 py-1 text-xs rounded-full ${
															menu.isActive
																? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
																: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
														}`}
													>
														{menu.isActive ? "Active" : "Inactive"}
													</span>
												</div>
												<p className="text-muted-foreground">
													{menu.description}
												</p>
												<div className="flex items-center gap-4 text-sm text-muted-foreground">
													<span>{menu.items.length} items</span>
													<span>•</span>
													<span>
														Created{" "}
														{new Date(menu.createdAt).toLocaleDateString()}
													</span>
													<span>•</span>
													<span>
														Updated{" "}
														{new Date(menu.updatedAt).toLocaleDateString()}
													</span>
												</div>
											</div>
											<div className="flex items-center gap-2">
												{/* View Menu Popover */}
												<Popover>
													<PopoverTrigger asChild>
														<Button variant="outline" size="sm">
															<Eye className="h-4 w-4" />
														</Button>
													</PopoverTrigger>
													<PopoverContent className="w-80" align="end">
														<div className="space-y-4">
															<div>
																<h4 className="font-medium mb-2">
																	Menu Preview
																</h4>
																<p className="text-sm text-muted-foreground mb-3">
																	{menu.description}
																</p>
															</div>
															<Separator />
															<div className="space-y-2">
																{menu.items.slice(0, 5).map((item) => (
																	<div
																		key={item.id}
																		className="flex items-center justify-between p-2 bg-muted rounded text-sm"
																	>
																		<span>
																			{formatMenuItem(
																				item,
																				menu.globalSettings,
																			)}
																		</span>
																		<span className="font-medium">
																			{item.price} tokens
																		</span>
																	</div>
																))}
																{menu.items.length > 5 && (
																	<div className="text-center text-sm text-muted-foreground">
																		+{menu.items.length - 5} more items
																	</div>
																)}
															</div>
														</div>
													</PopoverContent>
												</Popover>

												{/* Edit Button */}
												<Button variant="outline" size="sm" asChild>
													<a href={`/dashboard/tipMenu/edit/${menu.id}`}>
														<Edit className="h-4 w-4" />
													</a>
												</Button>

												{/* Copy Button */}
												<Button
													variant="outline"
													size="sm"
													onClick={() => duplicateMenu(menu.id)}
												>
													<Copy className="h-4 w-4" />
												</Button>

												{/* Toggle Status */}
												<Button
													variant="outline"
													size="sm"
													onClick={() => toggleMenuStatus(menu.id)}
													className={
														menu.isActive
															? "border-orange-500 text-orange-600 hover:bg-orange-50"
															: "border-green-500 text-green-600 hover:bg-green-50"
													}
												>
													{menu.isActive ? "Deactivate" : "Activate"}
												</Button>

												{/* Delete Button */}
												<Button
													variant="outline"
													size="sm"
													onClick={() => deleteMenu(menu.id)}
													className="border-red-500 text-red-600 hover:bg-red-50"
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											</div>
										</div>
									</CardHeader>
								</Card>
							))
						)}
					</div>
				</div>
			</div>
		</Layout>
	);
}
