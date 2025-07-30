import { Download, Loader2, Search, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useStoreTipMenu, type TipMenuItem } from "@/store/tipMenu";
import type { emojiPosition, textCase } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ExtractedTipMenu {
	name: string;
	items: ExtractedTipItem[];
	platform: string;
}

interface ExtractedTipItem {
	text: string;
	price: number;
}

export function TipMenuExtractor() {
	const { addTipMenu } = useStoreTipMenu();
	const [isExtracting, setIsExtracting] = useState(false);
	const [extractedMenu, setExtractedMenu] = useState<ExtractedTipMenu | null>(null);
	const [menuName, setMenuName] = useState("");

	const extractTipMenu = async () => {
		setIsExtracting(true);
		try {
			// Get the active tab
			const [tab] = await browser.tabs.query({
				active: true,
				currentWindow: true,
			});
			
			if (!tab.id) {
				toast.error("No active tab found");
				return;
			}

			// Check if we're on a supported platform
			const url = tab.url || "";
			const platform = detectPlatform(url);
			
			if (!platform) {
				toast.error("Unsupported platform. Navigate to Chaturbate or Stripchat tip menu settings page.");
				return;
			}

			// Inject the extraction script
			const results = await browser.scripting.executeScript({
				target: { tabId: tab.id },
				func: extractTipMenuFromPage,
				args: [platform],
			});

			const result = results[0].result;
			if (result && result.items.length > 0) {
				setExtractedMenu(result);
				setMenuName(result.name || `${platform} Menu - ${new Date().toLocaleDateString()}`);
				toast.success(`Found ${result.items.length} tip menu items!`);
			} else {
				toast.error("No tip menu items found on this page");
			}
		} catch (error) {
			console.error("Error extracting tip menu:", error);
			toast.error("Failed to extract tip menu from page");
		} finally {
			setIsExtracting(false);
		}
	};

	const saveTipMenu = () => {
		if (!extractedMenu || !menuName.trim()) {
			toast.error("Please provide a menu name");
			return;
		}

		// Convert extracted items to TipMenuItem format
		const tipMenuItems: TipMenuItem[] = extractedMenu.items.map((item, index) => ({
			id: `extracted-${Date.now()}-${index}`,
			text: item.text,
			price: item.price,
			settings: {
				textFormat: "capitalizeWords" as textCase,
				emoji: "⭐",
				emojiPosition: "end" as emojiPosition,
				useGlobalEmoji: true,
			},
		}));

		// Create the tip menu
		const newMenu = {
			id: Date.now().toString(),
			name: menuName,
			description: `Extracted from ${extractedMenu.platform} on ${new Date().toLocaleDateString()}`,
			items: tipMenuItems,
			globalSettings: {
				textFormat: "capitalizeWords" as textCase,
				emoji: "⭐",
				emojiPosition: "end" as emojiPosition,
			},
			createdAt: Date.now(),
			updatedAt: Date.now(),
			isActive: true,
		};

		addTipMenu(newMenu);
		toast.success(`Tip menu "${menuName}" saved successfully!`);
		
		// Reset state
		setExtractedMenu(null);
		setMenuName("");
	};

	const clearExtractedMenu = () => {
		setExtractedMenu(null);
		setMenuName("");
	};

	return (
		<Card className="my-2">
			<CardHeader>
				<CardTitle className="flex items-center gap-2 ">
					<Download className="h-5 w-5" />
					Extract Tip Menu
				</CardTitle>
				<CardDescription>
					Extract tip menu items from your current tip menu settings (Chaturbate, Stripchat)
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				{!extractedMenu ? (
					<>
						<Button
							onClick={extractTipMenu}
							disabled={isExtracting}
							className="w-full"
						>
							{isExtracting ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Extracting...
								</>
							) : (
								<>
									<Search className="mr-2 h-4 w-4" />
									Extract from Current Page
								</>
							)}
						</Button>
						<p className="text-xs text-muted-foreground text-center">
							Navigate to your tip menu settings page and click extract
						</p>
					</>
				) : (
					<>
						<div className="space-y-2">
							<Label htmlFor="menu-name">Menu Name</Label>
							<Input
								id="menu-name"
								value={menuName}
								onChange={(e) => setMenuName(e.target.value)}
								placeholder="Enter menu name..."
							/>
						</div>

						<div className="space-y-2">
							<Label>Extracted Items ({extractedMenu.items.length})</Label>

						<div className=" rounded-md border">

						

							<ScrollArea className="h-40 px-5 my-2">
								<div className="space-y-1 ">
									
								{extractedMenu.items.map((item, index) => (
									<div
										key={index}
										className="flex justify-between items-center text-sm p-2 bg-muted rounded-sm"
									>
										<span className="flex-1">{item.text}</span>
										<span className="text-green-600 font-semibold">
											{item.price} tokens
										</span>
									</div>
								))}
								</div>

								</ScrollArea></div>
						</div>

						<Separator />

						<div className="flex gap-2">
							<Button
								onClick={saveTipMenu}
								disabled={!menuName.trim()}
								className="flex-1"
							>
								<Plus className="mr-2 h-4 w-4" />
								Save Menu
							</Button>
							<Button
								onClick={clearExtractedMenu}
								variant="outline"
								className="flex-1"
							>
								Cancel
							</Button>
						</div>
					</>
				)}
			</CardContent>
		</Card>
	);
}



