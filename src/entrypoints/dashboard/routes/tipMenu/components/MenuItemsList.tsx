import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TipMenuItem } from "@/store/tipMenu";
import { MenuItemDisplay } from "./MenuItemDisplay";

interface MenuItemsListProps {
	items: TipMenuItem[];
	globalSettings: {
		textFormat: "none" | "capitalize" | "capitalizeWords";
		emoji: string;
		emojiPosition: "start" | "end" | "none";
	};
	formatText: (
		text: string,
		format: "none" | "capitalize" | "capitalizeWords",
	) => string;
	onCopyToClipboard: (text: string, type: "text" | "price") => void;
	onRemoveItem: (index: number) => void;
}

export function MenuItemsList({
	items,
	globalSettings,
	formatText,
	onCopyToClipboard,
	onRemoveItem,
}: MenuItemsListProps) {
	if (items.length === 0) {
		return null;
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Menu Items ({items.length})</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-2">
					{items.map((item, index) => (
						<MenuItemDisplay
							key={item.id}
							item={item}
							index={index}
							globalSettings={globalSettings}
							formatText={formatText}
							onCopyToClipboard={onCopyToClipboard}
							onRemoveItem={() => onRemoveItem(index)}
						/>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
