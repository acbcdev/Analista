import {
	addDays,
	endOfMonth,
	endOfWeek,
	startOfMonth,
	startOfToday,
	startOfWeek,
} from "date-fns";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandGroup,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { DatePicker } from "@/components/ui/date-picker";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

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

const rangesDates = [
	{
		label: "This week",
		value: "thisweek",
	},
	{
		label: "These 15 days",
		value: "this15days",
	},
	{
		label: "This month",
		value: "thismonth",
	},
	{
		label: "Custom range",
		value: "custom",
	},
];

export function DateFilter({
	dateRange,
	preset,
	onDateRangeChange,
	onPresetChange,
}: DateFilterProps) {
	const [open, setOpen] = useState(false);
	const [value, setValue] = useState("");
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
			} else {
				const newRange = calculatePresetRange(value);
				onDateRangeChange(newRange);
			}
		},
		[onPresetChange, onDateRangeChange, calculatePresetRange],
	);

	return (
		<section>
			<div className="flex justify-start items-center gap-2">
				<span className="text-sm font-medium text-muted-foreground">
					Filter:
				</span>

				<Popover open={open} onOpenChange={setOpen}>
					<PopoverTrigger asChild>
						<Button
							variant="outline"
							aria-expanded={open}
							className="w-[200px] justify-between"
						>
							{value
								? rangesDates.find((range) => range.value === value)?.label
								: "Select Range..."}
							<ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-[200px] p-0">
						<Command>
							<CommandList>
								<CommandGroup>
									{rangesDates.map((range) =>
										range.value === "custom" ? (
											<Popover key={range.value}>
												<PopoverTrigger>
													<CommandItem
														key={range.value}
														onSelect={() => {
															handlePresetChange(range.value as PresetPeriod);
															setValue(range.value);
														}}
														className={cn("flex items-center justify-between")}
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
														<div className="space-y-2 mt-4">
															<div className="space-y-1 flex justify-between items-center">
																<span className="text-xs font-medium text-muted-foreground">
																	From:
																</span>
																<DatePicker
																	date={dateRange.from}
																	setDate={(date: Date | undefined) =>
																		onDateRangeChange({
																			...dateRange,
																			from: date,
																		})
																	}
																/>
															</div>
															<div className="space-y-1 flex justify-between items-center">
																<span className="text-xs font-medium text-muted-foreground">
																	To
																</span>
																<DatePicker
																	date={dateRange.to}
																	setDate={(date: Date | undefined) =>
																		onDateRangeChange({
																			...dateRange,
																			to: date,
																		})
																	}
																/>
															</div>
															<div className="flex gap-2">
																<Button
																	variant="outline"
																	onClick={() => setOpen(false)}
																	className="flex-1"
																	size="sm"
																>
																	Cancel
																</Button>
																<Button
																	onClick={() => setOpen(false)}
																	disabled={!dateRange.from || !dateRange.to}
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
													setValue(range.value);
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
