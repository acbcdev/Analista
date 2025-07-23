import {
	endOfMonth,
	endOfWeek,
	getLocalTimeZone,
	startOfMonth,
	startOfWeek,
	today,
} from "@internationalized/date";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import type { DateRange } from "react-aria-components";
import { Button } from "@/components/ui/button";
import { RangeCalendar } from "@/components/ui/calendar-rac";
import {
	Command,
	CommandGroup,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { RANGES_DATES } from "@/const/range";
import type { PresetPeriod } from "@/hooks/useDateFilter";
import { cn } from "@/lib/utils";

interface DateFilterProps {
	dateRange: DateRange | null;
	preset: PresetPeriod;
	onDateRangeChange: (range: DateRange | null) => void;
	onPresetChange: (preset: PresetPeriod) => void;
}

export function DateFilter({
	dateRange,
	preset,
	onDateRangeChange,
	onPresetChange,
}: DateFilterProps) {
	const [open, setOpen] = useState(false);
	const [value, setValue] = useState(preset);
	const [tempDateRange, setTempDateRange] = useState<DateRange | null>(
		dateRange,
	);

	const now = useMemo(() => today(getLocalTimeZone()), []);

	const presetRangeCalculators = useMemo(
		() => ({
			thisweek: (): DateRange => ({
				start: startOfWeek(now, "es-ES"), // Starts on Monday
				end: endOfWeek(now, "es-ES"),
			}),
			lastweek: (): DateRange => ({
				start: startOfWeek(now.subtract({ weeks: 1 }), "es-ES"), // Starts on Monday
				end: endOfWeek(now.subtract({ weeks: 1 }), "es-ES"),
			}),
			this15days: (): DateRange => {
				// Determinar si estamos en la primera quincena (1-15) o segunda quincena (16-fin)
				const currentDay = now.day;
				if (currentDay <= 15) {
					// Primera quincena: del 1 al 15
					return {
						start: startOfMonth(now),
						end: startOfMonth(now).add({ days: 14 }), // día 15
					};
				} else {
					// Segunda quincena: del 16 al fin del mes
					return {
						start: startOfMonth(now).add({ days: 15 }), // día 16
						end: endOfMonth(now),
					};
				}
			},

			thismonth: (): DateRange => ({
				start: startOfMonth(now),
				end: endOfMonth(now),
			}),
			all: (): DateRange | null => null, // No range, all data
		}),
		[now],
	);

	const calculatePresetRange = useCallback(
		(presetValue: PresetPeriod): DateRange | null => {
			const calculator =
				presetRangeCalculators[
					presetValue as keyof typeof presetRangeCalculators
				];
			return calculator ? calculator() : dateRange;
		},
		[presetRangeCalculators, dateRange],
	);

	const handlePresetChange = useCallback(
		(value: PresetPeriod) => {
			onPresetChange(value);

			if (value === "custom") {
				// Set initial temp range to current date range or reset
				setTempDateRange(dateRange);
			} else {
				const newRange = calculatePresetRange(value);
				onDateRangeChange(newRange);
			}
		},
		[onPresetChange, onDateRangeChange, calculatePresetRange, dateRange],
	);

	const getDisplayValue = () => {
		if (!value) return "Select Range...";

		const range = RANGES_DATES.find((r) => r.value === value);
		if (!range) return "Select Range...";

		if (preset === "custom" && dateRange?.start && dateRange?.end) {
			const formatter = new Intl.DateTimeFormat("es-ES", {
				day: "2-digit",
				month: "2-digit",
				year: "numeric",
			});
			return `${formatter.format(dateRange.start.toDate(getLocalTimeZone()))} - ${formatter.format(dateRange.end.toDate(getLocalTimeZone()))}`;
		}

		return range.label;
	};

	const handleApplyCustomRange = () => {
		if (tempDateRange?.start && tempDateRange?.end) {
			onDateRangeChange(tempDateRange);
		}
		setOpen(false);
	};

	const handleCancelCustomRange = () => {
		setTempDateRange(dateRange);
		setOpen(false);
	};

	return (
		<section>
			<div className="flex justify-start items-center gap-2">
				<Popover open={open} onOpenChange={setOpen}>
					<PopoverTrigger asChild>
						<Button
							variant="outline"
							aria-expanded={open}
							className="w-[220px] justify-between"
						>
							{getDisplayValue()}
							<ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-[200px] p-0">
						<Command>
							<CommandList>
								<CommandGroup>
									{RANGES_DATES.map((range) =>
										range.value === "custom" ? (
											<Popover key={range.value}>
												<PopoverTrigger className="w-full">
													<CommandItem
														key={range.value}
														onSelect={() => {
															handlePresetChange(range.value as PresetPeriod);
															setValue(range.value as PresetPeriod);
														}}
														className={cn("flex justify-between items-center")}
													>
														{range.label}
														{preset === range.value && (
															<CheckIcon className="ml-2 h-4 w-4" />
														)}
													</CommandItem>
												</PopoverTrigger>
												<PopoverContent className="p-4 mx-2" side="left">
													<section>
														<span className="text-sm font-medium ">
															Select Date Range
														</span>
														<div className="space-y-2 mt-4 ">
															<RangeCalendar
																className="rounded-md border "
																value={tempDateRange}
																onChange={setTempDateRange}
															/>
															<div className="flex gap-2">
																<Button
																	variant="outline"
																	onClick={handleCancelCustomRange}
																	className="flex-1"
																	size="sm"
																>
																	Cancel
																</Button>
																<Button
																	onClick={handleApplyCustomRange}
																	disabled={
																		!tempDateRange?.end || !tempDateRange?.start
																	}
																	className="flex-1"
																	size="sm"
																>
																	Apply
																</Button>
															</div>
														</div>
													</section>
												</PopoverContent>
											</Popover>
										) : (
											<CommandItem
												key={range.value}
												onSelect={() => {
													handlePresetChange(range.value as PresetPeriod);
													setValue(range.value as PresetPeriod);
													setOpen(false);
												}}
												className={cn("flex items-center justify-between")}
											>
												{range.label}
												{preset === range.value && (
													<CheckIcon className="ml-2 h-4 w-4" />
												)}
											</CommandItem>
										),
									)}
								</CommandGroup>
							</CommandList>
						</Command>
					</PopoverContent>
				</Popover>
			</div>
		</section>
	);
}
