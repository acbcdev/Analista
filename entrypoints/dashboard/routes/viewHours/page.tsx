import { Copy } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DateFilter } from "@/entrypoints/dashboard/components/DateFilter";
import { HoursTable } from "@/entrypoints/dashboard/components/HoursTable";
import Layout from "@/entrypoints/dashboard/components/layout/layout";
import { ModelSelector } from "@/entrypoints/dashboard/components/ModelSelector";
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
	const tableRef = useRef<HTMLTableElement>(null);
	const { dateRange, onDateRangeChange, preset, onPresetChange } =
		useDateFilter();

	// Caja negra: filtrado de fechas con timezone de Colombia
	const filteredData = useDateRangeFilter(
		data,
		dateRange,
		(item) => item.date || item.name || null,
	);

	// Caja negra: transformar datos del storage
	const allHours = useMemo(() => Object.values(allkeys || {}), [allkeys]);

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
						<DateFilter
							dateRange={dateRange}
							onDateRangeChange={onDateRangeChange}
							preset={preset}
							onPresetChange={onPresetChange}
						/>
						<Button variant="ghost" size="icon" onClick={handleCopyTable}>
							<Copy />
						</Button>
					</div>
				</div>

				{/* Tabla de datos filtrados */}
				<HoursTable
					ref={tableRef}
					data={data.length === 0 ? [] : filteredData}
					dateRange={dateRange}
				/>
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
// export function HoursView() {
// 	const allkeys = useStorage<Record<string, HoursStorage>>("hours", {});
// 	const [data, setData] = useState<Hours[]>([]);
// 	const tableRef = useRef<HTMLTableElement>(null);
// 	const { dateRange, onDateRangeChange, preset, onPresetChange } =
// 		useDateFilter();
// 	// Filter streams by date range
// 	const allHours = useMemo(() => Object.values(allkeys || {}), [allkeys]);

// 	const filteredByDateRange = useMemo(() => {
// 		if (!dateRange?.start || !dateRange?.end) {
// 			return data;
// 		}

// 		// Convert CalendarDate to JavaScript Date for comparison
// 		const startDate = dateRange.start.toDate(getLocalTimeZone());
// 		const endDate = dateRange.end.toDate(getLocalTimeZone());

// 		// Set time to beginning and end of day for proper comparison
// 		// Start date should be at the very beginning of the day
// 		startDate.setHours(0, 0, 0, 0);
// 		// End date should be at the very end of the day
// 		endDate.setHours(23, 59, 59, 999);

// 		const filtered = data.filter((entry) => {
// 			// COLOMBIA TIMEZONE FIX: Parse dates completely in local time, avoid UTC conversion
// 			let entryYear: number, entryMonth: number, entryDay: number;

// 			// Try to extract date from entry.date or entry.name without UTC conversion
// 			if (entry.date) {
// 				const dateStr = entry.date.toString();
// 				// If it's a string like "2025-07-20", parse it directly without timezone conversion
// 				if (dateStr.includes("-")) {
// 					const parts = dateStr.split("T")[0].split("-"); // Take only the date part, ignore time
// 					entryYear = parseInt(parts[0]);
// 					entryMonth = parseInt(parts[1]) - 1; // JavaScript months are 0-indexed
// 					entryDay = parseInt(parts[2]);
// 				} else {
// 					// If it's already a Date object, extract local components
// 					const date =
// 						entry.date instanceof Date ? entry.date : new Date(entry.date);
// 					entryYear = date.getFullYear();
// 					entryMonth = date.getMonth();
// 					entryDay = date.getDate();
// 				}
// 			} else if (entry.name) {
// 				// Try to parse date from name, avoiding UTC conversion
// 				const nameStr = entry.name.toString();
// 				if (nameStr.includes("-")) {
// 					const parts = nameStr.split("T")[0].split("-");
// 					entryYear = parseInt(parts[0]);
// 					entryMonth = parseInt(parts[1]) - 1;
// 					entryDay = parseInt(parts[2]);
// 				} else {
// 					// Fallback: try Date parsing but extract local components
// 					const date = new Date(entry.name);
// 					if (!Number.isNaN(date.getTime())) {
// 						entryYear = date.getFullYear();
// 						entryMonth = date.getMonth();
// 						entryDay = date.getDate();
// 					} else {
// 						return false;
// 					}
// 				}
// 			} else {
// 				return false;
// 			}

// 			// Extract start and end date components (already in local time)
// 			const startYear = startDate.getFullYear();
// 			const startMonth = startDate.getMonth();
// 			const startDay = startDate.getDate();

// 			const endYear = endDate.getFullYear();
// 			const endMonth = endDate.getMonth();
// 			const endDay = endDate.getDate();

