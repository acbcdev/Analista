import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import type { TipMenu } from "@/store/tipMenu";
import { MenuActionButtons } from "./MenuActionButtons";

interface MenuCardProps {
	menu: TipMenu;
	onDuplicate: (id: string) => void;
	onToggleStatus: (id: string) => void;
	onDelete: (id: string) => void;
}

export function MenuCard({
	menu,
	onDuplicate,
	onToggleStatus,
	onDelete,
}: MenuCardProps) {
	return (
		<Card className="overflow-hidden">
			<CardHeader>
				<div className="flex items-start justify-between">
					<div className="space-y-2">
						<div className="flex items-center gap-2">
							<CardTitle className="text-xl">{menu.name}</CardTitle>
							<span
								className={`px-2 py-1 text-xs rounded-full ${
									menu.isActive
										? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
										: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
								}`}
							>
								{menu.isActive ? "Active" : "Inactive"}
							</span>
						</div>
						<p className="text-muted-foreground">{menu.description}</p>
						<div className="flex items-center gap-4 text-sm text-muted-foreground">
							<span>{menu.items.length} items</span>
							<span>•</span>
							<span>
								Created {new Date(menu.createdAt).toLocaleDateString()}
							</span>
							<span>•</span>
							<span>
								Updated {new Date(menu.updatedAt).toLocaleDateString()}
							</span>
						</div>
					</div>
					<MenuActionButtons
						menu={menu}
						onDuplicate={onDuplicate}
						onToggleStatus={onToggleStatus}
						onDelete={onDelete}
					/>
				</div>
			</CardHeader>
		</Card>
	);
}
