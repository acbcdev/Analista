"use client";

import { type LucideIcon } from "lucide-react";

import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "react-router";

type NavMainProps = {
	items: {
		title: string;
		url: string;
		icon?: LucideIcon;
		isActive?: boolean;
		items?: {
			title: string;
			url: string;
		}[];
	}[];
	pathname: string;
};

export function NavMain({ items, pathname }: NavMainProps) {
	return (
		<SidebarGroup>
			<SidebarGroupLabel>Views</SidebarGroupLabel>
			<SidebarMenu>
				{items.map((item) => (
					<SidebarMenuItem key={item.title}>
						<Link to={item.url}>
							<SidebarMenuButton
								variant={pathname === item.url ? "outline" : "default"}
								tooltip={item.title}
							>
								{item.icon && <item.icon />}
								<span>{item.title}</span>
							</SidebarMenuButton>
						</Link>
					</SidebarMenuItem>
				))}
			</SidebarMenu>
		</SidebarGroup>
	);
}
