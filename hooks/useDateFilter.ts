import type { DateRange } from "react-day-picker";

export type PresetPeriod = "thisweek" | "this15days" | "thismonth" | "custom";

export function useDateFilter() {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });
  const [preset, setPreset] = useState<PresetPeriod>("thisweek");

  const onDateRangeChange = (range: DateRange) => {
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
