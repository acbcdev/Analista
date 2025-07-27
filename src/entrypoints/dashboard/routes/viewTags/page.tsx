import { storage } from "@wxt-dev/storage";
import { Hash } from "lucide-react";
import { useState } from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {  CHATURBATE_URL } from "@/const/url";
import { useStorage } from "@/hooks/useStorege";
import type { Tags } from "@/types";
import { EmptyState } from "../EmptyState";
import { columns } from "./columns";
import { DataTable } from "./dataTable";

type tagsStore = {
	data: Tags[];
	createAt: number;
	name: string;
};

export function TagsView() {
	const allTags = useStorage<tagsStore[]>("tags", []);
	const [data, setData] = useState<Tags[]>([]);

	if (!allTags || allTags?.length === 0)
		return (
			<EmptyState
				icon={Hash}
				title="No tags data found"
				description="No tag data has been collected yet. Visit Chaturbate to start collecting tag analytics."
				actionLabel="Visit Chaturbate Tags "
				
				actionHref={`${CHATURBATE_URL}/?sort=-vc`}
			/>
		);

	return (
		<>
			<section className="flex items-center justify-between gap-y-2 mx-2 p-4 pt-0">
				<div className="flex gap-x-2 text-sm">
					<Select
						onValueChange={async (value) => {
							await storage.setItem("local:selectedTag", value);
							const tag = allTags?.find((tag) => tag.name === value);
							setData(tag?.data || []);
						}}
					>
						<SelectTrigger>
							<SelectValue placeholder="Select a Date" />
						</SelectTrigger>
						<SelectContent>
							{allTags?.map((tag) => (
								<SelectItem key={tag.createAt} value={tag.name}>
									{tag.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</section>
			{data.length === 0 ? (
				<div className="flex flex-col items-center justify-center min-h-[40vh] text-center p-8">
					<div className="mb-6">
						<Hash className="size-12 text-muted-foreground mx-auto mb-4" />
						<h3 className="text-xl font-semibold mb-2">
							Select a date to view tags
						</h3>
						<p className="text-muted-foreground">
							Choose a date from the dropdown above to see the tag analytics for
							that period.
						</p>
					</div>
				</div>
			) : (
				<DataTable columns={columns} data={data} />
			)}
		</>
	);
}
