import {
	addDays,
	endOfMonth,
	endOfWeek,
	format,
	startOfMonth,
	startOfToday,
	startOfWeek,
} from "date-fns";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { DatePickerDemo } from "@/components/ui/date-picker";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export type DateRange = {
	from: Date | undefined;
	to: Date | undefined;
};

export type PresetPeriod = "thisweek" | "this15days" | "thismonth" | "custom";

interface DateFilterProps {
	dateRange: DateRange;
	preset: PresetPeriod;
	onDateRangeChange: (range: DateRange) => void;
	onPresetChange: (preset: PresetPeriod) => void;
}

export function DateFilter({
	dateRange,
	preset,
	onDateRangeChange,
	onPresetChange,
}: DateFilterProps) {
	const [isPopoverOpen, setIsPopoverOpen] = useState(false);

	const calculatePresetRange = useCallback(
		(presetValue: PresetPeriod): DateRange => {
			const today = startOfToday();

			switch (presetValue) {
				case "thisweek":
					return {
						from: startOfWeek(today, { weekStartsOn: 1 }),
						to: endOfWeek(today, { weekStartsOn: 1 }),
					};
				case "this15days":
					return {
						from: startOfMonth(today),
						to: addDays(startOfMonth(today), 14),
					};
				case "thismonth":
					return {
						from: startOfMonth(today),
						to: endOfMonth(today),
					};
				case "custom":
				default:
					return dateRange;
			}
		},
		[dateRange],
	);

	const handlePresetChange = useCallback(
		(value: PresetPeriod) => {
			onPresetChange(value);

			if (value === "custom") {
				setIsPopoverOpen(true);
			} else {
				const newRange = calculatePresetRange(value);
				onDateRangeChange(newRange);
			}
		},
		[onPresetChange, onDateRangeChange, calculatePresetRange],
	);

	const getDisplayValue = () => {
		switch (preset) {
			case "thisweek":
				return "This week";
			case "this15days":
				return "These 15 days";
			case "thismonth":
				return "This month";
			case "custom":
				if (dateRange.from && dateRange.to) {
					return `${format(dateRange.from, "dd/MM/yyyy")} - ${format(dateRange.to, "dd/MM/yyyy")}`;
				}
				return "Custom range";
			default:
				return "Select period";
		}
	};

	return (
		<div className="mb-6">
			<div className="flex justify-end items-center gap-2">
				<span className="text-sm font-medium text-muted-foreground">
					Filter:
				</span>

				<Select value={preset} onValueChange={handlePresetChange}>
					<SelectTrigger className="w-[240px]">
						<SelectValue>{getDisplayValue()}</SelectValue>
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="thisweek">This week</SelectItem>
						<SelectItem value="this15days">These 15 days</SelectItem>
						<SelectItem value="thismonth">This month</SelectItem>
						<SelectItem value="custom">Custom range</SelectItem>
					</SelectContent>
				</Select>
				<Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
					<PopoverTrigger asChild>
						<Button variant="outline" size="sm">
							Select Range
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-auto p-4" align="end">
						<div className="space-y-3">
							<span className="text-sm font-medium">Select Date Range</span>
							<div className="grid grid-cols-2 gap-3">
								<div className="space-y-1">
									<span className="text-xs font-medium text-muted-foreground">
										From
									</span>
									<DatePickerDemo
										date={dateRange.from}
										setDate={(date: Date | undefined) =>
											onDateRangeChange({ ...dateRange, from: date })
										}
									/>
								</div>
								<div className="space-y-1">
									<span className="text-xs font-medium text-muted-foreground">
										To
									</span>
									<DatePickerDemo
										date={dateRange.to}
										setDate={(date: Date | undefined) =>
											onDateRangeChange({ ...dateRange, to: date })
										}
									/>
								</div>
							</div>
							<div className="flex gap-2">
								<Button
									variant="outline"
									onClick={() => setIsPopoverOpen(false)}
									className="flex-1"
									size="sm"
								>
									Cancel
								</Button>
								<Button
									onClick={() => setIsPopoverOpen(false)}
									disabled={!dateRange.from || !dateRange.to}
									className="flex-1"
									size="sm"
								>
									Apply
								</Button>
							</div>
						</div>
					</PopoverContent>
				</Popover>
			</div>
		</div>
	);
}
