import { Plus } from "lucide-react";
import { NumberInput } from "@/components/NumberInput";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GlobalSettingsPopover } from "./GlobalSettingsPopover";

interface AddMenuItemProps {
	newItem: {
		text: string;
		price: number;
		textFormat: "none" | "capitalize" | "capitalizeWords" | "global";
	};
	globalSettings: {
		textFormat: "none" | "capitalize" | "capitalizeWords";
		emoji: string;
		emojiPosition: "start" | "end" | "none";
	};
	onNewItemChange: (item: {
		text: string;
		price: number;
		textFormat: "none" | "capitalize" | "capitalizeWords" | "global";
	}) => void;
	onGlobalSettingsChange: (settings: {
		textFormat: "none" | "capitalize" | "capitalizeWords";
		emoji: string;
		emojiPosition: "start" | "end" | "none";
	}) => void;
	onAddItem: () => void;
	onKeyPress: (e: React.KeyboardEvent) => void;
}

export function AddMenuItem({
	newItem,
	globalSettings,
	onNewItemChange,
	onGlobalSettingsChange,
	onAddItem,
	onKeyPress,
}: AddMenuItemProps) {
	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle className="flex items-center gap-2">
						<Plus className="h-5 w-5" />
						Add Menu Item
					</CardTitle>
					<GlobalSettingsPopover
						globalSettings={globalSettings}
						onGlobalSettingsChange={onGlobalSettingsChange}
					/>
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
								onNewItemChange({ ...newItem, text: e.target.value })
							}
							onKeyDown={onKeyPress}
							placeholder="Enter item text..."
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="price">Price (tokens)</Label>
						<NumberInput
							id="price"
							value={newItem.price === 0 ? undefined : newItem.price}
							onChange={(num) =>
								onNewItemChange({
									...newItem,
									price: typeof num === "number" ? num : Number(num),
								})
							}
							minValue={0}
							onKeyDown={onKeyPress}
						/>
					</div>
				</div>
				<Button onClick={onAddItem} className="w-full">
					<Plus className="h-4 w-4 mr-2" />
					Add Item
				</Button>
			</CardContent>
		</Card>
	);
}
