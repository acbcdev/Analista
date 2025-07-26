import { Settings } from "lucide-react";
import { EmojiPopover } from "@/components/EmojiPopover";
import { Button } from "@/components/ui/button";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { emojiPosition, textCase } from "@/types";

interface GlobalSettingsPopoverProps {
	globalSettings: {
		textFormat: textCase;
		emoji: string;
		emojiPosition: emojiPosition;
	};
	onGlobalSettingsChange: (settings: {
		textFormat: textCase;
		emoji: string;
		emojiPosition: emojiPosition;
	}) => void;
}

export function GlobalSettingsPopover({
	globalSettings,
	onGlobalSettingsChange,
}: GlobalSettingsPopoverProps) {
	const [tab, setTab] = useState<"emoji" | "custom">("emoji");
	return (
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
								onGlobalSettingsChange({
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
								<SelectItem value="capitalizeWords">Title Case</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-2">
						<Label className="font-semibold">
							Global Emoji: {globalSettings.emoji}
						</Label>
						<Tabs
							value={tab}
							onValueChange={(value) => setTab(value as "emoji" | "custom")}
						>
							<TabsList>
								<TabsTrigger value="emoji">emoji</TabsTrigger>
								<TabsTrigger value="custom">custom</TabsTrigger>
							</TabsList>
							<TabsContent value="emoji">
								<EmojiPopover
									currentEmoji={globalSettings.emoji}
									onEmojiSelect={(emoji) =>
										onGlobalSettingsChange({
											...globalSettings,
											emoji: emoji,
										})
									}
									placeholder="Search emojis..."
									className="w-full"
								/>
							</TabsContent>
							<TabsContent value="custom">
								<Input
									onChange={(e) =>
										onGlobalSettingsChange({
											...globalSettings,
											emoji: e.target.value,
										})
									}
									max={8}
									placeholder="Enter custom emoji..."
								/>
							</TabsContent>
						</Tabs>
					</div>

					<div className="space-y-2">
						<Label className="font-semibold">Emoji Position</Label>
						<Select
							value={globalSettings.emojiPosition}
							onValueChange={(value) =>
								onGlobalSettingsChange({
									...globalSettings,
									emojiPosition: value as emojiPosition,
								})
							}
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
		</Popover>
	);
}
