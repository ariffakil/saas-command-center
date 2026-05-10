import { Bell, Menu, Moon, Search, Sun } from "lucide-react";
import { useTheme } from "./theme-provider";
import { useRouterState } from "@tanstack/react-router";

export function TopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const { theme, toggle } = useTheme();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const crumbs = pathname.split("/").filter(Boolean);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur lg:px-6">
      <button
        className="rounded-md p-2 hover:bg-muted lg:hidden"
        onClick={onMenuClick}
        aria-label="Open sidebar"
      >
        <Menu className="h-5 w-5" />
      </button>

      <nav className="hidden text-sm text-muted-foreground md:flex">
        <span className="font-medium text-foreground">Dashboard</span>
        {crumbs.map((c, i) => (
          <span key={i} className="flex items-center">
            <span className="mx-2">/</span>
            <span className={i === crumbs.length - 1 ? "text-foreground" : ""}>
              {c.replace(/-/g, " ")}
            </span>
          </span>
        ))}
      </nav>

      <div className="ml-auto flex items-center gap-2">
        <div className="relative hidden md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder="Search subscribers, invoices, devices…"
            className="h-9 w-72 rounded-md border border-input bg-card pl-9 pr-3 text-sm outline-none ring-ring/40 transition focus:ring-2"
          />
        </div>
        <button
          onClick={toggle}
          className="rounded-md p-2 hover:bg-muted"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
        <button className="relative rounded-md p-2 hover:bg-muted" aria-label="Notifications">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
        </button>
        <div className="flex items-center gap-2 rounded-md pl-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
            SA
          </div>
          <div className="hidden text-left text-xs leading-tight md:block">
            <div className="font-medium text-foreground">Super Admin</div>
            <div className="text-muted-foreground">admin@facetime.io</div>
          </div>
        </div>
      </div>
    </header>
  );
}