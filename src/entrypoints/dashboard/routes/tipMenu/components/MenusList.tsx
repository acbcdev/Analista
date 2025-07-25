import { Card, CardContent } from "@/components/ui/card";
import type { TipMenu } from "@/store/tipMenu";
import { MenuCard } from "./MenuCard";

interface MenusListProps {
	filteredMenus: TipMenu[];
	searchTerm: string;
	onDuplicate: (id: string) => void;
	onToggleStatus: (id: string) => void;
	onDelete: (id: string) => void;
}

export function MenusList({
	filteredMenus,
	searchTerm,
	onDuplicate,
	onToggleStatus,
	onDelete,
}: MenusListProps) {
	if (filteredMenus.length === 0) {
		return (
			<Card>
				<CardContent className="pt-6">
					<div className="text-center py-8 text-muted-foreground">
						{searchTerm
							? "No menus found matching your search."
							: "No tip menus created yet. Create your first menu!"}
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className="space-y-4">
			{filteredMenus.map((menu) => (
				<MenuCard
					key={menu.id}
					menu={menu}
					onDuplicate={onDuplicate}
					onToggleStatus={onToggleStatus}
					onDelete={onDelete}
				/>
			))}
		</div>
	);
}
