"use client";
import { BadgeCheck, Cog, LogOut } from "lucide-react";

import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export function NavUser() {
	const { isMobile } = useSidebar();

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<Dialog>
					<DialogTrigger asChild>
						<SidebarMenuButton size="lg">
							<Cog />
						</SidebarMenuButton>
					</DialogTrigger>
					<DialogContent className="w-full max-w-lg">
						<div className="flex flex-col gap-4">
							<div className="flex items-center gap-2">
								<Cog className="text-muted-foreground" />
								<span>Settings</span>
							</div>
							<div className="flex items-center gap-2">
								<BadgeCheck className="text-muted-foreground" />
								<span>Account</span>
							</div>
							<div className="flex items-center gap-2">
								<LogOut className="text-muted-foreground" />
								<span>Log out</span>
							</div>
						</div>
					</DialogContent>
				</Dialog>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