// 			// Create normalized dates at local midnight to avoid timezone issues
// 			const normalizedEntryDate = new Date(entryYear, entryMonth, entryDay);
// 			const normalizedStartDate = new Date(startYear, startMonth, startDay);
// 			const normalizedEndDate = new Date(endYear, endMonth, endDay);

// 			// Use getTime() for more precise comparison
// 			const entryTime = normalizedEntryDate.getTime();
// 			const startTime = normalizedStartDate.getTime();
// 			const endTime = normalizedEndDate.getTime();

// 			// Simple date comparison using timestamps
// 			const isInRange = entryTime >= startTime && entryTime <= endTime;

// 			return isInRange;
// 		});

// 		return filtered;
// 	}, [dateRange, data]);
// 	const hours = filteredByDateRange.reduce((acc, item) => acc + item.hour, 0);
// 	const minutes = filteredByDateRange.reduce(
// 		(acc, item) => acc + item.minutes,
// 		0,
// 	);
// 	const total = (hours * 60 + minutes) / 60;

// 	if (!allHours || allHours.length === 0) {
// 		return (
// 			<Layout>
// 				<div className="px-6 pt-10">
// 					<div className="flex gap-x-2 text-sm">
// 						<p className="text-lg">No models Found</p>
// 					</div>
// 				</div>
// 			</Layout>
// 		);
// 	}

// 	return (
// 		<Layout>
// 			<div className="px-6  pb-2">
// 				<div className="flex justify-between items-center gap-x-2 text-sm py-2 ">
// 					<Select
// 						onValueChange={async (value) => {
// 							const hours = allHours.find((hours) => hours.name === value);
// 							console.log("Selected model data:", hours?.data);
// 							setData(hours?.data || []);
// 						}}
// 					>
// 						<SelectTrigger>
// 							<SelectValue placeholder="Select a Model" />
// 						</SelectTrigger>
// 						<SelectContent>
// 							{allHours?.map((hours: HoursStorage) => (
// 								<SelectItem key={hours.createAt} value={hours.name}>
// 									{hours.name}
// 								</SelectItem>
// 							))}
// 						</SelectContent>
// 					</Select>
// 					<div className="flex items-center gap-x-2">
// 						<DateFilter
// 							dateRange={dateRange}
// 							onDateRangeChange={onDateRangeChange}
// 							preset={preset}
// 							onPresetChange={onPresetChange}
// 						/>

// 						<Button
// 							variant={"ghost"}
// 							size={"icon"}
// 							onClick={() => {
// 								navigator.clipboard.writeText(
// 									tableRef.current?.innerText || "",
// 								);
// 								toast.success("Copied to clipboard");
// 							}}
// 						>
// 							<Copy />
// 						</Button>
// 					</div>
// 				</div>

// 				<div className="border rounded-md overflow-hidden ">
// 					<Table className="w-full" ref={tableRef}>
// 						<TableHeader>
// 							<TableRow>
// 								<TableHead className="w-[100px]">Date</TableHead>
// 								<TableHead>Hours</TableHead>
// 								<TableHead>Minutes</TableHead>
// 								<TableHead className="text-right">Time</TableHead>
// 							</TableRow>
// 						</TableHeader>
// 						<TableBody>
// 							{filteredByDateRange.length === 0 ? (
// 								<TableRow>
// 									<TableCell
// 										colSpan={4}
// 										className="text-center py-8 text-muted-foreground"
// 									>
// 										{data.length === 0
// 											? "No data available. Please select a model first."
// 											: `No entries found for the selected date range (${dateRange?.start ? `${dateRange.start.toDate(getLocalTimeZone()).toLocaleDateString("es-ES")} - ${dateRange.end?.toDate(getLocalTimeZone()).toLocaleDateString("es-ES")}` : "no range selected"})`}
// 									</TableCell>
// 								</TableRow>
// 							) : (
// 								filteredByDateRange.map((item) => (
// 									<TableRow key={`${item.name}-${item.date}`}>
// 										<TableCell className="font-medium">{item.name}</TableCell>
// 										<TableCell>{item.hour}</TableCell>
// 										<TableCell>{item.minutes}</TableCell>
// 										<TableCell className="text-right">{item.time}</TableCell>
// 									</TableRow>
// 								))
// 							)}
// 						</TableBody>
// 						{filteredByDateRange.length !== 0 && (
// 							<TableFooter>
// 								<TableRow>
// 									<TableHead className="w-[100px]">Totals</TableHead>
// 									<TableHead>{hours}</TableHead>
// 									<TableHead>{minutes}</TableHead>
// 									<TableHead className="text-right">{total}</TableHead>
// 								</TableRow>
// 							</TableFooter>
// 						)}
// 					</Table>
// 				</div>
// 			</div>
// 		</Layout>
// 	);
// }
