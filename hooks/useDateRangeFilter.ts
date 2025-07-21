import { getLocalTimeZone } from "@internationalized/date";
import { useMemo } from "react";
import type { DateRange } from "react-aria-components";

/**
 * Hook genérico para filtrar arrays por rango de fechas con soporte para timezone de Colombia
 * Caja negra reutilizable que maneja todo el parseo y comparación de fechas
 */
export function useDateRangeFilter<T>(
  data: T[],
  dateRange: DateRange | null,
  getDateFromItem: (item: T) => Date | string | null
) {
  return useMemo(() => {
    if (!dateRange?.start || !dateRange?.end) {
      return data;
    }

    // Convert CalendarDate to JavaScript Date for comparison
    const startDate = dateRange.start.toDate(getLocalTimeZone());
    const endDate = dateRange.end.toDate(getLocalTimeZone());

    // Set time to beginning and end of day for proper comparison
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    return data.filter((item) => {
      const itemDateValue = getDateFromItem(item);
      const parsedDate = parseEntryDate(itemDateValue);
      if (!parsedDate) return false;

      const itemTime = parsedDate.getTime();
      const startTime = startDate.getTime();
      const endTime = endDate.getTime();

      return itemTime >= startTime && itemTime <= endTime;
    });
  }, [dateRange, data, getDateFromItem]);
}

/**
 * Parse entry date maintaining Colombia timezone (UTC-5)
 * Evita conversiones UTC que causan cambios de día
 */
function parseEntryDate(dateValue: Date | string | null): Date | null {
  if (!dateValue) return null;

  let entryYear: number, entryMonth: number, entryDay: number;

  // If it's already a Date object, extract local components
  if (dateValue instanceof Date) {
    entryYear = dateValue.getFullYear();
    entryMonth = dateValue.getMonth();
    entryDay = dateValue.getDate();
  } else {
    // If it's a string, parse it directly without timezone conversion
    const dateStr = dateValue.toString();
    if (dateStr.includes("-")) {
      const parts = dateStr.split("T")[0].split("-");
      entryYear = parseInt(parts[0]);
      entryMonth = parseInt(parts[1]) - 1; // JavaScript months are 0-indexed
      entryDay = parseInt(parts[2]);
    } else {
      // Fallback: try Date parsing but extract local components
      const date = new Date(dateStr);
      if (!Number.isNaN(date.getTime())) {
        entryYear = date.getFullYear();
        entryMonth = date.getMonth();
        entryDay = date.getDate();
      } else {
        return null;
      }
    }
  }

  // Create normalized date at local midnight to avoid timezone issues
  return new Date(entryYear, entryMonth, entryDay);
}
