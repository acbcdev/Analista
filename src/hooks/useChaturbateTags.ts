import { storage } from "@wxt-dev/storage";
import { toast } from "sonner";
import { CHATURBATE_TAGS_URL, CHATURBATE_URL } from "@/const/url";
import { openDashboard } from "@/lib/action";
import type { TagsStorage } from "@/types";

type ExportMode = "cv" | "json" | "exportJson" | "exportCsv" | "none";

interface TagData {
  tag: string;
  viewers: number;
  rooms: number;
  avgViewersPerRoom: number;
  roomSharePct: number;
  viewerSharePct: number;
  demandIndex: number;
}

/**
 * Hook para manejar operaciones con tags de Chaturbate
 */
export function useChaturbateTags() {
  const extractTagsFromPage = async (): Promise<TagData[]> => {
    const [tab] = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });

    let currentTab = tab;
    if (!tab?.url?.includes(CHATURBATE_TAGS_URL)) {
      currentTab = await browser.tabs.create({
        url: `${CHATURBATE_URL}/?sort=-vc`,
      });
    }

    const [result] = await browser.scripting.executeScript({
      target: { tabId: currentTab.id ?? 0 },
      func: extractTagsScript,
    });

    if (
      !result.result ||
      !Array.isArray(result.result) ||
      result.result.length === 0
    ) {
      throw new Error("No tags found");
    }

    return result.result;
  };

  const exportTags = async (mode: ExportMode) => {
    try {
      const tags = await extractTagsFromPage();

      switch (mode) {
        case "json":
          await copyToClipboard(tags);
          break;
        case "exportJson":
          await downloadAsJson(tags);
          break;
        case "exportCsv":
          await downloadAsCsv(tags);
          break;
        case "none":
          return tags;
        default:
          return tags;
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to process tags"
      );
    }
  };

  const saveAndViewTags = async () => {
    try {
      const tags = await extractTagsFromPage();
      await saveTagsToStorage(tags);
      openDashboard("/viewtags");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save tags"
      );
    }
  };

  return {
    exportTags,
    saveAndViewTags,
  };
}

// Script que se ejecuta en la página para extraer tags
function extractTagsScript() {
  const data = document.querySelectorAll(".tag-table-body .tag_row");
  const tags = [];

  for (const tag of data) {
    const tagName = tag.querySelector(".tag")?.textContent?.trim();
    const viewers = parseFloat(
      tag.querySelector(".viewers")?.textContent?.trim()?.replace(/,/g, "") ??
        "0"
    );
    const rooms = parseFloat(
      tag.querySelector(".rooms")?.textContent?.trim()?.replace(/,/g, "") ?? "0"
    );

    if (tagName && viewers && rooms) {
      const avgViewersPerRoom = parseFloat((viewers / rooms).toFixed(2));
      tags.push({
        tag: tagName,
        viewers,
        rooms,
        avgViewersPerRoom,
      });
    }
  }

  const totalViewers = tags.reduce((acc, t) => acc + t.viewers, 0);
  const totalRooms = tags.reduce((acc, t) => acc + t.rooms, 0);

  return tags.map((i) => {
    const roomSharePct = (i.rooms / totalRooms) * 100;
    const viewerSharePct = (i.viewers / totalViewers) * 100;
    const demandIndex = viewerSharePct / roomSharePct;

    return {
      ...i,
      roomSharePct: parseFloat(roomSharePct.toFixed(2)),
      viewerSharePct: parseFloat(viewerSharePct.toFixed(2)),
      demandIndex: parseFloat(demandIndex.toFixed(2)),
    };
  });
}

// Funciones de utilidad para exportar
async function copyToClipboard(data: TagData[]) {
  const jsonData = JSON.stringify(data, null, 2);
  await window.navigator.clipboard.writeText(jsonData);
  toast.success("JSON copied to clipboard");
}

async function downloadAsJson(data: TagData[]) {
  const jsonData = JSON.stringify(data, null, 2);
  downloadFile(jsonData, "chaturbate_tags.json", "application/json");
  toast.success("JSON exported successfully");
}

async function downloadAsCsv(data: TagData[]) {
  try {
    const header =
      "tag,viewers,rooms,avgViewersPerRoom,roomSharePct,viewerSharePct,demandIndex";
    const rows = data.map(
      ({
        tag,
        viewers,
        rooms,
        avgViewersPerRoom,
        roomSharePct,
        viewerSharePct,
        demandIndex,
      }) =>
        `"${tag}",${viewers},${rooms},${avgViewersPerRoom},${roomSharePct},${viewerSharePct},${demandIndex}`
    );

    const csvData = [header, ...rows].join("\n");
    downloadFile(csvData, "chaturbate_tags.csv", "text/csv");
    toast.success("CSV exported successfully");
  } catch {
    toast.error("Failed to convert to CSV");
  }
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

async function saveTagsToStorage(tags: TagData[]) {
  const prevTagsStore = await storage.getItem<TagsStorage[]>("local:tags");
  const prevTags = prevTagsStore?.slice(0, 9) || [];
  const date = Date.now();
  console.log(prevTagsStore, prevTags);
  await storage.setItem("local:tags", [
    { createAt: date, data: tags, name: new Date(date).toLocaleString("es") },
    ...prevTags,
  ]);
}
