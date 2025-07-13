import { Cog, Maximize2, PocketKnife, Power } from "lucide-react";
import { Button } from "../ui/button";
import { storage } from "@wxt-dev/storage";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CHATURBATE_TAGS_URL } from "@/const/url";
import { toast } from "sonner";
import { Tags } from "@/types";
type opcionTags = "cv" | "json" | "exportJson" | "exportCsv" | "none";

export default function TopActions() {
  const [tags, setTags] = useState<Tags[]>([]);
  const handleClickTags = async (mode: opcionTags) => {
    const [tab] = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });
    let currentTab = tab;
    if (!tab?.url?.includes(CHATURBATE_TAGS_URL)) {
      currentTab = await browser.tabs.create({
        url: `${CHATURBATE_TAGS_URL}/?sort=-vc`,
      });
    }
    const [tags] = await browser.scripting.executeScript({
      target: { tabId: currentTab.id ?? 0 },
      func: () => {
        // Your extraction logic here, e.g.:
        const data = document.querySelectorAll(".tag-table-body .tag_row");
        const tags = [];
        for (const tag of data) {
          const tagName = tag.querySelector(".tag")?.textContent?.trim();
          const viewers = parseFloat(
            tag
              .querySelector(".viewers")
              ?.textContent?.trim()
              ?.replace(/,/g, "") ?? "0"
          );
          const rooms = parseFloat(
            tag
              .querySelector(".rooms")
              ?.textContent?.trim()
              ?.replace(/,/g, "") ?? "0"
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
          const roomSharePct = (i.rooms / totalRooms) * 100; // rooms ÷ Σrooms
          const viewerSharePct = (i.viewers / totalViewers) * 100; // viewers ÷ Σviewers
          const demandIndex = viewerSharePct / roomSharePct; // demandIndex = viewerSharePct / roomSharePct
          return {
            ...i,
            roomSharePct: parseFloat(roomSharePct.toFixed(2)),
            viewerSharePct: parseFloat(viewerSharePct.toFixed(2)),
            demandIndex: parseFloat(demandIndex.toFixed(2)),
          };
        });
      },
    });
    if (
      tags.result?.length === 0 ||
      !Array.isArray(tags.result) ||
      !tags.result
    ) {
      toast.error("No tags found");
      return;
    }

    if (mode === "json") {
      const jsonData = JSON.stringify(tags.result, null, 2);
      await window.navigator.clipboard.writeText(jsonData);
      toast.success("JSON copied to clipboard");
      return;
    }
    if (mode === "exportJson") {
      const jsonData = JSON.stringify(tags.result, null, 2);
      const blob = new Blob([jsonData], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "chaturbate_tags.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("JSON exported successfully");
      return;
    }

    if (mode === "exportCsv") {
      try {
        const tagsList = tags.result;
        if (!Array.isArray(tagsList)) return;

        const header =
          "tag,viewers,rooms,avgViewersPerRoom,roomSharePct,viewerSharePct,demandIndex";
        const rows = tagsList.map(
          ({
            tag,
            viewers,
            rooms,
            avgViewersPerRoom,
            roomSharePct,
            viewerSharePct,
            demandIndex,
          }) => {
            return `"${tag}",${viewers},${rooms},${avgViewersPerRoom},${roomSharePct},${viewerSharePct},${demandIndex},`;
          }
        );

        const cvData = [header, ...rows].join("\n");
        const blob = new Blob([cvData], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "chaturbate_tags.csv";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success("CSV exported successfully");
        return;
      } catch (error) {
        toast.error("Failed to convert to CSV");
      }
    }
    return tags.result;
  };

  const handleViewTags = async () => {
    const tags = await handleClickTags("none");
    await storage.setItem("local:tags", tags);
    await storage.setItem("local:tags-date", Date.now());
    if (tags?.length === 0) {
      toast.error("No tags found await ");
      return;
    }

    const url = browser.runtime.getURL("/dashboard.html");
    window.open(`${url}`);
  };
  return (
    <header className="flex items-center justify-between ">
      <Button variant="ghost" size={"icon"}>
        <Power />
      </Button>
      <div className="flex items-center gap-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size={"icon"}>
              <PocketKnife />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>
              <a href={CHATURBATE_TAGS_URL} target="_blank">
                Chaturbate Tags
              </a>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleViewTags}>
              View Tags
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleClickTags("json")}>
              Copy JSON
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleClickTags("exportJson")}>
              Export Json
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleClickTags("exportCsv")}>
              Export Csv
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="ghost"
          size={"icon"}
          onClick={() => {
            const url = browser.runtime.getURL("/dashboard.html");
            window.open(url);
          }}
        >
          <Maximize2 />
        </Button>
        <Button variant="ghost" size={"icon"}>
          <Cog />
        </Button>
      </div>
    </header>
  );
}
