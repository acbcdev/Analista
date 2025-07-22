import { Copy } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DateFilter } from "@/entrypoints/dashboard/components/DateFilter";
import { HoursChart } from "@/entrypoints/dashboard/components/HoursChart";
import { HoursGrid } from "@/entrypoints/dashboard/components/HoursGrid";
import { HoursTable } from "@/entrypoints/dashboard/components/HoursTable";
import Layout from "@/entrypoints/dashboard/components/layout/layout";
import { ModelSelector } from "@/entrypoints/dashboard/components/ModelSelector";
import {
	type ViewMode,
	ViewToggle,
} from "@/entrypoints/dashboard/components/ViewToggle";
import { useDateFilter } from "@/hooks/useDateFilter";
import { useDateRangeFilter } from "@/hooks/useDateRangeFilter";
import { useStorage } from "@/hooks/useStorege";
import type { Hours, HoursStorage } from "@/types";

/**
 * Componente principal para visualizar y filtrar las horas trabajadas
 * Refactorizado como una caja negra reutilizable con responsabilidades separadas
 */
export function HoursView() {
	const allkeys = useStorage<Record<string, HoursStorage>>("hours", {});
	const [data, setData] = useState<Hours[]>([]);
	const [viewMode, setViewMode] = useState<ViewMode>("table");
	const tableRef = useRef<HTMLTableElement>(null);
	const { dateRange, onDateRangeChange, preset, onPresetChange } =
		useDateFilter();

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
		navigator.clipboard.writeText(tableRef.current?.innerText || "");
		toast.success("Copied to clipboard");
	};

	// Estado vacío: mostrar mensaje
	if (!allHours || allHours.length === 0) {
		return (
			<Layout>
				<div className="px-6 pt-10">
					<div className="flex gap-x-2 text-sm">
						<p className="text-lg">No models Found</p>
					</div>
				</div>
			</Layout>
		);
	}

	return (
		<Layout>
			<div className="px-6 pb-2">
				{/* Header con controles */}
				<div className="flex justify-between items-center gap-x-2 text-sm py-2">
					<ModelSelector allHours={allHours} onModelSelect={setData} />

					<div className="flex items-center gap-x-2">
						<ViewToggle currentView={viewMode} onViewChange={setViewMode} />
						<Button variant="ghost" size="icon" onClick={handleCopyTable}>
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

				{/* Contenido principal */}
				{viewMode === "table" ? (
					<HoursTable
						ref={tableRef}
						data={data.length === 0 ? [] : filteredData}
						dateRange={dateRange}
					/>
				) : viewMode === "grid" ? (
					<HoursGrid data={filteredGridData} />
				) : (
					<HoursChart data={data.length === 0 ? [] : filteredData} />
				)}
			</div>
		</Layout>
	);
}
// Registros analizados: 16 sesiones entre el 24 jun y el 16 jul de 2025.

// Tiempo total conectado: 60 h 39 min.

// Promedio por sesión: 3 h 47 min.

// Mediana: 3 h 55 min (las sesiones típicas rondan las 4 h).

// Sesión más larga: 5 h 18 min (01 jul).

// Sesión más corta: 1 h 45 min (12 jul).

// Desviación estándar: ≈1 h 03 min → la mayoría de sesiones fluctúan ±1 h respecto al promedio.

// Sesiones ≥ 4 h: 8 de 16 (50 %).

// Distribución mensual:

// Julio (1‑16): 36 h 33 min ↔ 66 % del total.

// Junio (24‑30): 24 h 06 min ↔ 34 % del total.

// Patrón semanal (suma de horas):

// Mar 14.2 h, Sáb 10.7 h, Vie 10.6 h → picos de actividad.

// Mié es el día de menor uso (2.1 h).

// Estos indicadores permiten ver tu carga típica (≈4 h) y los días con mayor desempeño, útiles para planificar descansos o metas de productividad.
