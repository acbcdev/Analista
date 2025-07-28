import { Clock, Copy, ExternalLink } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CBHOURS, SODAHOURS_URL, STRIPHOURS_URL } from "@/const/url";
import { DateFilter } from "@/entrypoints/dashboard/components/DateFilter";

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
import { EmptyState } from "../EmptyState";
import { HoursChart } from "./HoursChart";
import { HoursGrid } from "./HoursGrid";
import HoursStats from "./HoursStats";
import { HoursTable } from "./HoursTable";
import { PlatformSelector } from "./PlatformSelector";
import { PlatformEmptyState } from "./PlatformEmptyState";

/**
 * Componente principal para visualizar y filtrar las horas trabajadas
 * Refactorizado como una caja negra reutilizable con responsabilidades separadas
 */
export function HoursView() {
const allHours = useStorage<HoursStorage[]>("hours", []);
const [data, setData] = useState<Hours[]>([]);
const [viewMode, setViewMode] = useState<ViewMode>("table");
const [isAllModels, setIsAllModels] = useState<boolean>(false);
const [platform, setPlatform] = useState<string>("all");
const tableRef = useRef<HTMLTableElement>(null);
const { dateRange, onDateRangeChange, preset, onPresetChange } = useDateFilter();
const setIsAddingModel = useModelsStore((state) => state.setIsAddingModel);
const models = useModelsStore((state) => state.models);

// Filtrar modelos por plataforma seleccionada
const filteredModels = useMemo(() => {
	if (platform === "all") return models;
	return models.filter((model) =>
		model.platform.some((p) => p.id === platform)
	);
}, [models, platform]);

// Filtrar datos de horas por plataforma seleccionada
const filteredHours = useMemo(() => {
	if (platform === "all") return allHours;
	return allHours.filter((hourStorage) => hourStorage.platform === platform);
}, [allHours, filteredModels, platform]);

const filteredData = useDateRangeFilter(
	data,
	dateRange,
	(item) => item.name || null,
);

	// Caja negra: transformar datos del storage

	// Para la vista grid, necesitamos todos los datos con información del modelo
	const allModelsData = useMemo(() => {
		const result: (Hours & { modelName: string })[] = [];
		filteredHours.forEach((hourStorage) => {
			hourStorage.data.forEach((hour) => {
				result.push({
					...hour,
					modelName: hourStorage.name, // Nombre del modelo
				});
			});
		});
		return result;
	}, [filteredHours]);

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
		if (filteredModels.length > 0) {
			return <PlatformEmptyState filteredModels={filteredModels} />;
		}

		return (
			<EmptyState
				icon={Clock}
				title={"No hours data found"}
				description="Start tracking your hours by adding models and recording your work
						sessions. Your analytics will appear here once you begin logging
						data."
				actionLabel="Add Your First Model"
				onAction={() => setIsAddingModel(true)}
			/>
		);
	}

	return (
		<>
			<div className="px-6 pb-2">
				{/* Header con controles */}
				<div className="flex justify-between items-center gap-x-2 text-sm py-2">
					<div className="flex items-center gap-x-2">
						<PlatformSelector 
							selectedPlatform={platform} 
							onPlatformChange={
								setPlatform

							} 
						/>
					<ModelSelector
						allHours={filteredHours}
						onModelSelect={setData}
						onAllModelsChange={setIsAllModels}
					/>
					</div>
				
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
		</>
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
