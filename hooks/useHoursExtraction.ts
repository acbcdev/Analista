import { storage } from "@wxt-dev/storage";
import { toast } from "sonner";
import { CBHOURS, SODAHOURS_URL, STRIPHOURS_URL } from "@/const/url";
import type { HoursStorage } from "@/types";

interface HourData {
  name: string;
  date: number;
  hour: number;
  minutes: number;
  time: string;
}

/**
 * Hook para manejar operaciones con horas de trabajo
 */
export function useHoursExtraction() {
  const { openDashboard } = useDashboardNavigation();

  const extractAndSaveHours = async () => {
    try {
      const [tab] = await browser.tabs.query({
        active: true,
        currentWindow: true,
      });

      const url = tab?.url;
      const tabId = tab?.id;

      if (!isValidHoursUrl(url)) {
        toast.error("This is not a hours site");
        return;
      }

      if (!tabId || !url) {
        toast.error("Unable to access current tab");
        return;
      }

      const hours = await extractHoursFromPage(tabId);
      if (!hours || hours.length === 0) {
        toast.error("No hours found");
        return;
      }

      await saveHoursToStorage(hours, url);
      openDashboard("/viewhours");
    } catch {
      toast.error("Failed to extract hours");
    }
  };

  return { extractAndSaveHours };
}

function isValidHoursUrl(url?: string): boolean {
  if (!url) return false;
  return (
    url.includes(STRIPHOURS_URL) ||
    url.includes(CBHOURS) ||
    url.includes(SODAHOURS_URL)
  );
}

async function extractHoursFromPage(tabId: number): Promise<HourData[]> {
  const [result] = await browser.scripting.executeScript({
    target: { tabId },
    func: extractHoursScript,
  });

  return result.result || [];
}

function extractHoursScript(): HourData[] {
  const data = document.querySelectorAll(".activity-logs p");
  const hours: HourData[] = [];

  for (const item of data) {
    const hoursItem = item.textContent?.trim();
    const regex =
      /^(\d{4}-\d{2}-\d{2})\s+\w+\s+-\s+(\d{2})\s+Hours\s+(\d{2})\s+Minutes$/;
    const [, date, hour, minutes] = hoursItem?.match(regex) ?? [];

    if (date && hour && minutes) {
      const timeString = `${hour}:${minutes}`;
      hours.push({
        name: date,
        date: new Date(date).getTime(), // Fix: usar getTime() en lugar de getMilliseconds()
        hour: parseInt(hour),
        minutes: parseInt(minutes),
        time: timeString,
      });
    }
  }

  return hours;
}

async function saveHoursToStorage(
  hours: HourData[],
  url: string
): Promise<void> {
  const prevHoursStore = await storage.getItem<Record<string, HoursStorage>>(
    "local:hours"
  );
  const prevHours = prevHoursStore ?? {};
  const date = Date.now();
  const name = url.split("user/")[1]?.replace(".html", "") ?? "";

  await storage.setItem("local:hours", {
    ...prevHours,
    [name]: {
      createAt: date,
      data: hours,
      name,
    },
  });
}
