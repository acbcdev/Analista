import { storage } from "@wxt-dev/storage";
import { toast } from "sonner";
import { CBHOURS, SODAHOURS_URL, STRIPHOURS_URL } from "@/const/url";
import { openDashboard } from "@/lib/action";
import type { Hours, HoursStorage } from "@/types";
import { pl } from "date-fns/locale";

/**
 * Hook para manejar operaciones con horas de trabajo
 */
type PlatformsHours = "cbhours" | "sodahours" | "striphours";

export function useHoursExtraction() {
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
      const platform = url
        .replace(/https?:\/\/(www\.)?/, "")
        .split(".")[0] as PlatformsHours;
      const hours = await extractHoursFromPage(tabId, platform);
      if (!hours || hours.length === 0) {
        toast.error("No hours found");
        return;
      }

      await saveHoursToStorage(hours, url, platform);
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

async function extractHoursFromPage(
  tabId: number,
  platform: PlatformsHours
): Promise<Hours[]> {
  const [result] = await browser.scripting.executeScript({
    target: { tabId },
    func: extractHoursScript,
    args: [platform],
  });

  return result.result || [];
}

function extractHoursScript(platform: PlatformsHours): Hours[] {
  const platformsQuery: Record<PlatformsHours, string> = {
    cbhours: ".activity_logs_content p",
    sodahours: ".activity-logs p",
    striphours: ".activity-logs p",
  };
  const data = document.querySelectorAll(platformsQuery[platform]);
  const hours: Hours[] = [];

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
        totalHours: parseInt(hour) + parseInt(minutes) / 60,
      });
    }
  }

  return hours;
}

const platformsComparison = {
  cbhours: "chaturbate",
  sodahours: "camsoda",
  striphours: "stripchat",
};

async function saveHoursToStorage(
  hours: Hours[],
  url: string,
  platform: PlatformsHours
): Promise<void> {
  const prevHoursStore = await storage.getItem<HoursStorage[]>("local:hours");
  const prevHours = prevHoursStore ?? [];
  const date = Date.now();
  const name = url.split("user/")[1]?.replace(".html", "") ?? "";
  const platformName = platformsComparison[platform] || platform;
  const isAlreadySaved = prevHours.find((h) => h.id === `${platform}-${name}`);

  if (isAlreadySaved) {
    const existingHours = isAlreadySaved.data;
    const hoursToAdd = existingHours.filter((h) => {
      return !hours.some((eh) => eh.name === h.name);
    });
    await storage.setItem(
      "local:hours",
      prevHours.map((h) => {
        if (h.id === `${platform}-${name}`) {
          return {
            ...h,
            createAt: date,
            data: [...hours, ...hoursToAdd],
          };
        }
        return h;
      })
    );
    return;
  }
  await storage.setItem("local:hours", [
    {
      createAt: date,
      data: hours,
      id: `${platform}-${name}`,
      name,
      platform: platformName,
    },
    ...prevHours,
  ]);
}
