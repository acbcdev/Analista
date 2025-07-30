import { useMemo } from "react";
import { useCurrentUrl } from "./useCurrentUrl";
import { STRIPCHAT_URL } from "@/const/url";

/**
 * Hook de ejemplo para crear validaciones personalizadas de URL
 * Demuestra cómo extender la funcionalidad del hook genérico useCurrentUrl
 */
export function useUrlValidator(validator: (url: string) => boolean) {
  const currentUrl = useCurrentUrl();

  const isValid = useMemo(() => {
    return validator(currentUrl);
  }, [currentUrl, validator]);

  return isValid;
}

/**
 * Validadores predefinidos que se pueden reutilizar
 */
export const urlValidators = {
  isChaturbate: (url: string) => url.includes("chaturbate.com"),
  isHttps: (url: string) => url.startsWith("https://"),
  isStripChat: (url: string) => url.includes(STRIPCHAT_URL),
  // Validador personalizable para dominios
  isDomain: (domain: string) => (url: string) => url.includes(domain),
  isTipMenuUrl: (url: string) =>
    url.includes(STRIPCHAT_URL) ||
    url.includes("chaturbate.com/app/startup/the-menu"),
  // Validador para patrones regex
  matchesPattern: (pattern: RegExp) => (url: string) => pattern.test(url),
};
