import { Eye } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import type { TipMenu } from "@/store/tipMenu";
import { formatMenuItem } from "../../../../../lib/formata";

interface MenuPreviewPopoverProps {
	menu: TipMenu;
}

export function MenuPreviewPopover({ menu }: MenuPreviewPopoverProps) {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant="ghost" size="sm">
					<Eye className="h-4 w-4" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-80" align="end">
				<div className="space-y-4">
					<div>
						<h4 className="font-medium mb-2">Menu Preview</h4>
						<p className="text-sm text-muted-foreground mb-3">
							{menu.description}
						</p>
					</div>
					<Separator />
					<div className="space-y-2">
						{menu.items.slice(0, 5).map((item) => (
							<div
								key={item.id}
								className="flex items-center justify-between p-2 bg-muted rounded text-sm"
							>
								<span>{formatMenuItem(item, menu.globalSettings)}</span>
								<span className="font-medium">{item.price} tokens</span>
							</div>
						))}
						{menu.items.length > 5 && (
							<div className="text-center text-sm text-muted-foreground">
								+{menu.items.length - 5} more items
							</div>
						)}
					</div>
					<Separator />
					<div className="flex justify-center">
						<Button asChild size="sm" variant="outline" className="w-full">
							<Link to={`/tipMenu/view/${menu.id}`}>View Complete Menu</Link>
						</Button>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
}
