import { Cog, Maximize2, PocketKnife, Power } from "lucide-react";
import { Button } from "../ui/button";
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
type opcionTags = "cv" | "json" | "exportJson" | "exportCsv";

export default function TopActions() {
  const handleClickTags = async (mode: opcionTags) => {
    const [tab] = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });
    let currentTab = tab;
    if (tab?.url !== CHATURBATE_TAGS_URL) {
      currentTab = await browser.tabs.create({ url: CHATURBATE_TAGS_URL });
    }
    const [tags] = await browser.scripting.executeScript({
      target: { tabId: currentTab.id ?? 0 },
      func: () => {
        // Your extraction logic here, e.g.:
        const data = document.querySelectorAll(".tag-table-body .tag_row");
        const tags = [];
        for (const tag of data) {
          const tagName = tag.querySelector(".tag")?.textContent?.trim();
          const viewers = tag.querySelector(".viewers")?.textContent?.trim();
          const rooms = tag.querySelector(".rooms")?.textContent?.trim();
          if (tagName && viewers && rooms) {
            tags.push({
              tag: tagName,
              viewers: parseInt(viewers.replace(/,/g, "")),
              rooms: parseInt(rooms.replace(/,/g, "")),
            });
          }
        }
        return tags;
      },
    });
    if (tags.result?.length === 0 || !Array.isArray(tags.result)) {
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
        const header = "tag,viewers,rooms";
        const rows = tags.result?.map(
          (item) => `"${item.tag}",${item.viewers},${item.rooms}` // Ensure proper CSV formatting
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
        console.error("Error converting to CSV:", error);
        toast.error("Failed to convert to CSV");
      }
    }
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
            <DropdownMenuItem onClick={() => handleClickTags("json")}>
              JSON
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
