import { useMemo } from "react";
import { CBHOURS, SODAHOURS_URL, STRIPHOURS_URL } from "@/const/url";
import { useCurrentUrl } from "./useCurrentUrl";

/**
 * Hook específico para determinar si la URL actual es válida para extraer horas
 */
export function useIsHoursUrl() {
  const currentUrl = useCurrentUrl();

  const isHoursUrl = useMemo(() => {
    if (!currentUrl) return false;

    return (
      currentUrl.includes(STRIPHOURS_URL) ||
      currentUrl.includes(CBHOURS) ||
      currentUrl.includes(SODAHOURS_URL)
    );
  }, [currentUrl]);

  return isHoursUrl;
}
