import { useEffect, useState } from "react";

/**
 * Hook genérico para obtener la URL actual del tab activo
 * Solo se encarga de obtener la URL, sin lógica de validación específica
 */
export function useCurrentUrl() {
  const [currentUrl, setCurrentUrl] = useState<string>("");

  useEffect(() => {
    const getCurrentUrl = async () => {
      try {
        const [tab] = await browser.tabs.query({
          active: true,
          currentWindow: true,
        });

        const url = tab?.url || "";
        setCurrentUrl(url);
      } catch (error) {
        console.error("Error getting current URL:", error);
        setCurrentUrl("");
      }
    };

    getCurrentUrl();

    // Escuchar cambios de tab activo
    const handleTabUpdate = () => {
      getCurrentUrl();
    };

    browser.tabs.onActivated.addListener(handleTabUpdate);
    browser.tabs.onUpdated.addListener(handleTabUpdate);

    return () => {
      browser.tabs.onActivated.removeListener(handleTabUpdate);
      browser.tabs.onUpdated.removeListener(handleTabUpdate);
    };
  }, []);

  return currentUrl;
}
