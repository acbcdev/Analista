import { useMemo } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { FIXED_NUMBER } from "@/const";
import {
	DatePresets,
	formatDateFromString,
	getDateString,
} from "@/lib/dateUtils";
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

		// Obtener todas las fechas únicas y ordenarlas usando la nueva librería
		// Usamos el preset con corrección de día (+1) para solucionar el desfase
		const allDates = [
			...new Set(
				data.map((item) =>
					getDateString(new Date(item.date), DatePresets.withDayOffset(1)),
				),
			),
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

				// Llenar con datos reales usando la misma lógica de fecha
				hours.forEach((hour) => {
					const dateKey = getDateString(
						new Date(hour.date),
						DatePresets.withDayOffset(1),
					);
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

	// Usar la nueva función de formateo
	const formatDate = (dateString: string) => {
		return formatDateFromString(dateString, "display");
	};

	const formatHours = (total: number) => {
		if (total === 0) return "";
		return total.toFixed(FIXED_NUMBER);
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
									const minutes = dayData.minutes>9 ? dayData.minutes : `0${dayData.minutes}`;
									return (
										<TableCell key={date} className={`text-center border-r `}>
											<div className="text-sm">
												{hasData && (
													<div className="font-medium text-chart-1">
														{dayData.hours}:{minutes}
													</div>
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
