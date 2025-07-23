import { Clock, Copy, ExternalLink, Plus } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { CBHOURS, SODAHOURS_URL, STRIPHOURS_URL } from "@/const/url";
import { DateFilter } from "@/entrypoints/dashboard/components/DateFilter";
import { AddModelDialog } from "@/entrypoints/dashboard/components/layout/addModelDialong";
import Layout from "@/entrypoints/dashboard/components/layout/layout";
import { ModelSelector } from "@/entrypoints/dashboard/components/ModelSelector";
import {
	type ViewMode,
	ViewToggle,
} from "@/entrypoints/dashboard/routes/viewHours/ViewToggle";
import { useDateFilter } from "@/hooks/useDateFilter";
import { useDateRangeFilter } from "@/hooks/useDateRangeFilter";
import { useStorage } from "@/hooks/useStorege";
import { useModelsStore } from "@/store/models";
import type { Hours, HoursStorage } from "@/types";
import { HoursChart } from "./HoursChart";
import { HoursGrid } from "./HoursGrid";
import HoursStats from "./HoursStats";
import { HoursTable } from "./HoursTable";

/**
 * Componente principal para visualizar y filtrar las horas trabajadas
 * Refactorizado como una caja negra reutilizable con responsabilidades separadas
 */
export function HoursView() {
	const allkeys = useStorage<Record<string, HoursStorage>>("hours", {});
	const [data, setData] = useState<Hours[]>([]);
	const [viewMode, setViewMode] = useState<ViewMode>("table");
	const [isAllModels, setIsAllModels] = useState<boolean>(false);
	const tableRef = useRef<HTMLTableElement>(null);
	const { dateRange, onDateRangeChange, preset, onPresetChange } =
		useDateFilter();
	const setIsAddingModel = useModelsStore((state) => state.setIsAddingModel);
	const models = useModelsStore((state) => state.models);

	// Caja negra: filtrado de fechas con timezone de Colombia
	// const filteredData = useHoursDateFilter(data, dateRange);
	const filteredData = useDateRangeFilter(
		data,
		dateRange,
		(item) => item.name || null,
	);

	// Caja negra: transformar datos del storage
	const allHours = useMemo(() => Object.values(allkeys || {}), [allkeys]);

	// Para la vista grid, necesitamos todos los datos con información del modelo
	const allModelsData = useMemo(() => {
		const result: (Hours & { modelName: string })[] = [];
		allHours.forEach((hourStorage) => {
			hourStorage.data.forEach((hour) => {
				result.push({
					...hour,
					modelName: hourStorage.name, // Nombre del modelo
				});
			});
		});
		return result;
	}, [allHours]);

	// Filtrar datos para vista grid (todos los modelos)
	const filteredGridData = useDateRangeFilter(
		allModelsData,
		dateRange,
		(item) => item.name || null,
	);

	// Función para copiar tabla al clipboard
	const handleCopyTable = () => {
		navigator.clipboard.writeText(tableRef.current?.innerText || "No data");
		toast.success("Copied to clipboard");
	};

	// Estado vacío: mostrar mensaje
	if (!allHours || allHours.length === 0) {
		// Si hay modelos pero no hay datos de horas, mostrar enlaces específicos
		if (models.length > 0) {
			const platformUrls = {
				chaturbate: CBHOURS,
				camsoda: SODAHOURS_URL,
				stripchat: STRIPHOURS_URL,
			};

			// Obtener plataformas únicas de los modelos
			const uniquePlatforms = new Set(
				models.flatMap((model) =>
					model.platform
						.filter((p) =>
							["chaturbate", "camsoda", "stripchat"].includes(p.id),
						)
						.map((p) => p.id),
				),
			);

			return (
				<Layout>
					<div className="data-empty">
						<div className="mb-8">
							<Clock className="size-16 text-muted-foreground mx-auto mb-4" />
							<h2 className="text-2xl font-semibold mb-2">
								Extract hours data from platforms
							</h2>
							<p className="text-muted-foreground max-w-md mb-6">
								Visit the analytics pages of your models to extract hours data.
								Click on the platform links below:
							</p>
						</div>

						<div className="grid gap-4 w-full max-w-2xl">
							{Array.from(uniquePlatforms).map((platform) => {
								const modelNames = models
									.filter((model) =>
										model.platform.some((p) => p.id === platform),
									)
									.map(
										(model) =>
											model.platform.find((p) => p.id === platform)?.userName,
									)
									.filter(Boolean);

								return (
									<Card key={platform} className="text-left">
										<CardHeader className="pb-3">
											<CardTitle className="text-lg capitalize flex items-center gap-2">
												{platform}
												<ExternalLink className="size-4" />
											</CardTitle>
											<CardDescription>
												Models: {modelNames.join(", ")}
											</CardDescription>
										</CardHeader>
										<CardContent className="pt-0">
											<div className="flex flex-wrap gap-2">
												{modelNames.map((username) => (
													<Button
														key={username}
														variant="outline"
														size="sm"
														asChild
														className="gap-2"
													>
														<a
															href={`${platformUrls[platform as keyof typeof platformUrls]}/${username}`}
															target="_blank"
															rel="noopener noreferrer"
														>
															<ExternalLink className="size-3" />
															{username}
														</a>
													</Button>
												))}
											</div>
										</CardContent>
									</Card>
								);
							})}
						</div>
					</div>
				</Layout>
			);
		}

		// Si no hay modelos, mostrar el estado de agregar modelo
		return (
			<Layout>
				<div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
					<div className="mb-6">
						<Clock className="size-16 text-muted-foreground mx-auto mb-4" />
						<h2 className="text-2xl font-semibold mb-2">No hours data found</h2>
						<p className="text-muted-foreground max-w-md mb-6">
							Start tracking your hours by adding models and recording your work
							sessions. Your analytics will appear here once you begin logging
							data.
						</p>
						<Button onClick={() => setIsAddingModel(true)} className="gap-2">
							<Plus className="size-4" />
							Add Your First Model
						</Button>
					</div>
				</div>
				<AddModelDialog />
			</Layout>
		);
	}

	return (
		<Layout>
			<div className="px-6 pb-2">
				{/* Header con controles */}
				<div className="flex justify-between items-center gap-x-2 text-sm py-2">
					<ModelSelector
						allHours={allHours}
						onModelSelect={setData}
						onAllModelsChange={setIsAllModels}
					/>

					<div className="flex items-center gap-x-2">
						<ViewToggle
							currentView={viewMode}
							onViewChange={setViewMode}
							isAllModels={isAllModels}
						/>
						<Button
							variant="ghost"
							size="icon"
							onClick={handleCopyTable}
							disabled={isAllModels}
						>
							<Copy />
						</Button>
						<DateFilter
							dateRange={dateRange}
							onDateRangeChange={onDateRangeChange}
							preset={preset}
							onPresetChange={onPresetChange}
						/>
					</div>
				</div>
				{!isAllModels && data.length !== 0 && (
					<HoursStats data={filteredData} />
				)}
				{isAllModels ? (
					<HoursGrid data={filteredGridData} />
				) : viewMode === "table" ? (
					<HoursTable
						ref={tableRef}
						data={data.length === 0 ? [] : filteredData}
						dateRange={dateRange}
					/>
				) : (
					<HoursChart data={data.length === 0 ? [] : filteredData} />
				)}
			</div>
		</Layout>
	);
}
// Registros analizados: 16 sesiones entre el 24 jun y el 16 jul de 2025.

// Desviación estándar: ≈1 h 03 min → la mayoría de sesiones fluctúan ±1 h respecto al promedio.

// Sesiones ≥ 4 h: 8 de 16 (50 %).

// Distribución mensual:

// Julio (1‑16): 36 h 33 min ↔ 66 % del total.

// Junio (24‑30): 24 h 06 min ↔ 34 % del total.

// Mar 14.2 h, Sáb 10.7 h, Vie 10.6 h → picos de actividad.

// Mié es el día de menor uso (2.1 h).

// Estos indicadores permiten ver tu carga típica (≈4 h) y los días con mayor desempeño, útiles para planificar descansos o metas de productividad.
