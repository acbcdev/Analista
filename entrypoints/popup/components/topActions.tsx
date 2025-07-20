import { storage } from "@wxt-dev/storage";
import { Cog, Maximize2, PocketKnife, Power } from "lucide-react";
import { toast } from "sonner";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	CBHOURS,
	CHATURBATE_TAGS_URL,
	SODAHOURS_URL,
	STRIPHOURS_URL,
} from "@/const/url";
import type { HoursStorage, TagsStorage } from "@/types";
import { Button } from "../../../components/ui/button";

type opcionTags = "cv" | "json" | "exportJson" | "exportCsv" | "none";

export default function TopActions() {
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
							?.replace(/,/g, "") ?? "0",
					);
					const rooms = parseFloat(
						tag
							.querySelector(".rooms")
							?.textContent?.trim()
							?.replace(/,/g, "") ?? "0",
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
					},
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
		const prevTagsStore = await storage.getItem<TagsStorage[]>("local:tags");
		const prevTags = prevTagsStore?.slice(0, 9) || [];
		const date = Date.now();
		await storage.setItem("local:tags", [
			{ createAt: date, data: tags, name: new Date(date).toLocaleString("es") },
			...prevTags,
		]);
		if (tags?.length === 0) {
			toast.error("No tags found await ");
			return;
		}

		openDashboard("/viewtags");
	};
	const getHours = async () => {
		const [tab] = await browser.tabs.query({
			active: true,
			currentWindow: true,
		});
		const url = tab?.url;
		const condition =
			url?.includes(STRIPHOURS_URL) ||
			url?.includes(CBHOURS) ||
			url?.includes(SODAHOURS_URL);
		if (!condition) {
			toast.error("This is not a hours site");
			return;
		}
		const [hours] = await browser.scripting.executeScript({
			target: { tabId: tab.id ?? 0 },
			func: () => {
				const data = document.querySelectorAll(".activity-logs p");
				const hours = [];
				for (const item of data) {
					const hoursItem = item.textContent?.trim();
					const regex =
						/^(\d{4}-\d{2}-\d{2})\s+\w+\s+-\s+(\d{2})\s+Hours\s+(\d{2})\s+Minutes$/;

					const [, date, hour, minutes] = hoursItem?.match(regex) ?? [];
					if (date && hour && minutes) {
						const hoursItem = `${hour}:${minutes}`;
						hours.push({
							name: date,
							date: new Date(date).getMilliseconds(),
							hour: parseInt(hour),
							minutes: parseInt(minutes),
							time: hoursItem,
						});
					}
				}
				return hours;
			},
		});
		if (!hours.result) return;
		if (hours.result?.length === 0) {
			toast.error("No hours found");
			return;
		}
		const prevHoursStore =
			await storage.getItem<Record<string, HoursStorage>>("local:hours");
		const prevHours = prevHoursStore ?? {};
		const date = Date.now();
		const name = url?.split("user/")[1].replace(".html", "") ?? "";
		await storage.setItem("local:hours", {
			...prevHours,
			[name]: {
				createAt: date,
				data: hours.result,
				name,
			},
		});
		openDashboard("/viewhours");
	};

	async function openDashboard(path = "", url2?: string) {
		const url = url2 ?? browser.runtime.getURL("/dashboard.html");
		const tabs = await browser.tabs.query({ currentWindow: true });
		for (const tab of tabs) {
			if (tab.url?.includes(url)) {
				browser.tabs.update(tab.id ?? 0, { active: true });
				return;
			}
		}

		const openUrl = url2 ? url2 : `${url}#${path}`;

		window.open(openUrl);
	}

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

					<DropdownMenuContent className="overflow-hidden">
						<DropdownMenuLabel>Tools</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuSub>
								<DropdownMenuSubTrigger>Chaturbate</DropdownMenuSubTrigger>
								<DropdownMenuSubContent>
									<DropdownMenuItem onClick={handleViewTags}>
										View Tags
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem onClick={() => handleClickTags("json")}>
										Copy JSON
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={() => handleClickTags("exportJson")}
									>
										Export JSON
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={() => handleClickTags("exportCsv")}
									>
										Export CSV
									</DropdownMenuItem>
								</DropdownMenuSubContent>
							</DropdownMenuSub>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem onClick={getHours}> Hours </DropdownMenuItem>
						</DropdownMenuGroup>
					</DropdownMenuContent>
				</DropdownMenu>

				<Button variant="ghost" size={"icon"} onClick={() => openDashboard()}>
					<Maximize2 />
				</Button>
				<Button variant="ghost" size={"icon"}>
					<Cog />
				</Button>
			</div>
		</header>
	);
}
