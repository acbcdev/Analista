import { useState } from "react";
import type { DateRange } from "react-aria-components";

export type PresetPeriod =
	| "thisweek"
	| "this15days"
	| "thismonth"
	| "custom"
	| "all";

export function useDateFilter() {
	const [dateRange, setDateRange] = useState<DateRange | null>(null);
	const [preset, setPreset] = useState<PresetPeriod>("all");

	const onDateRangeChange = (range: DateRange | null) => {
		setDateRange(range);
	};

	const onPresetChange = (newPreset: PresetPeriod) => {
		setPreset(newPreset);
	};

	return {
		dateRange,
		onDateRangeChange,
		preset,
		onPresetChange,
	};
}
