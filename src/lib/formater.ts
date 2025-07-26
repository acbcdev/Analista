import { FIXED_NUMBER } from "@/const";
import type { TipMenu, TipMenuItem } from "@/store/tipMenu";

export const formatText = (
	text: string,
	format: TipMenu["globalSettings"]["textFormat"],
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

export const formatMenuItem = (
	item: TipMenuItem,
	globalSettings: TipMenu["globalSettings"],
): string => {
	const textFormat =
		item.settings.textFormat === "global"
			? globalSettings.textFormat
			: item.settings.textFormat;

	const emoji =
		item.settings.textFormat === "global"
			? globalSettings.emoji
			: item.settings.useGlobalEmoji
				? globalSettings.emoji
				: item.settings.emoji;

	const emojiPosition =
		item.settings.textFormat === "global"
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

export const formatHours = (total: number): string => {
	if (total === 0) return "";
	return total.toFixed(FIXED_NUMBER);
};

export const formatPercentage = (value: number): number => {
	return parseFloat(value.toFixed(FIXED_NUMBER));
};
