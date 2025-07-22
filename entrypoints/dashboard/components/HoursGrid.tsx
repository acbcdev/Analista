import { useMemo } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { Hours } from "@/types";

interface HoursGridProps {
	data: (Hours & { modelName?: string })[];
}

interface GridData {
	model: string;
	days: Record<string, { hours: number; minutes: number; total: number }>;
	weekTotal: number;
}

export function HoursGrid({ data }: HoursGridProps) {
	// Procesar datos para crear la estructura de grid
	const gridData = useMemo(() => {
		// Función para obtener fecha local en formato YYYY-MM-DD
		const getLocalDateString = (date: Date) => {
			// Crear fecha ajustando un día adelante para corregir el desfase
			const adjustedDate = new Date(date);
			adjustedDate.setDate(adjustedDate.getDate() + 1);

			const year = adjustedDate.getFullYear();
			const month = String(adjustedDate.getMonth() + 1).padStart(2, "0");
			const day = String(adjustedDate.getDate()).padStart(2, "0");
			return `${year}-${month}-${day}`;
		};

		// Agrupar por modelo (usando modelName si está disponible, sino usar name)
		const modelGroups = data.reduce(
			(acc, item) => {
				const model = item.modelName || item.name || "Unknown";
				if (!acc[model]) {
					acc[model] = [];
				}
				acc[model].push(item);
				return acc;
			},
			{} as Record<string, (Hours & { modelName?: string })[]>,
		);

		// Obtener todas las fechas únicas y ordenarlas
		const allDates = [
			...new Set(data.map((item) => getLocalDateString(new Date(item.date)))),
		].sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

		// Crear estructura de grid
		const gridResult: GridData[] = Object.entries(modelGroups).map(
			([model, hours]) => {
				const days: Record<
					string,
					{ hours: number; minutes: number; total: number }
				> = {};
				let weekTotal = 0;

				// Inicializar todos los días con 0
				allDates.forEach((date) => {
					days[date] = { hours: 0, minutes: 0, total: 0 };
				});

				// Llenar con datos reales
				hours.forEach((hour) => {
					const dateKey = getLocalDateString(new Date(hour.date));
					if (days[dateKey]) {
						days[dateKey].hours += hour.hour;
						days[dateKey].minutes += hour.minutes;
						days[dateKey].total += hour.hour + hour.minutes / 60;
						weekTotal += hour.hour + hour.minutes / 60;
					}
				});

				return { model, days, weekTotal };
			},
		);

		return { gridResult, allDates };
	}, [data]);

	const formatDate = (dateString: string) => {
		// dateString viene en formato YYYY-MM-DD, lo convertimos a fecha local de Colombia
		const [year, month, day] = dateString.split("-");
		const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
		return date.toLocaleDateString("es-CO", {
			weekday: "short",
			day: "numeric",
			month: "short",
		});
	};

	const formatHours = (total: number) => {
		if (total === 0) return "";
		return total.toFixed(1);
	};

	if (data.length === 0) {
		return (
			<div className="border rounded-md p-8 text-center text-muted-foreground">
				No data available for grid view. Select a model and date range to view
				the grid.
			</div>
		);
	}

	return (
		<div className="border rounded-md overflow-hidden">
			<div className="overflow-x-auto">
				<Table className="w-full">
					<TableHeader>
						<TableRow>
							<TableHead className="sticky left-0 bg-background border-r font-semibold min-w-[200px]">
								Model
							</TableHead>
							{gridData.allDates.map((date) => (
								<TableHead
									key={date}
									className="text-center min-w-[80px] border-r"
								>
									{formatDate(date)}
								</TableHead>
							))}
							<TableHead className="text-center font-semibold bg-muted min-w-[100px]">
								Total
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{gridData.gridResult.map((row) => (
							<TableRow key={row.model}>
								<TableCell className="sticky left-0 bg-background border-r font-medium">
									{row.model}
								</TableCell>
								{gridData.allDates.map((date) => {
									const dayData = row.days[date];
									const hasData = dayData && dayData.total > 0;
									return (
										<TableCell key={date} className={`text-center border-r `}>
											<div className="text-sm">
												{hasData && (
													<>
														<div className="font-medium text-chart-1">
															{formatHours(dayData.total)}h
														</div>
														{dayData.minutes > 0 && (
															<div className="text-xs text-chart-2">
																+{dayData.minutes}m
															</div>
														)}
													</>
												)}
											</div>
										</TableCell>
									);
								})}
								<TableCell className="text-center font-semibold bg-muted">
									{formatHours(row.weekTotal)}h
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
