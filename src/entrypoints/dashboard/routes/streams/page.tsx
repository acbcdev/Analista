import { Plus, Video } from "lucide-react";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { DateFilter } from "@/entrypoints/dashboard/components/DateFilter";
import Layout from "@/entrypoints/dashboard/components/layout/layout";
import { useDateFilter } from "@/hooks/useDateFilter";
import { useDateRangeFilter } from "@/hooks/useDateRangeFilter";
import { useModelsStore } from "@/store/models";
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
	if (models.length === 0) {
		return (
			<Layout>
				<div className="data-empty">
					<div className="mb-6">
						<Video className="size-16 text-muted-foreground mx-auto mb-4" />
						<h2 className="text-2xl font-semibold mb-2">No streams found</h2>
						<p className="text-muted-foreground max-w-md mb-6">
							Add models to start tracking their streams and analyze performance
							data across platforms.
						</p>
						<Button onClick={() => setIsAddingModel(true)} className="gap-2">
							<Plus className="size-4" />
							Add Your First Model
						</Button>
					</div>
				</div>
			</Layout>
		);
	}

	// Estado vacío: hay modelos pero no hay streams
	if (allStreams.length === 0) {
		return (
			<Layout>
				<div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
					<div className="mb-6">
						<Video className="size-16 text-muted-foreground mx-auto mb-4" />
						<h2 className="text-2xl font-semibold mb-2">No streams data yet</h2>
						<p className="text-muted-foreground max-w-md mb-6">
							Your models don't have any streams recorded yet. Stream data will
							appear here once your models start broadcasting.
						</p>
						<div className="flex gap-4 justify-center mb-4">
							<AddStreamDialog>
								<Button className="gap-2">
									<Plus className="size-4" />
									Add Stream Manually
								</Button>
							</AddStreamDialog>
						</div>
						<div className="text-sm text-muted-foreground">
							<p>
								Models added:{" "}
								<span className="font-medium">{models.length}</span>
							</p>
						</div>
					</div>
				</div>
			</Layout>
		);
	}

	return (
		<Layout>
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
		</Layout>
	);
}
