import { Title } from "@radix-ui/react-dialog";
import {
	ChartArea,
	Hourglass,
	LayoutDashboard,
	TableProperties,
	Tags,
	Users,
} from "lucide-react";
import type * as React from "react";
import { Link, useLocation } from "react-router";
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
import { NavMain } from "@/entrypoints/dashboard/components/layout/navMain";
import { TeamSwitcher } from "@/entrypoints/dashboard/components/layout/teamSwitcher.tsx";
import { useModelsStore } from "@/store/models";

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
			title: "Streams",
			url: "/streams",
			icon: TableProperties,
		},
		{
			title: "Models",
			url: "/models",
			icon: Users,
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
									className={pathname === "/viewtags" ? "bg-border" : ""}
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
									className={pathname === "/viewhours" ? "bg-border" : ""}
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
