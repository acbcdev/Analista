"use client";

import { Button } from "@/components/ui/button";
import {
	EmojiPicker,
	EmojiPickerContent,
	EmojiPickerFooter,
	EmojiPickerSearch,
} from "@/components/ui/emoji-picker";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

interface EmojiPopoverProps {
	currentEmoji?: string;
	onEmojiSelect: (emoji: string) => void;
	trigger?: React.ReactNode;
	placeholder?: string;
	side?: "top" | "right" | "bottom" | "left";
	className?: string;
}

export function EmojiPopover({
	currentEmoji = "😀",
	onEmojiSelect,
	trigger,
	placeholder = "Search emojis...",
	side = "bottom",
	className = "",
}: EmojiPopoverProps) {
	const defaultTrigger = (
		<Button variant="outline" className={className}>
			{currentEmoji}
		</Button>
	);

	return (
		<Popover>
			<PopoverTrigger asChild>{trigger || defaultTrigger}</PopoverTrigger>
			<PopoverContent className="h-96 px-2" side={side}>
				<EmojiPicker onEmojiSelect={(emoji) => onEmojiSelect(emoji.emoji)}>
					<EmojiPickerSearch placeholder={placeholder} />
					<EmojiPickerContent />
					<EmojiPickerFooter />
				</EmojiPicker>
			</PopoverContent>
		</Popover>
	);
}
