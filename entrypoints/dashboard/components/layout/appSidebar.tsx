"use client";

import * as React from "react";
import {
	ChartArea,
	Hourglass,
	LayoutDashboard,
	TableProperties,
	Tags,
} from "lucide-react";

import { NavMain } from "@/entrypoints/dashboard/components/layout/navMain";
import { TeamSwitcher } from "@/entrypoints/dashboard/components/layout/teamSwitcher.tsx";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
	SidebarSeparator,
} from "@/components/ui/sidebar";
import { useModelsStore } from "@/store/models";
import { Link, useLocation } from "react-router";

const data = {
	user: {
		name: "shadcn",
		email: "m@example.com",
		avatar: "/avatars/shadcn.jpg",
	},
	// teams: [
	//   {
	//     name: "admin",
	//     icon: ShieldUser,
	//   },
	//   {
	//     name: "Acme Inc",
	//     icon: "🥑",
	//     site: "Orange",
	//   },
	// ],
	navMain: [
		{
			title: "Dashboard",
			url: "/",
			icon: LayoutDashboard,
		},
		{
			title: "Analytics",
			url: "/analytics",
			icon: ChartArea,
		},
		{
			title: "streams",
			url: "/streams",
			icon: TableProperties,
		},
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const models = useModelsStore((state) => state.models);
	const { pathname } = useLocation();
	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<TeamSwitcher models={models} />
			</SidebarHeader>
			<SidebarContent className="overflow-x-hidden">
				<NavMain items={data.navMain} pathname={pathname} />
				<SidebarSeparator />
				<SidebarGroup>
					<SidebarMenu>
						<SidebarMenuItem>
							<Link to="/viewtags">
								<SidebarMenuButton
									variant={pathname === "/viewtags" ? "outline" : "default"}
									tooltip={"View Tags"}
								>
									<Tags />
									View Tags
								</SidebarMenuButton>
							</Link>
						</SidebarMenuItem>
						<SidebarMenuItem>
							<Link to="/viewhours">
								<SidebarMenuButton
									variant={pathname === "/viewhours" ? "outline" : "default"}
									tooltip={"View Hours"}
								>
									<Hourglass />
									View Hours
								</SidebarMenuButton>
							</Link>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarGroup>

				{/* <NavProjects projects={data.projects} /> */}
			</SidebarContent>
			{/* <SidebarFooter>
        <NavUser />
      </SidebarFooter> */}
			<SidebarRail />
		</Sidebar>
	);
}
