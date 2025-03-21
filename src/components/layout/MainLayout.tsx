
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { ReactNode } from "react";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <main className="flex-1 overflow-x-hidden">
          <div className="container mx-auto p-6">
            <div className="flex items-center justify-between mb-8">
              <SidebarTrigger className="md:hidden" />
            </div>
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
