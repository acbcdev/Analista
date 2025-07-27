import { Zap } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
	HoursExtractionSection,
	TagsExtractionSection,
} from "./ExtractionSections";

interface QuickActionsCardProps {
	onViewTags: () => void;
	onExportTags: () => void;
	onExtractHours: () => void;
	showHoursSection?: boolean;
}

export function QuickActionsCard({
	onViewTags,
	onExportTags,
	onExtractHours,
	showHoursSection = false,
}: QuickActionsCardProps) {
	return (
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
				<TagsExtractionSection onView={onViewTags} onExport={onExportTags} />

				{showHoursSection && (
					<>
						<Separator />
						<HoursExtractionSection onExtract={onExtractHours} />
					</>
				)}
			</CardContent>
		</Card>
	);
}
