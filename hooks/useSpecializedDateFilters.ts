import type { DateRange } from "react-aria-components";
import type { Hours } from "@/types";
import { useDateRangeFilter } from "./useDateRangeFilter";

/**
 * Hook especializado para filtrar datos de Hours
 * Wrapper del hook genérico con la lógica específica para extraer fechas de Hours
 */
export function useHoursDateFilter(data: Hours[], dateRange: DateRange | null) {
  return useDateRangeFilter(
    data,
    dateRange,
    (item: Hours) => item.date || item.name || null
  );
}

// Ejemplos de uso con otros tipos de datos:

/**
 * Hook para filtrar streams (ejemplo)
 */
export function useStreamsDateFilter<T extends { createdAt: Date | string }>(
  data: T[],
  dateRange: DateRange | null
) {
  return useDateRangeFilter(data, dateRange, (item) => item.createdAt);
}

/**
 * Hook para filtrar logs (ejemplo)
 */
export function useLogsDateFilter<T extends { timestamp: string }>(
  data: T[],
  dateRange: DateRange | null
) {
  return useDateRangeFilter(data, dateRange, (item) => item.timestamp);
}

/**
 * Hook para filtrar eventos con fechas en diferentes propiedades (ejemplo)
 */
export function useEventsDateFilter<
  T extends { eventDate?: Date | string; date?: Date | string }
>(data: T[], dateRange: DateRange | null) {
  return useDateRangeFilter(
    data,
    dateRange,
    (item) => item.eventDate || item.date || null
  );
}
