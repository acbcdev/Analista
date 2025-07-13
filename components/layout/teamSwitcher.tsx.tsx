"use client";

import { ChevronsUpDown, Plus, Shield } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Model } from "@/types/model";
import { useModelsStore } from "@/store/models";
import { parseAsInteger, useQueryState } from "nuqs";

type TeamSwitcherProps = {
  models: Model[];
};

export function TeamSwitcher({ models }: TeamSwitcherProps) {
  const { isMobile } = useSidebar();
  const [activeTeam, setActiveTeam] = useState<Model | null>(null);
  const [model, setModel] = useQueryState(
    "model",
    parseAsInteger.withDefault(0)
  );
  const setIsAddingModel = useModelsStore((state) => state.setIsAddingModel);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              {!activeTeam ? (
                <>
                  <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                    <Shield className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">Admin</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                    {typeof activeTeam.icon === "string" ? (
                      activeTeam.icon
                    ) : (
                      <activeTeam.icon className="size-4" />
                    )}
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">
                      {activeTeam.name}
                    </span>
                    <span className="truncate text-xs">{activeTeam.site}</span>
                  </div>
                </>
              )}

              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Models
            </DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => {
                setActiveTeam(null);
                setModel(0);
              }}
              className="gap-2 p-2"
            >
              <div className="flex size-6 items-center justify-center rounded-md border">
                <Shield className="size-4" />
              </div>
              Admin
            </DropdownMenuItem>
            {models.map((model, index) => (
              <DropdownMenuItem
                key={model.name}
                onClick={() => {
                  setModel(index + 1);
                  setActiveTeam(model);
                }}
                className="gap-2 p-2 group"
              >
                <div className="flex size-6 items-center justify-center rounded-md border group-hover:border-background">
                  {typeof model.icon === "string" ? (
                    model.icon
                  ) : (
                    <model.icon className="size-3.5 shrink-0" />
                  )}
                </div>
                {model.name}
                {/* <DropdownMenuShortcut>{index + 1}</DropdownMenuShortcut> */}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 p-2"
              onClick={() => setIsAddingModel(true)}
            >
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <Plus className="size-4" />
              </div>
              <div className="text-muted-foreground font-medium">Add model</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
