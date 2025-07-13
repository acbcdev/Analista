"use client";

import * as React from "react";
import {
  AudioWaveform,
  ChartArea,
  Command,
  GalleryVerticalEnd,
  LayoutDashboard,
  ShieldUser,
  TableProperties,
} from "lucide-react";

import { NavMain } from "@/components/layout/navMain";
import { NavUser } from "@/components/layout/navUsers";
import { TeamSwitcher } from "@/components/layout/teamSwitcher.tsx";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { useModelsStore } from "@/store/models";
import { Link } from "react-router";

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
      title: "Table",
      url: "/table",
      icon: TableProperties,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const models = useModelsStore((state) => state.models);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher models={models} />
      </SidebarHeader>
      <SidebarContent className="overflow-x-hidden">
        <NavMain items={data.navMain} />
        <SidebarSeparator />
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuButton asChild>
              <Link to="/viewtags">View Tags</Link>
            </SidebarMenuButton>
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
