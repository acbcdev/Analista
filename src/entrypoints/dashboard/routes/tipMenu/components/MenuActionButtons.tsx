import { CopyPlus, Edit, Trash2 } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import type { TipMenu } from "@/store/tipMenu";
import { MenuPreviewPopover } from "./MenuPreviewPopover";

interface MenuActionButtonsProps {
	menu: TipMenu;
	onDuplicate: (id: string) => void;
	onToggleStatus: (id: string) => void;
	onDelete: (id: string) => void;
}

export function MenuActionButtons({
	menu,
	onDuplicate,
	onToggleStatus,
	onDelete,
}: MenuActionButtonsProps) {
	return (
		<div className="flex items-center gap-2">
			{/* View Menu Popover */}
			<MenuPreviewPopover menu={menu} />

			<Tooltip>
				<TooltipTrigger>
					<Link to={`/dashboard/tipMenu/edit/${menu.id}`}>
						<Button variant="ghost" size="sm">
							<Edit className="h-4 w-4" />
						</Button>
					</Link>
				</TooltipTrigger>
				<TooltipContent>Edit</TooltipContent>
			</Tooltip>
			{/* Copy Button */}
			<Tooltip>
				<TooltipTrigger>
					<Button
						variant="ghost"
						size="sm"
						onClick={() => onDuplicate(menu.id)}
					>
						<CopyPlus className="h-4 w-4" />
					</Button>
				</TooltipTrigger>
				<TooltipContent>Duplicate</TooltipContent>
			</Tooltip>

			{/* Toggle Status */}
			<Button
				variant="ghost"
				size="sm"
				onClick={() => onToggleStatus(menu.id)}
				className={
					menu.isActive
						? "border-orange-500 text-orange-600 hover:bg-orange-50"
						: "border-green-500 text-green-600 hover:bg-green-50"
				}
			>
				{menu.isActive ? "Deactivate" : "Activate"}
			</Button>

			{/* Delete Button */}
			<Button
				variant="destructiveGhost"
				size="sm"
				onClick={() => onDelete(menu.id)}
			>
				<Trash2 className="h-4 w-4" />
			</Button>
		</div>
	);
}
