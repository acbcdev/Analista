import { X, Edit3, Check, MoreVertical, Settings } from "lucide-react";
import { useState } from "react";
import { EmojiPopover } from "@/components/EmojiPopover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatMenuItem } from "@/lib/formater";
import type { TipMenuItem } from "@/store/tipMenu";
import type { emojiPosition, textCase } from "@/types";
import {NumberInput } from "@/components/NumberInput";
interface MenuItemDisplayProps {
	item: TipMenuItem;
	index: number;
	globalSettings: {
		textFormat: textCase;
		emoji: string;
		emojiPosition: emojiPosition;
	};
	onCopyToClipboard: (text: string, type: "text" | "price") => void;
	onRemoveItem: () => void;
	onUpdateItem: (updatedItem: TipMenuItem) => void;
}

export function MenuItemDisplay({
	item,
	index,
	globalSettings,
	onCopyToClipboard,
	onRemoveItem,
	onUpdateItem,
}: MenuItemDisplayProps) {
	const [isEditingText, setIsEditingText] = useState(false);
	const [isEditingPrice, setIsEditingPrice] = useState(false);
	const [editedText, setEditedText] = useState(item.text);
	const [editedPrice, setEditedPrice] = useState(item.price);
	const [emojiTab, setEmojiTab] = useState<"emoji" | "custom">("emoji");
	const [isConfigOpen, setIsConfigOpen] = useState(false);

	// const handleCopyText = () => {
	// 	const formattedText = formatMenuItem(item, globalSettings);
	// 	onCopyToClipboard(formattedText, "text");
	// };

	const handleCopyPrice = () => {
		onCopyToClipboard(item.price.toString(), "price");
	};

	const handleDoubleClickText = () => {
		setIsEditingText(true);
		setEditedText(item.text);
	};

	const handleDoubleClickPrice = () => {
		setIsEditingPrice(true);
		setEditedPrice(item.price);
	};

	const handleSaveText = () => {
		if (editedText.trim()) {
			onUpdateItem({
				...item,
				text: editedText.trim(),
			});
		}
		setIsEditingText(false);
	};

	const handleSavePrice = () => {
		if (!Number.isNaN(editedPrice) && editedPrice > 0) {
			onUpdateItem({
				...item,
				price: editedPrice,
			});
		}
		setIsEditingPrice(false);
	};

	const handleKeyDown = (e: React.KeyboardEvent, type: 'text' | 'price') => {
		if (e.key === 'Enter') {
			if (type === 'text') {
				handleSaveText();
			} else {
				handleSavePrice();
			}
		} else if (e.key === 'Escape') {
			if (type === 'text') {
				setIsEditingText(false);
				setEditedText(item.text);
			} else {
				setIsEditingPrice(false);
				setEditedPrice(item.price);
			}
		}
	};

	const handleUpdateFormat = (field: keyof TipMenuItem['settings'], value: any) => {
		onUpdateItem({
			...item,
			settings: {
				...item.settings,
				[field]: value,
			},
		});
	};

	return (
		<div className="flex items-center justify-between p-3 border rounded-lg">
			<div className="flex items-center justify-between flex-1 gap-3">
				<div className="flex items-center gap-2 flex-1">
					<span className="text-sm font-medium text-muted-foreground">
						{index + 1}.
					</span>

					{isEditingText ? (
						<div className="flex items-center gap-2 flex-1">
							<Input
								value={editedText}
								onChange={(e) => setEditedText(e.target.value)}
								onKeyDown={(e) => handleKeyDown(e, 'text')}
								onBlur={handleSaveText}
								className="flex-1"
								autoFocus
							/>
							<Button
								variant="ghost"
								size="icon"
								onClick={handleSaveText}
								className="h-8 w-8"
							>
								<Check className="h-4 w-4" />
							</Button>
						</div>
					) : (
						<button
							type="button"
							className="font-medium px-2 py-1 space-x-1 border-none bg-transparent hover:bg-muted rounded flex-1 text-left"
							// onClick={handleCopyText}
							onDoubleClick={handleDoubleClickText}
							title="Click to copy, double-click to edit"
						>
							{formatMenuItem(item, globalSettings)}
						</button>
					)}
				</div>

				{isEditingPrice ? (
					<div className="flex items-center gap-2">
						<NumberInput
							value={editedPrice}
							onChange={setEditedPrice}
							onKeyDown={(e) => handleKeyDown(e, 'price')}
							onBlur={handleSavePrice}
							className="w-20"
							minValue={0}
						/>
						<Button
							variant="ghost"
							size="icon"
							onClick={handleSavePrice}
							className="h-8 w-8"
						>
							<Check className="h-4 w-4" />
						</Button>
					</div>
				) : (
					<button
						type="button"
						className="text-green-500 font-bold px-2 py-1 border-none bg-transparent hover:bg-muted rounded"
						// onClick={handleCopyPrice}
						onDoubleClick={handleDoubleClickPrice}
						title="Click to copy, double-click to edit"
					>
						{item.price} tokens
					</button>
				)}
			</div>

			<div className="flex items-center gap-2 pl-2">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="icon" className="h-8 w-8">
							<MoreVertical className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-56">
						<DropdownMenuItem onClick={() => setIsEditingText(true)}>
							<Edit3 className=" h-4 w-4" />
							Edit text
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => setIsEditingPrice(true)}>
							<Edit3 className=" h-4 w-4" />
							Edit price
						</DropdownMenuItem>
						{/* <DropdownMenuSeparator /> */}
						{/* <Popover open={isConfigOpen} onOpenChange={setIsConfigOpen}>
							<PopoverTrigger asChild>
								<DropdownMenuItem 
									onSelect={(e) => {
										e.preventDefault();
										setIsConfigOpen(true);
									}}
								>
									<Settings className=" h-4 w-4" />
									Format settings
								</DropdownMenuItem>
							</PopoverTrigger>
							<PopoverContent className="w-80" side="top" align="center" sideOffset={8}>
								<div className="space-y-4">
									<div className="space-y-2">
										<Label className="font-semibold">Text Format</Label>
										<Select
											value={item.settings.textFormat}
											onValueChange={(value: textCase) => handleUpdateFormat('textFormat', value)}
										>
											<SelectTrigger>
												<SelectValue placeholder="Select format" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="none">None</SelectItem>
												<SelectItem value="capitalize">Capitalize First Letter</SelectItem>
												<SelectItem value="capitalizeWords">Title Case</SelectItem>
												<SelectItem value="global">Use Global Settings</SelectItem>
											</SelectContent>
										</Select>
									</div>

									<div className="space-y-2">
										<Label className="font-semibold">
											Emoji: {item.settings.emoji || globalSettings.emoji}
										</Label>
										<Tabs
											value={emojiTab}
											onValueChange={(value) => setEmojiTab(value as "emoji" | "custom")}
										>
											<TabsList className="grid w-full grid-cols-2">
												<TabsTrigger value="emoji">Picker</TabsTrigger>
												<TabsTrigger value="custom">Custom</TabsTrigger>
											</TabsList>
											<TabsContent value="emoji" className="mt-2">
												<EmojiPopover
													currentEmoji={item.settings.emoji || globalSettings.emoji}
													onEmojiSelect={(emoji) => handleUpdateFormat('emoji', emoji)}
													placeholder="Search emojis..."
													className="w-full"
												/>
											</TabsContent>
											<TabsContent value="custom" className="mt-2">
												<Input
													value={item.settings.emoji || ''}
													onChange={(e) => handleUpdateFormat('emoji', e.target.value)}
													placeholder="Enter custom emoji..."
													maxLength={8}
												/>
											</TabsContent>
										</Tabs>
									</div>

									<div className="space-y-2">
										<Label className="font-semibold">Emoji Position</Label>
										<Select
											value={item.settings.emojiPosition || 'none'}
											onValueChange={(value: emojiPosition) => handleUpdateFormat('emojiPosition', value)}
										>
											<SelectTrigger>
												<SelectValue placeholder="Select position" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="start">Start (Before Text)</SelectItem>
												<SelectItem value="end">End (After Text)</SelectItem>
												<SelectItem value="none">None (No Emoji)</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</div>
							</PopoverContent>
						</Popover> */}

						<DropdownMenuSeparator />
						<DropdownMenuItem 
							onClick={onRemoveItem}
							className="text-destructive-foreground  focus:text-destructive-foreground focus:bg-destructive/30"
						>
							<X className="h-4 w-4 text-destructive-foreground" />
							Remove item
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	);
}
