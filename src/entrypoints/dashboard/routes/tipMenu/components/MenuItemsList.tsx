import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TipMenuItem } from "@/store/tipMenu";
import type { emojiPosition, textCase } from "@/types";
import { MenuItemDisplay } from "./MenuItemDisplay";

interface MenuItemsListProps {
	items: TipMenuItem[];
	globalSettings: {
		textFormat: textCase;
		emoji: string;
		emojiPosition: emojiPosition;
	};
	onCopyToClipboard: (text: string, type: "text" | "price") => void;
	onRemoveItem: (index: number) => void;
}

export function MenuItemsList({
	items,
	globalSettings,
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
							onCopyToClipboard={onCopyToClipboard}
							onRemoveItem={() => onRemoveItem(index)}
						/>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
