import { Copy, Edit, MoreVertical, Trash2 } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
	onDelete,
}: MenuActionButtonsProps) {
	return (
		<div className="flex items-center gap-2">
			{/* Preview Popover */}
			<MenuPreviewPopover menu={menu} />

			{/* Actions Dropdown */}
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" size="sm">
						<MoreVertical className="h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuLabel>Actions</DropdownMenuLabel>
					<DropdownMenuSeparator />

					<DropdownMenuItem asChild>
						<Link
							to={`/tipMenu/edit/${menu.id}`}
							className="flex items-center gap-2"
						>
							<Edit className="h-4 w-4" />
							Edit Menu
						</Link>
					</DropdownMenuItem>

					<DropdownMenuItem
						onClick={() => onDuplicate(menu.id)}
						className="flex items-center gap-2"
					>
						<Copy className="h-4 w-4" />
						Duplicate Menu
					</DropdownMenuItem>

					<DropdownMenuSeparator />
					{/*
					<DropdownMenuItem
						onClick={() => onToggleStatus(menu.id)}
						className={`flex items-center gap-2 ${
							menu.isActive ? "text-orange-600" : "text-green-600"
						}`}
					>
						{menu.isActive ? "Deactivate" : "Activate"} Menu
					</DropdownMenuItem> */}

					<DropdownMenuItem
						onClick={() => onDelete(menu.id)}
						className="flex items-center gap-2 text-destructive-foreground  focus:text-destructive-foreground focus:bg-destructive/30"
					>
						<Trash2 className="text-destructive-foreground" />
						Delete Menu
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