// Helper function to detect platform
function detectPlatform(url: string): number | null {
  const PLATFORMS = {
  CHATURBATE: 1,
  STRIPCHAT: 2,
}
	if (url.includes("chaturbate.com")) return PLATFORMS.CHATURBATE;
	if (url.includes("stripchat.com")) return PLATFORMS.STRIPCHAT;
	return null;
}

// Function that will be injected into the page to extract tip menu
function extractTipMenuFromPage(platform: number): ExtractedTipMenu | null {
	console.log(`Extracting tip menu from ${platform} settings page`);
const PLATFORMS = {
  CHATURBATE: 1,
  STRIPCHAT: 2,
}
	try {
		if (platform === PLATFORMS.CHATURBATE) {
			return extractFromChaturbateSettings();
		} else if (platform === PLATFORMS.STRIPCHAT) {
			return extractFromStripchatSettings();
		}
	} catch (error) {
		console.error("Error during extraction:", error);
	}

	return null;

function extractFromChaturbateSettings(): ExtractedTipMenu | null {
	// Extract from Chaturbate tip menu settings page
	// Based on the injection logic, the inputs are #id_item1, #id_price1, etc.
	const items: ExtractedTipItem[] = [];
	const MAX_ITEMS = 50;
	
	for (let i = 1; i <= MAX_ITEMS; i++) {
		const itemInput = document.querySelector<HTMLInputElement>(`#id_item${i}`);
		const priceInput = document.querySelector<HTMLInputElement>(`#id_price${i}`);
		
		if (!itemInput || !priceInput) break; // No more inputs found
		
		const text = itemInput.value.trim();
		const price = parseInt(priceInput.value) || 0;
		
		if (text && price > 0) {
			items.push({ text, price });
		}
	}

	// Try to get the broadcaster name or use default
	const broadcasterName = document.querySelector('.username')?.textContent ||
		document.querySelector('h1')?.textContent ||
		document.title.includes('Chaturbate') ? 'My Chaturbate' : 'Chaturbate';

	return items.length > 0 ? {
		name: `${broadcasterName} - Tip Menu`,
		items: removeDuplicateItems(items),
		platform: "Chaturbate"
	} : null;
}

function extractFromStripchatSettings(): ExtractedTipMenu | null {
	// Extract from Stripchat tip menu settings page
	// Based on the injection logic from useTipMenuInjection.ts
	const items: ExtractedTipItem[] = [];
	
	const config = {
		tipMenuSectionSelector: ".tip-menu-settings-wrapper .settings",
		rowSelector: ".tip-menu-settings-row",
		activityInputSelector: "input.col-activity",
		priceInputSelector: "input.col-price",
	};
	
	const tipMenuSections = document.querySelectorAll(config.tipMenuSectionSelector);
	
	tipMenuSections.forEach(section => {
		const rows = section.querySelectorAll(config.rowSelector);
		
		rows.forEach(row => {
			const activityInput = row.querySelector(config.activityInputSelector) as HTMLInputElement;
			const priceInput = row.querySelector(config.priceInputSelector) as HTMLInputElement;
			console.log("Extracting row:", activityInput, priceInput);
			if (activityInput && priceInput) {
				const text = activityInput.value.trim();
				const price = parseInt(priceInput.value) || 0;
				
				if (text && price > 0) {
					items.push({ text, price });
				}
			}
		});
	});

	// Try to get the broadcaster name
	const broadcasterName = document.querySelector('.username')?.textContent ||
		document.querySelector('.model-name')?.textContent ||
		document.querySelector('h1')?.textContent ||
		'My Stripchat';

	return items.length > 0 ? {
		name: `${broadcasterName} - Tip Menu`,
		items: removeDuplicateItems(items),
		platform: "Stripchat"
	} : null;
}

function removeDuplicateItems(items: ExtractedTipItem[]): ExtractedTipItem[] {
	const seen = new Set<string>();
	return items.filter(item => {
		const key = `${item.text.toLowerCase()}-${item.price}`;
		if (seen.has(key)) return false;
		seen.add(key);
		return true;
	});
}
}
