import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { AddModelDialog } from "./addModelDialong";
import { AppSidebar } from "./appSidebar";
import Header from "./header";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultChecked={false}>
      <AppSidebar />
      <main className="flex h-full w-full flex-1 flex-col overflow-hidden">
        <Header />
        <AddModelDialog />
        {children}
      </main>
      <Toaster />
    </SidebarProvider>
  );
}
