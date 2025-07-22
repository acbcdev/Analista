import { getLocalTimeZone } from "@internationalized/date";
import { forwardRef } from "react";
import type { DateRange } from "react-aria-components";
import {
	Table,
	TableBody,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { Hours } from "@/types";

interface HoursTableProps {
	data: Hours[];
	dateRange: DateRange | null;
	ref?: React.Ref<HTMLTableElement>;
}

export const HoursTable = ({ data, dateRange, ref }: HoursTableProps) => {
	const hours = data.reduce((acc, item) => acc + item.hour, 0);
	const minutes = data.reduce((acc, item) => acc + item.minutes, 0);
	const total = (hours * 60 + minutes) / 60;

	const formatDateRange = () => {
		if (!dateRange?.start || !dateRange?.end) return "no range selected";
		return `${dateRange.start.toDate(getLocalTimeZone()).toLocaleDateString("es-ES")} - ${dateRange.end.toDate(getLocalTimeZone()).toLocaleDateString("es-ES")}`;
	};

	return (
		<div className="border rounded-md overflow-hidden">
			<Table className="w-full" ref={ref}>
				<TableHeader>
					<TableRow>
						<TableHead className="w-[100px]">Date</TableHead>
						<TableHead>Hours</TableHead>
						<TableHead>Minutes</TableHead>
						<TableHead className="text-right">Time</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{data.length === 0 ? (
						<TableRow>
							<TableCell
								colSpan={4}
								className="text-center py-8 text-muted-foreground"
							>
								No entries found for the selected date range (
								{formatDateRange()})
							</TableCell>
						</TableRow>
					) : (
						data.map((item, index) => (
							<TableRow key={`${item.name}-${item.date}-${index}`}>
								<TableCell className="font-medium">{item.name}</TableCell>
								<TableCell>{item.hour}</TableCell>
								<TableCell>{item.minutes}</TableCell>
								<TableCell className="text-right">{item.time}</TableCell>
							</TableRow>
						))
					)}
				</TableBody>
				{data.length > 0 && (
					<TableFooter>
						<TableRow>
							<TableHead className="w-[100px]">Totals</TableHead>
							<TableHead>{hours}</TableHead>
							<TableHead>{minutes}</TableHead>
							<TableHead className="text-right">{total.toFixed(1)}</TableHead>
						</TableRow>
					</TableFooter>
				)}
			</Table>
		</div>
	);
};

HoursTable.displayName = "HoursTable";
