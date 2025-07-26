import { BarChart3, Maximize2, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AppHeaderProps {
	onOpenDashboard: () => void;
	onOpenSettings?: () => void;
}

export function AppHeader({ onOpenDashboard, onOpenSettings }: AppHeaderProps) {
	return (
		<div className="flex items-center justify-between mb-6">
			<div className="flex items-center gap-2">
				<div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
					<BarChart3 className="w-4 h-4 text-primary-foreground" />
				</div>
				<div>
					<h1 className="font-semibold text-lg">Analista</h1>
					<p className="text-xs text-muted-foreground">Data Extraction Tool</p>
				</div>
			</div>
			<div className="flex items-center gap-1">
				<Button variant="ghost" size="icon" onClick={onOpenDashboard}>
					<Maximize2 className="h-4 w-4" />
				</Button>
				<Button variant="ghost" size="icon" onClick={onOpenSettings}>
					<Settings className="h-4 w-4" />
				</Button>
			</div>
		</div>
	);
}
