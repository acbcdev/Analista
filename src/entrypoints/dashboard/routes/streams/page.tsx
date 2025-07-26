import { Video } from "lucide-react";
import { useMemo } from "react";
import { Button } from "react-aria-components";
import { DateFilter } from "@/entrypoints/dashboard/components/DateFilter";
import { useDateFilter } from "@/hooks/useDateFilter";
import { useDateRangeFilter } from "@/hooks/useDateRangeFilter";
import { useModelsStore } from "@/store/models";
import { EmptyState } from "../EmptyState";
import { columns } from "./columns";
import { AddStreamDialog } from "./components/AddStreamDialog";
import { DataTable } from "./dataTable";

export function Streams() {
	const models = useModelsStore((state) => state.models);
	const setIsAddingModel = useModelsStore((state) => state.setIsAddingModel);

	const { dateRange, onDateRangeChange, preset, onPresetChange } =
		useDateFilter();

	// Get all streams with model information
	const allStreams = useMemo(() => {
		return models.flatMap((model) =>
			model.streams.map((stream) => ({
				...stream,
				model: { name: model.name },
			})),
		);
	}, [models]);
	const filteredStreams = useDateRangeFilter(
		allStreams,
		dateRange,
		(item) => new Date(item.createdAt ?? item.updatedAt),
	);
	// Filter streams by date range

	// Estado vacío: no hay modelos
	if (models.length === 0)
		return (
			<EmptyState
				icon={Video}
				title={"No Streams Found"}
				description="Add models to start tracking their streams and analyze performance
						data across platforms."
				onAction={() => {
					setIsAddingModel(true);
				}}
				actionLabel="Add Model"
			/>
		);
	// Estado vacío: hay modelos pero no hay streams
	if (allStreams.length === 0)
		return (
			<EmptyState
				icon={Video}
				title="No streams data found"
				description="Your models don't have any streams recorded yet. Stream data will appear here once your models start broadcasting."
			>
				<AddStreamDialog />
			</EmptyState>
		);

	return (
		<div className="p-4 pt-0">
			<DataTable columns={columns} data={filteredStreams}>
				<div className="flex gap-4 items-center">
					<DateFilter
						dateRange={dateRange}
						onDateRangeChange={onDateRangeChange}
						preset={preset}
						onPresetChange={onPresetChange}
					/>
					<AddStreamDialog />
				</div>
			</DataTable>
		</div>
	);
}
