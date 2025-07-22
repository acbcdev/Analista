import { Cog, Maximize2, PocketKnife, Power } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { useChaturbateTags } from "@/hooks/useChaturbateTags";
import { useHoursExtraction } from "@/hooks/useHoursExtraction";
import { openDashboard } from "@/lib/action";

export default function TopActions() {
	const { exportTags, saveAndViewTags } = useChaturbateTags();
	const { extractAndSaveHours } = useHoursExtraction();

	return (
		<header className="flex items-center justify-between">
			<Button variant="ghost" size="icon">
				<Power />
			</Button>

			<div className="flex items-center gap-x-2">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="icon">
							<PocketKnife />
						</Button>
					</DropdownMenuTrigger>

					<DropdownMenuContent className="overflow-hidden">
						<DropdownMenuLabel>Tools</DropdownMenuLabel>
						<DropdownMenuSeparator />

						{/* Chaturbate Tools */}
						<DropdownMenuGroup>
							<DropdownMenuSub>
								<DropdownMenuSubTrigger>Chaturbate</DropdownMenuSubTrigger>
								<DropdownMenuSubContent>
									<DropdownMenuItem
										onClick={() => saveAndViewTags(openDashboard)}
									>
										View Tags
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem onClick={() => exportTags("json")}>
										Copy JSON
									</DropdownMenuItem>
									<DropdownMenuItem onClick={() => exportTags("exportJson")}>
										Export JSON
									</DropdownMenuItem>
									<DropdownMenuItem onClick={() => exportTags("exportCsv")}>
										Export CSV
									</DropdownMenuItem>
								</DropdownMenuSubContent>
							</DropdownMenuSub>
						</DropdownMenuGroup>

						<DropdownMenuSeparator />

						{/* Hours Tools */}
						<DropdownMenuGroup>
							<DropdownMenuItem onClick={() => extractAndSaveHours()}>
								Hours
							</DropdownMenuItem>
						</DropdownMenuGroup>
					</DropdownMenuContent>
				</DropdownMenu>

				<Button variant="ghost" size="icon" onClick={() => openDashboard()}>
					<Maximize2 />
				</Button>

				<Button variant="ghost" size="icon">
					<Cog />
				</Button>
			</div>
		</header>
	);
}
