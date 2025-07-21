"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Tags } from "@/types";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<Tags>[] = [
	{
		accessorKey: "tag",
		header: "Tag",
	},
	{
		accessorKey: "viewers",
		header: ({ column }) => {
			return (
				<Button
					variant={
						column.getSortIndex() === column.getIndex() ? "outline" : "ghost"
					}
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Viewers
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: (info) => {
			const value = info.getValue();
			return typeof value === "number"
				? value.toLocaleString("es")
				: parseFloat(String(value ?? "0")).toLocaleString();
		},
		enableSorting: true,
	},
	{
		accessorKey: "rooms",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Rooms
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: (info) => {
			const value = info.getValue();
			return typeof value === "number"
				? value.toLocaleString("es")
				: parseFloat(String(value ?? "0")).toLocaleString();
		},
		enableSorting: true,
	},
	{
		accessorKey: "avgViewersPerRoom",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Avg Viewers Per Room
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		enableSorting: true,
	},
	{
		accessorKey: "roomSharePct",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Room Share Pct
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		enableSorting: true,
	},
	{
		accessorKey: "viewerSharePct",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Viewer Share Pct
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		enableSorting: true,
	},
	{
		accessorKey: "demandIndex",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Demand Index
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		enableSorting: true,
	},
];
