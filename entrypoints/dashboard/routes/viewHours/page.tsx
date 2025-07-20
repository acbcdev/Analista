import { isWithinInterval } from "date-fns";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { DateFilter } from "@/entrypoints/dashboard/components/DateFilter";
import Layout from "@/entrypoints/dashboard/components/layout/layout";
import { useDateFilter } from "@/hooks/useDateFilter";
import { useStorage } from "@/hooks/useStorege";
import type { Hours, HoursStorage } from "@/types";
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
export function HoursView() {
	const allkeys = useStorage<Record<string, HoursStorage>>("hours", {});
	const [data, setData] = useState<Hours[]>([]);
	const tableRef = useRef<HTMLTableElement>(null);
	const { dateRange, onDateRangeChange, preset, onPresetChange } =
		useDateFilter();
	console.log("-".repeat(50));
	// Filter streams by date range
	const allHours = Object.values(allkeys || {});
	const filteredByDateRange = useMemo(() => {
		if (!dateRange.from || !dateRange.to) {
			return data;
		}

		return data.filter((entry) => {
			// Using createdAt timestamp for date filtering
			if (entry) {
				console.log({
					hours: entry.name,
					from: dateRange.from,
					to: dateRange.to,
				});
				const date = new Date(entry.name);
				date.setHours(24);
				return isWithinInterval(date, {
					start: dateRange.from as Date,
					end: dateRange.to as Date,
				});
			}
			return true; // Include streams without createdAt for now
		});
	}, [dateRange.from, dateRange.to, data]);

	const hours = filteredByDateRange.reduce((acc, item) => acc + item.hour, 0);
	const minutes = filteredByDateRange.reduce(
		(acc, item) => acc + item.minutes,
		0,
	);
	const total = (hours * 60 + minutes) / 60;

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
			<div className="px-6  pb-2">
				<div className="flex justify-between items-center gap-x-2 text-sm py-2 ">
					<Select
						onValueChange={async (value) => {
							const hours = allHours.find((hours) => hours.name === value);
							setData(hours?.data || []);
						}}
					>
						<SelectTrigger>
							<SelectValue placeholder="Select a Model" />
						</SelectTrigger>
						<SelectContent>
							{allHours?.map((hours: HoursStorage) => (
								<SelectItem key={hours.createAt} value={hours.name}>
									{hours.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<div className="flex items-center gap-x-2">
						<DateFilter
							dateRange={dateRange}
							onDateRangeChange={onDateRangeChange}
							preset={preset}
							onPresetChange={onPresetChange}
						/>

						<Button
							variant={"ghost"}
							size={"icon"}
							onClick={() => {
								navigator.clipboard.writeText(
									tableRef.current?.innerText || "",
								);
								toast.success("Copied to clipboard");
							}}
						>
							<Copy />
						</Button>
					</div>
				</div>
				<div className="border rounded-md overflow-hidden ">
					<Table className="w-full" ref={tableRef}>
						<TableHeader>
							<TableRow>
								<TableHead className="w-[100px]">Date</TableHead>
								<TableHead>Hours</TableHead>
								<TableHead>Minutes</TableHead>
								<TableHead className="text-right">Time</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredByDateRange.map((item) => (
								<TableRow key={item.name}>
									<TableCell className="font-medium">{item.name}</TableCell>
									<TableCell>{item.hour}</TableCell>
									<TableCell>{item.minutes}</TableCell>
									<TableCell className="text-right">{item.time}</TableCell>
								</TableRow>
							))}
						</TableBody>
						{filteredByDateRange.length !== 0 && (
							<TableFooter>
								<TableRow>
									<TableHead className="w-[100px]">Totals</TableHead>
									<TableHead>{hours}</TableHead>
									<TableHead>{minutes}</TableHead>
									<TableHead className="text-right">{total}</TableHead>
								</TableRow>
							</TableFooter>
						)}
					</Table>
				</div>
			</div>
		</Layout>
	);
}
