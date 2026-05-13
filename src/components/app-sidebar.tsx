import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Building2, UserPlus, CreditCard, ToggleLeft, Gauge,
  GitBranch, Cpu, FileText, FileSpreadsheet, Wallet, BellRing, History, Settings, ScanFace, Package, Radio,
} from "lucide-react";

const nav = [
  { group: "Overview", items: [
    { to: "/", label: "Dashboard", icon: LayoutDashboard },
  ]},
  { group: "Subscribers", items: [
    { to: "/subscribers", label: "Subscribers", icon: Building2 },
    { to: "/subscribers/new", label: "Add Subscriber", icon: UserPlus },
  ]},
  { group: "Subscriptions", items: [
    { to: "/plans", label: "Subscription Plans", icon: CreditCard },
    { to: "/products", label: "Products", icon: Package },
    { to: "/modules", label: "Module Control", icon: ToggleLeft },
    { to: "/limits", label: "License Limits", icon: Gauge },
  ]},
  { group: "Operations", items: [
    { to: "/branches", label: "Branches", icon: GitBranch },
    { to: "/devices", label: "Devices", icon: Cpu },
    { to: "/tracking", label: "Live Tracking", icon: Radio },
  ]},
  { group: "Billing", items: [
    { to: "/invoices", label: "Invoices", icon: FileText },
    { to: "/quotations", label: "Quotations", icon: FileSpreadsheet },
    { to: "/payments", label: "Payment History", icon: Wallet },
  ]},
  { group: "System", items: [
    { to: "/alerts", label: "Renewal Alerts", icon: BellRing },
    { to: "/activity", label: "Activity Logs", icon: History },
    { to: "/settings", label: "Settings", icon: Settings },
  ]},
];

export function AppSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={onClose} />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-sidebar text-sidebar-foreground transition-transform lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <ScanFace className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold">FaceTime SaaS</div>
            <div className="text-[11px] text-sidebar-foreground/60">Super Admin Console</div>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-4 text-sm">
          {nav.map((group) => (
            <div key={group.group} className="mb-5">
              <div className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/50">
                {group.group}
              </div>
              <ul className="space-y-1">
                {group.items.map((item) => {
                  const active = pathname === item.to || (item.to !== "/" && pathname.startsWith(item.to));
                  const Icon = item.icon;
                  return (
                    <li key={item.to}>
                      <Link
                        to={item.to}
                        onClick={onClose}
                        className={`flex items-center gap-3 rounded-md px-3 py-2 transition-colors ${
                          active
                            ? "bg-sidebar-primary text-sidebar-primary-foreground"
                            : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
        <div className="border-t border-sidebar-border p-4 text-[11px] text-sidebar-foreground/50">
          v1.0.0 • © FaceTime
        </div>
      </aside>
    </>
  );
}