import { isWithinInterval } from "date-fns";
import { useMemo, useState } from "react";
import { DateFilter } from "@/entrypoints/dashboard/components/DateFilter";
import Layout from "@/entrypoints/dashboard/components/layout/layout";
import { useModelsStore } from "@/store/models";
import { columns } from "./columns";
import { DataTable } from "./dataTable";

export function Streams() {
	const models = useModelsStore((state) => state.models);

	// State for date filter
	const [dateRange, setDateRange] = useState<{
		from: Date | undefined;
		to: Date | undefined;
	}>({
		from: undefined,
		to: undefined,
	});

	const [preset, setPreset] = useState<
		"thisweek" | "this15days" | "thismonth" | "custom"
	>("thisweek");

	// Get all streams with model information
	const allStreams = useMemo(() => {
		return models.flatMap((model) =>
			model.streams.map((stream) => ({
				...stream,
				model: { name: model.name },
			})),
		);
	}, [models]);

	// Filter streams by date range
	const filteredStreams = useMemo(() => {
		if (!dateRange.from || !dateRange.to) {
			return allStreams;
		}

		return allStreams.filter((stream) => {
			// Using createdAt timestamp for date filtering
			if (stream.createdAt) {
				const streamDate = new Date(stream.createdAt);
				return isWithinInterval(streamDate, {
					start: dateRange.from as Date,
					end: dateRange.to as Date,
				});
			}
			return true; // Include streams without createdAt for now
		});
	}, [allStreams, dateRange.from, dateRange.to]);

	return (
		<Layout>
			<div className="p-4 pt-0">
				<DateFilter
					dateRange={dateRange}
					onDateRangeChange={setDateRange}
					preset={preset}
					onPresetChange={setPreset}
				/>
				<DataTable columns={columns} data={filteredStreams} />
			</div>
		</Layout>
	);
}
