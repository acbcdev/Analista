import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatMenuItem } from "@/lib/formata";
import type { TipMenuItem } from "@/store/tipMenu";
import type { emojiPosition, textCase } from "@/types";

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
}

export function MenuItemDisplay({
	item,
	index,
	globalSettings,
	onCopyToClipboard,
	onRemoveItem,
}: MenuItemDisplayProps) {
	const handleCopyText = () => {
		const formattedText = formatMenuItem(item, globalSettings);
		onCopyToClipboard(formattedText, "text");
	};

	const handleCopyPrice = () => {
		onCopyToClipboard(item.price.toString(), "price");
	};

	return (
		<div className="flex items-center justify-between p-3 border rounded-lg">
			<div className="flex items-center justify-between flex-1 gap-3">
				<div>
					<span className="text-sm font-medium text-muted-foreground">
						{index + 1}.
					</span>

					<button
						type="button"
						className="font-medium px-2 py-1 space-x-1 border-none bg-transparent"
						onClick={handleCopyText}
						title="Click to copy text"
					>
						{formatMenuItem(item, globalSettings)}
					</button>
				</div>

				<button
					type="button"
					className="text-green-500 font-bold px-2 py-1 border-none bg-transparent"
					onClick={handleCopyPrice}
					title="Click to copy price"
				>
					{item.price} tokens
				</button>
			</div>

			<Button
				variant="ghost"
				size="icon"
				onClick={onRemoveItem}
				className="dark:hover:bg-destructive-foreground dark:hover:border-destructive-foreground"
			>
				<X className="h-4 w-4" />
			</Button>
		</div>
	);
}
