import { Upload, Zap } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useTipMenuInjection } from "@/hooks/useTipMenuInjection";

export function TipMenuInjection() {
	const { tipMenus, injectTipMenu } = useTipMenuInjection();
	const [selectedMenuId, setSelectedMenuId] = useState<string>("");
	const [isInjecting, setIsInjecting] = useState(false);

	// Debug logs
	console.log("TipMenus:", tipMenus);
	console.log(
		"Active tipMenus:",
		tipMenus.filter((menu) => menu.isActive),
	);

	const handleInject = async () => {
		if (!selectedMenuId) return;

		setIsInjecting(true);
		try {
			await injectTipMenu(selectedMenuId);
		} finally {
			setIsInjecting(false);
		}
	};

	const selectedMenu = tipMenus.find((m) => m.id === selectedMenuId);
	const activeMenus = tipMenus.filter((menu) => menu.isActive);

	return (
		<Card>
			<CardHeader className="pb-3">
				<CardTitle className="text-sm flex items-center gap-2">
					<Upload className="h-4 w-4" />
					Inject Tip Menu
				</CardTitle>
				<CardDescription className="text-xs">
					Select and inject a tip menu into the current page
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				{/* Debug Info */}
				{tipMenus.length === 0 && (
					<div className="bg-yellow-50 dark:bg-yellow-950 p-2 rounded-md">
						<p className="text-xs text-yellow-700 dark:text-yellow-300">
							No tip menus found. Create some tip menus first in the dashboard.
						</p>
					</div>
				)}

				{activeMenus.length === 0 && tipMenus.length > 0 && (
					<div className="bg-orange-50 dark:bg-orange-950 p-2 rounded-md">
						<p className="text-xs text-orange-700 dark:text-orange-300">
							No active tip menus found. Make sure to activate at least one
							menu.
						</p>
					</div>
				)}

				{/* Menu Selection */}
				<div className="space-y-2">
					<label htmlFor="menu-select" className="text-xs font-medium">
						Select Tip Menu ({activeMenus.length} available)
					</label>

					{/* Temporary native select for debugging */}
					<select
						value={selectedMenuId}
						onChange={(e) => {
							console.log("Native select changed:", e.target.value);
							setSelectedMenuId(e.target.value);
						}}
						className="w-full h-8 px-3 text-xs border border-input bg-background rounded-md"
					>
						<option value="">Choose a menu...</option>
						{activeMenus.map((menu) => (
							<option key={menu.id} value={menu.id}>
								{menu.name} ({menu.items.length} items)
							</option>
						))}
					</select>

					{/* Shadcn Select (keeping for comparison) */}
					<Select
						value={selectedMenuId}
						onValueChange={(value) => {
							console.log("Shadcn select changed:", value);
							setSelectedMenuId(value);
						}}
					>
						<SelectTrigger id="menu-select" className="h-8 text-xs">
							<SelectValue placeholder="Choose a menu..." />
						</SelectTrigger>
						<SelectContent>
							{activeMenus.map((menu) => (
								<SelectItem key={menu.id} value={menu.id} className="text-xs">
									<div className="flex flex-col">
										<span className="font-medium">{menu.name}</span>
										<span className="text-muted-foreground">
											{menu.items.length} items
										</span>
									</div>
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{/* Selected Menu Preview */}
				{selectedMenu && (
					<>
						<Separator />
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<span className="text-xs font-medium">Preview</span>
								<span className="text-xs text-muted-foreground">
									{selectedMenu.items.length} items
								</span>
							</div>
							<div className="bg-muted p-2 rounded-md max-h-20 overflow-y-auto">
								<div className="space-y-1">
									{selectedMenu.items.slice(0, 3).map((item) => (
										<div
											key={`${item.text}-${item.price}`}
											className="flex justify-between text-xs"
										>
											<span className="truncate">{item.text}</span>
											<span className="font-medium">{item.price}</span>
										</div>
									))}
									{selectedMenu.items.length > 3 && (
										<div className="text-xs text-muted-foreground text-center">
											+{selectedMenu.items.length - 3} more items
										</div>
									)}
								</div>
							</div>
						</div>
					</>
				)}

				{/* Inject Button */}
				<Button
					onClick={handleInject}
					disabled={!selectedMenuId || isInjecting}
					className="w-full h-8 text-xs"
					variant={isInjecting ? "secondary" : "default"}
				>
					{isInjecting ? (
						<>
							<div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
							Injecting...
						</>
					) : (
						<>
							<Zap className="h-3 w-3 mr-2" />
							Inject Menu
						</>
					)}
				</Button>

				{/* Info */}
				<div className="bg-blue-50 dark:bg-blue-950 p-2 rounded-md">
					<p className="text-xs text-blue-700 dark:text-blue-300">
						<strong>Note:</strong> Make sure you're on a supported page with tip
						menu inputs before injecting.
					</p>
				</div>
			</CardContent>
		</Card>
	);
}
