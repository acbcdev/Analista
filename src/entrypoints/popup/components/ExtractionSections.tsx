import { Clock, FileText, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExtractionSectionHeader } from "./ExtractionSectionHeader";

interface TagsExtractionSectionProps {
	onView: () => void;
	onExport: () => void;
}

export function TagsExtractionSection({
	onView,
	onExport,
}: TagsExtractionSectionProps) {
	return (
		<div className="space-y-2">
			<ExtractionSectionHeader
				icon={Tag}
				title="Tags"
				badge="Chaturbate"
				iconColor="text-blue-500"
			/>
			<div className="grid grid-cols-2 gap-2">
				<Button
					variant="outline"
					size="sm"
					className="text-xs h-8"
					onClick={onView}
				>
					<FileText className="h-3 w-3 mr-1" />
					View
				</Button>
				<Button
					variant="outline"
					size="sm"
					className="text-xs h-8"
					onClick={onExport}
				>
					<FileText className="h-3 w-3 mr-1" />
					Export
				</Button>
			</div>
		</div>
	);
}

interface HoursExtractionSectionProps {
	onExtract: () => void;
}

export function HoursExtractionSection({
	onExtract,
}: HoursExtractionSectionProps) {
	return (
		<div className="space-y-2">
			<ExtractionSectionHeader
				icon={Clock}
				title="Hours"
				badge="General"
				iconColor="text-green-500"
			/>
			<Button
				variant="outline"
				size="sm"
				className="w-full text-xs h-8"
				onClick={onExtract}
			>
				<Clock className="h-3 w-3 mr-1" />
				Extract & Save
			</Button>
		</div>
	);
}
