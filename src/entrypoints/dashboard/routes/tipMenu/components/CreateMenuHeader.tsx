import { ArrowLeft, Save } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";

interface CreateMenuHeaderProps {
	menuName: string;
	hasItems: boolean;
	onSave: () => void;
}

export function CreateMenuHeader({
	menuName,
	hasItems,
	onSave,
}: CreateMenuHeaderProps) {
	return (
		<div className="flex items-center justify-between">
			<div className="flex items-center gap-4">
				<Link to="/tipMenu">
					<Button variant="ghost" size="icon" asChild>
						<ArrowLeft className="p-1" />
					</Button>
				</Link>
				<div>
					<h1 className="text-3xl font-bold">Create Tip Menu</h1>
					<p className="text-muted-foreground">
						Create and configure your new tip menu
					</p>
				</div>
			</div>
			<Button
				onClick={onSave}
				className="bg-green-600 hover:bg-green-700 text-foreground"
				disabled={!menuName.trim() || !hasItems}
			>
				<Save className="h-4 w-4 mr-2" />
				Save Menu
			</Button>
		</div>
	);
}
