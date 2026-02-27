import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "../DashboardSidebar";
import { DashboardSearch } from "@/components/DashboardSearch";
import { Outlet } from "react-router-dom";

export function DashboardLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar />
        <main className="flex-1 overflow-auto">
          <div className="border-b border-border px-6 py-3 flex items-center">
            <DashboardSearch />
          </div>
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
}
