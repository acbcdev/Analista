import { ArrowLeft, Save } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";

interface EditMenuHeaderProps {
	menuName: string;
	hasItems: boolean;
	onUpdate: () => void;
}

export function EditMenuHeader({
	menuName,
	hasItems,
	onUpdate,
}: EditMenuHeaderProps) {
	return (
		<div className="flex items-center justify-between">
			<div className="flex items-center gap-4">
				<Link to="/tipMenu">
					<Button variant="outline" size="icon" asChild>
						<ArrowLeft className="p-1" />
					</Button>
				</Link>
				<div>
					<h1 className="text-3xl font-bold">Edit Tip Menu</h1>
					<p className="text-muted-foreground">
						Modify your existing tip menu configuration
					</p>
				</div>
			</div>
			<Button
				onClick={onUpdate}
				className="bg-blue-600 hover:bg-blue-700"
				disabled={!menuName.trim() || !hasItems}
			>
				<Save className="h-4 w-4 mr-2" />
				Update Menu
			</Button>
		</div>
	);
}
