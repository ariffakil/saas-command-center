import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { TopBar } from "@/components/topbar";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      <AppSidebar open={open} onClose={() => setOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar onMenuClick={() => setOpen(true)} />
        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}