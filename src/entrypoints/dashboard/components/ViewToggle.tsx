import { BarChart3, Calendar, Table } from "lucide-react";
import { Button } from "@/components/ui/button";

export type ViewMode = "table" | "chart" | "grid";

interface ViewToggleProps {
	currentView: ViewMode;
	onViewChange: (view: ViewMode) => void;
}

export function ViewToggle({ currentView, onViewChange }: ViewToggleProps) {
	return (
		<div className="flex items-center border rounded-lg p-1">
			<Button
				variant={currentView === "table" ? "default" : "ghost"}
				size="sm"
				onClick={() => onViewChange("table")}
				className="h-8 px-3"
			>
				<Table className="h-4 w-4 mr-1" />
				Table
			</Button>
			<Button
				variant={currentView === "grid" ? "default" : "ghost"}
				size="sm"
				onClick={() => onViewChange("grid")}
				className="h-8 px-3"
			>
				<Calendar className="h-4 w-4 mr-1" />
				Grid
			</Button>
			<Button
				variant={currentView === "chart" ? "default" : "ghost"}
				size="sm"
				onClick={() => onViewChange("chart")}
				className="h-8 px-3"
			>
				<BarChart3 className="h-4 w-4 mr-1" />
				Chart
			</Button>
		</div>
	);
}
