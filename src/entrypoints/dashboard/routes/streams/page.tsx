import { useMemo } from "react";
import { DateFilter } from "@/entrypoints/dashboard/components/DateFilter";
import Layout from "@/entrypoints/dashboard/components/layout/layout";
import { useDateFilter } from "@/hooks/useDateFilter";
import { useDateRangeFilter } from "@/hooks/useDateRangeFilter";
import { useModelsStore } from "@/store/models";
import { columns } from "./columns";
import { DataTable } from "./dataTable";

export function Streams() {
	const models = useModelsStore((state) => state.models);

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

	return (
		<Layout>
			<div className="p-4 pt-0">
				<DateFilter
					dateRange={dateRange}
					onDateRangeChange={onDateRangeChange}
					preset={preset}
					onPresetChange={onPresetChange}
				/>
				<DataTable columns={columns} data={filteredStreams} />
			</div>
		</Layout>
	);
}
