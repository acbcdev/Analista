"use client";

import { is } from "date-fns/locale";
import { ArrowLeft, Plus, Save, Settings, Trash2, X } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { EmojiPopover } from "@/components/EmojiPopover";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
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
	if (format === "none") return text;
	if (format === "capitalize") {
		return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
	}
	if (format === "capitalizeWords") {
		return text
			.split(" ")
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
			.join(" ");
	}
	return text;
};

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

export function CreateTipMenu() {
	const navigate = useNavigate();
	const { addTipMenu } = useStoreTipMenu();

	// Menu information state
	const [menuName, setMenuName] = useState("");
	const [menuDescription, setMenuDescription] = useState("");

	// Global settings state
	const [globalSettings, setGlobalSettings] = useState({
		textFormat: "capitalizeWords" as "none" | "capitalize" | "capitalizeWords",
		emoji: "⭐",
		emojiPosition: "end" as "start" | "end" | "none",
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
					{/* Header */}
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<Link to="/tipMenu">
								<Button variant="outline" size="icon" asChild>
									<ArrowLeft className="p-1" />
								</Button>
							</Link>
							<div>
								<h1 className="text-3xl font-bold">Create Tip Menu</h1>
								<p className="text-muted-foreground">
									Create and configure your new tip menu
								</p>
							</div>
						</div>
						<Button
							onClick={saveTipMenu}
							className="bg-green-600 hover:bg-green-700"
							disabled={!menuName.trim() || items.length === 0}
						>
							<Save className="h-4 w-4 mr-2" />
							Save Menu
						</Button>
					</div>

					{/* Menu Information */}
					<Card>
						<CardHeader>
							<CardTitle>Menu Information</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="menuName">Menu Name *</Label>
									<Input
										id="menuName"
										value={menuName}
										onChange={(e) => setMenuName(e.target.value)}
										placeholder="Enter menu name..."
										required
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="menuDescription">Description</Label>
									<Textarea
										id="menuDescription"
										value={menuDescription}
										onChange={(e) => setMenuDescription(e.target.value)}
										placeholder="Optional description..."
										className="min-h-[80px]"
									/>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Global Settings */}

					<Card>
						<CardHeader>
							<div className="flex items-center justify-between">
								<CardTitle className="flex items-center  gap-2">
									<Plus className="h-5 w-5" />
									Add Menu Item
								</CardTitle>
								<Popover>
									<PopoverTrigger asChild>
										<Button variant="ghost" size="icon">
											<Settings />
										</Button>
									</PopoverTrigger>
									<PopoverContent className="w-80" side="bottom">
										<div className="space-y-4">
											<div className="space-y-2">
												<Label className="font-semibold">Text Format</Label>
												<Select
													value={globalSettings.textFormat}
													onValueChange={(
														value: "none" | "capitalize" | "capitalizeWords",
													) =>
														setGlobalSettings({
															...globalSettings,
															textFormat: value,
														})
													}
												>
													<SelectTrigger>
														<SelectValue placeholder="Select format" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="none">None</SelectItem>
														<SelectItem value="capitalize">
															Capitalize First Letter
														</SelectItem>
														<SelectItem value="capitalizeWords">
															Title Case
														</SelectItem>
													</SelectContent>
												</Select>
											</div>

											<div className="space-y-2">
												<Label className="font-semibold">Global Emoji</Label>
												<EmojiPopover
													currentEmoji={globalSettings.emoji}
													onEmojiSelect={(emoji) =>
														setGlobalSettings({
															...globalSettings,
															emoji: emoji,
														})
													}
													placeholder="Search emojis..."
													className="w-full"
												/>
											</div>

											<div className="space-y-2">
												<Label className="font-semibold">Emoji Position</Label>
												<Select
													value={globalSettings.emojiPosition}
													onValueChange={(value: "start" | "end" | "none") =>
														setGlobalSettings({
															...globalSettings,
															emojiPosition: value,
														})
													}
												>
													<SelectTrigger>
														<SelectValue placeholder="Select position" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="start">
															Start (Before Text)
														</SelectItem>
														<SelectItem value="end">
															End (After Text)
														</SelectItem>
														<SelectItem value="none">
															None (No Emoji)
														</SelectItem>
													</SelectContent>
												</Select>
											</div>
										</div>
									</PopoverContent>
								</Popover>
							</div>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<div className="space-y-2 md:col-span-2">
									<Label htmlFor="text">Item Text</Label>
									<Input
										id="text"
										value={newItem.text}
										onChange={(e) =>
											setNewItem({ ...newItem, text: e.target.value })
										}
										onKeyDown={handleKeyPress}
										placeholder="Enter item text..."
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="price">Price (tokens)</Label>
									<Input
										id="price"
										type="number"
										value={newItem.price || ""}
										onChange={(e) =>
											setNewItem({
												...newItem,
												price: Number(e.target.value) || 0,
											})
										}
										min={0}
										onKeyDown={handleKeyPress}
										placeholder="0"
									/>
								</div>
							</div>
							<Button onClick={addItem} className="w-full">
								<Plus className="h-4 w-4 mr-2" />
								Add Item
							</Button>
						</CardContent>
					</Card>
					{/* Current Items */}
					{items.length > 0 && (
						<Card>
							<CardHeader>
								<CardTitle>Menu Items ({items.length})</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-2">
									{items.map((item, index) => {
										const formattedText =
											item.settings.textFormat === "global"
												? formatText(item.text, globalSettings.textFormat)
												: formatText(item.text, item.settings.textFormat);

										const emoji =
											item.settings.textFormat === "global"
												? globalSettings.emoji
												: item.settings.useGlobalEmoji
													? globalSettings.emoji
													: item.settings.emoji;
										const isEnd =
											item.settings.textFormat === "global"
												? globalSettings.emojiPosition === "end"
												: item.settings.emojiPosition === "end";
										const isStart =
											item.settings.textFormat === "global"
												? globalSettings.emojiPosition === "start"
												: item.settings.emojiPosition === "start";
										return (
											<div
												key={item.id}
												className="flex items-center justify-between p-3 border rounded-lg"
											>
												<div className="flex items-center justify-between flex-1 gap-3">
													<div>
														<span className="text-sm font-medium text-muted-foreground">
															{index + 1}.
														</span>

														<button
															type="button"
															className="font-medium px-2 py-1 space-x-1 border-none bg-transparent"
															onClick={() => {
																const text = `${isStart ? `${emoji} ` : ""}${formattedText}${isEnd ? ` ${emoji}` : ""}`;
																copyToClipboard(text, "text");
															}}
															title="Click to copy text"
														>
															{isStart && (
																<span className="text-lg">{emoji} </span>
															)}
															{/* Texto formateado */}
															{formattedText}

															{/* Emoji al final si la posición es "end" */}
															{isEnd && (
																<span className="text-lg"> {emoji}</span>
															)}
														</button>
													</div>

													<button
														type="button"
														className="text-green-500 font-bold px-2 py-1 border-none bg-transparent"
														onClick={() =>
															copyToClipboard(item.price.toString(), "price")
														}
														title="Click to copy price"
													>
														{item.price} tokens
													</button>
												</div>

												<Button
													variant="ghost"
													size="icon"
													onClick={() =>
														setItems(items.filter((_, i) => i !== index))
													}
													className="dark:hover:bg-destructive-foreground  dark:hover:border-destructive-foreground"
												>
													<X className="h-4 w-4" />
												</Button>
											</div>
										);
									})}
								</div>
							</CardContent>
						</Card>
					)}

					{/* Add New Item */}
				</div>
			</div>
		</Layout>
	);
}
