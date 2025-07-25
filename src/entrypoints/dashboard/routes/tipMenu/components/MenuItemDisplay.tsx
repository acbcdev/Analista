import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TipMenuItem } from "@/store/tipMenu";

interface MenuItemDisplayProps {
	item: TipMenuItem;
	index: number;
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
	onRemoveItem: () => void;
}

export function MenuItemDisplay({
	item,
	index,
	globalSettings,
	formatText,
	onCopyToClipboard,
	onRemoveItem,
}: MenuItemDisplayProps) {
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

	const handleCopyText = () => {
		const text = `${isStart ? `${emoji} ` : ""}${formattedText}${isEnd ? ` ${emoji}` : ""}`;
		onCopyToClipboard(text, "text");
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
						{isStart && <span className="text-lg">{emoji} </span>}
						{formattedText}
						{isEnd && <span className="text-lg"> {emoji}</span>}
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
