import { Card, CardContent } from "@/components/ui/card";
import type { TipMenu } from "@/store/tipMenu";

interface StatsCardsProps {
	tipMenus: TipMenu[];
}

export function StatsCards({ tipMenus }: StatsCardsProps) {
	const totalMenus = tipMenus.length;
	const activeMenus = tipMenus.filter((menu) => menu.isActive).length;
	const totalItems = tipMenus.reduce(
		(total, menu) => total + menu.items.length,
		0,
	);

	const avgPrice =
		totalMenus > 0
			? Math.round(
					tipMenus.reduce(
						(total, menu) =>
							total + menu.items.reduce((sum, item) => sum + item.price, 0),
						0,
					) / tipMenus.reduce((total, menu) => total + menu.items.length, 0),
				)
			: 0;

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
			<Card>
				<CardContent className="pt-6">
					<div className="text-center">
						<div className="text-2xl font-bold text-primary">{totalMenus}</div>
						<div className="text-sm text-muted-foreground">Total Menus</div>
					</div>
				</CardContent>
			</Card>
			<Card>
				<CardContent className="pt-6">
					<div className="text-center">
						<div className="text-2xl font-bold text-green-600">
							{activeMenus}
						</div>
						<div className="text-sm text-muted-foreground">Active Menus</div>
					</div>
				</CardContent>
			</Card>
			<Card>
				<CardContent className="pt-6">
					<div className="text-center">
						<div className="text-2xl font-bold text-blue-600">{totalItems}</div>
						<div className="text-sm text-muted-foreground">Total Items</div>
					</div>
				</CardContent>
			</Card>
			<Card>
				<CardContent className="pt-6">
					<div className="text-center">
						<div className="text-2xl font-bold text-purple-600">{avgPrice}</div>
						<div className="text-sm text-muted-foreground">Avg Price</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
