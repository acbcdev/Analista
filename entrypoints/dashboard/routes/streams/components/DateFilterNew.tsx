import { useDebounce } from "@uidotdev/usehooks";
import { addDays, endOfDay, startOfDay } from "date-fns";
import { Calendar, CalendarDays, Clock } from "lucide-react";
import { useCallback, useEffect } from "react";
import { DatePickerDemo } from "@/components/ui/date-picker";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

type DateRange = {
	from: Date | undefined;
	to: Date | undefined;
};

type PresetPeriod = "7days" | "15days" | "30days" | "custom";

interface DateFilterProps {
	dateRange: DateRange;
	onDateRangeChange: (range: DateRange) => void;
	preset: PresetPeriod;
	onPresetChange: (preset: PresetPeriod) => void;
}

const presetOptions = [
	{ value: "7days", label: "Last 7 days", icon: Clock },
	{ value: "15days", label: "Last 15 days", icon: CalendarDays },
	{ value: "30days", label: "Last 30 days", icon: Calendar },
	{ value: "custom", label: "Custom range", icon: Calendar },
];

export function DateFilter({
	dateRange,
	onDateRangeChange,
	preset,
	onPresetChange,
}: DateFilterProps) {
	// Debounce the date range changes
	const debouncedDateRange = useDebounce(dateRange, 300);

	const applyPreset = useCallback(
		(presetValue: PresetPeriod) => {
			const today = new Date();
			let from: Date;
			const to = endOfDay(today);

			switch (presetValue) {
				case "7days":
					from = startOfDay(addDays(today, -7));
					break;
				case "15days":
					from = startOfDay(addDays(today, -15));
					break;
				case "30days":
					from = startOfDay(addDays(today, -30));
					break;
				case "custom":
					return;
				default:
					from = startOfDay(addDays(today, -7));
			}

			onDateRangeChange({ from, to });
		},
		[onDateRangeChange],
	);

	const handlePresetChange = (value: PresetPeriod) => {
		onPresetChange(value);
		if (value !== "custom") {
			applyPreset(value);
		}
	};

	// Auto-execute filter when debounced date range changes
	useEffect(() => {
		if (
			preset === "custom" &&
			debouncedDateRange.from &&
			debouncedDateRange.to
		) {
			onDateRangeChange(debouncedDateRange);
		}
	}, [debouncedDateRange, preset, onDateRangeChange]);

	useEffect(() => {
		if (preset !== "custom" && (!dateRange.from || !dateRange.to)) {
			applyPreset(preset);
		}
	}, [preset, dateRange.from, dateRange.to, applyPreset]);

	return (
		<div className="mb-6">
			<div className="flex flex-col gap-4 sm:flex-row sm:justify-end sm:items-center">
				<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
					<span className="text-sm font-medium whitespace-nowrap">
						Time Period:
					</span>
					<Select value={preset} onValueChange={handlePresetChange}>
						<SelectTrigger className="w-full sm:w-[180px]">
							<SelectValue placeholder="Select period" />
						</SelectTrigger>
						<SelectContent>
							{presetOptions.map((option) => {
								const Icon = option.icon;
								return (
									<SelectItem key={option.value} value={option.value}>
										<div className="flex items-center space-x-2">
											<Icon className="h-4 w-4" />
											<span>{option.label}</span>
										</div>
									</SelectItem>
								);
							})}
						</SelectContent>
					</Select>
				</div>

				{preset === "custom" && (
					<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
						<div className="flex flex-col gap-1">
							<span className="text-xs text-muted-foreground">From</span>
							<DatePickerDemo
								date={dateRange.from}
								setDate={(date: Date | undefined) =>
									onDateRangeChange({ ...dateRange, from: date })
								}
							/>
						</div>
						<div className="flex flex-col gap-1">
							<span className="text-xs text-muted-foreground">To</span>
							<DatePickerDemo
								date={dateRange.to}
								setDate={(date: Date | undefined) =>
									onDateRangeChange({ ...dateRange, to: date })
								}
							/>
						</div>
					</div>
				)}

				{preset !== "custom" && dateRange.from && dateRange.to && (
					<div className="text-xs text-muted-foreground flex items-center gap-1">
						<Calendar className="h-3 w-3" />
						<span>
							{dateRange.from.toLocaleDateString()} -{" "}
							{dateRange.to.toLocaleDateString()}
						</span>
					</div>
				)}
			</div>
		</div>
	);
}
