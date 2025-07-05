import { SidebarInset, SidebarProvider } from "../ui/sidebar";
import { Toaster } from "../ui/sonner";
import { AppSidebar } from "./appSidebar";
import Header from "./header";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      {/* <SidebarInset /> */}
      <main className="flex h-full w-full flex-1 flex-col overflow-hidden">
        <Header />
        {children}
      </main>
      <Toaster />
    </SidebarProvider>
  );
}
