import { BarChart3, Table } from "lucide-react";
import { Button } from "@/components/ui/button";

export type ViewMode = "table" | "chart" | "grid";

interface ViewToggleProps {
	currentView: ViewMode;
	onViewChange: (view: ViewMode) => void;
	isAllModels: boolean; // Optional prop to handle all models view
}

export function ViewToggle({
	currentView,
	onViewChange,
	isAllModels,
}: ViewToggleProps) {
	return (
		<div className="flex items-center gap-x-1 border rounded-lg p-1">
			<Button
				variant={currentView === "table" ? "default" : "ghost"}
				size="sm"
				disabled={isAllModels} // Disable if all models are selected
				onClick={() => onViewChange("table")}
				className="h-8 px-3"
			>
				<Table className="h-4 w-4 mr-1" />
				Table
			</Button>

			<Button
				variant={currentView === "chart" ? "default" : "ghost"}
				disabled={isAllModels} // Disable if all models are selected
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
