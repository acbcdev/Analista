import {
	BarChart3,
	Clock,
	FileText,
	Maximize2,
	Settings,
	Tag,
	Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useChaturbateTags } from "@/hooks/useChaturbateTags";
import { useHoursExtraction } from "@/hooks/useHoursExtraction";
import { openDashboard } from "@/lib/action";
import { TipMenuInjection } from "./components/TipMenuInjection";
import "./App.css";

function App() {
	const { exportTags, saveAndViewTags } = useChaturbateTags();
	const { extractAndSaveHours } = useHoursExtraction();

	return (
		<main className="p-4 bg-background">
			{/* Header */}
			<div className="flex items-center justify-between mb-6">
				<div className="flex items-center gap-2">
					<div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
						<BarChart3 className="w-4 h-4 text-primary-foreground" />
					</div>
					<div>
						<h1 className="font-semibold text-lg">Analista</h1>
						<p className="text-xs text-muted-foreground">
							Data Extraction Tool
						</p>
					</div>
				</div>
				<div className="flex items-center gap-1">
					<Button variant="ghost" size="icon" onClick={() => openDashboard()}>
						<Maximize2 className="h-4 w-4" />
					</Button>
					<Button variant="ghost" size="icon">
						<Settings className="h-4 w-4" />
					</Button>
				</div>
			</div>

			{/* Quick Actions */}
			<Card className="mb-4">
				<CardHeader className="pb-3">
					<CardTitle className="text-sm flex items-center gap-2">
						<Zap className="h-4 w-4" />
						Quick Actions
					</CardTitle>
					<CardDescription className="text-xs">
						Extract data from the current page
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-3">
					{/* Tags Extraction */}
					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Tag className="h-4 w-4 text-blue-500" />
								<span className="text-sm font-medium">Tags</span>
							</div>
							<span className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-xs">
								Chaturbate
							</span>
						</div>
						<div className="grid grid-cols-2 gap-2">
							<Button
								variant="outline"
								size="sm"
								className="text-xs h-8"
								onClick={() => saveAndViewTags()}
							>
								<FileText className="h-3 w-3 mr-1" />
								View
							</Button>
							<Button
								variant="outline"
								size="sm"
								className="text-xs h-8"
								onClick={() => exportTags("exportJson")}
							>
								<FileText className="h-3 w-3 mr-1" />
								Export
							</Button>
						</div>
					</div>

					<Separator />

					{/* Hours Extraction */}
					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Clock className="h-4 w-4 text-green-500" />
								<span className="text-sm font-medium">Hours</span>
							</div>
							<span className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-xs">
								General
							</span>
						</div>
						<Button
							variant="outline"
							size="sm"
							className="w-full text-xs h-8"
							onClick={() => extractAndSaveHours()}
						>
							<Clock className="h-3 w-3 mr-1" />
							Extract & Save
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* Tip Menu Injection */}
			<TipMenuInjection />

			{/* Status Card */}
			<Card>
				<CardHeader className="pb-3">
					<CardTitle className="text-sm">Status</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex items-center justify-between text-xs">
						<span className="text-muted-foreground">Ready to extract data</span>
						<div className="flex items-center gap-1">
							<div className="w-2 h-2 bg-green-500 rounded-full"></div>
							<span className="text-green-600">Active</span>
						</div>
					</div>
				</CardContent>
			</Card>
		</main>
	);
}

export default App;
