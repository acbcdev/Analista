import { Plus } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";

export function DashboardHeader() {
	return (
		<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
			<div>
				<h1 className="text-3xl font-bold">Tip Menu Manager</h1>
				<p className="text-muted-foreground">
					Manage all your tip menus in one place
				</p>
			</div>
			<Button asChild className="w-fit">
				<Link to="/tipMenu/create">
					<Plus className="h-4 w-4 mr-2" />
					Create New Menu
				</Link>
			</Button>
		</div>
	);
}
