import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { branches, devices, subscribers } from "@/lib/mock-data";
import { PageHeader, Badge, statusTone } from "@/components/ui-bits";
import { BranchMap } from "@/components/branch-map";
import { Cpu, Wifi, WifiOff, List, MapPin } from "lucide-react";

export const Route = createFileRoute("/_app/branches/map")({ component: BranchMapPage });

function BranchMapPage() {
  const [subFilter, setSubFilter] = useState("all");

  const stats = useMemo(() => {
    const filtered = subFilter === "all" ? branches : branches.filter((b) => b.subscriberId === subFilter);
    let online = 0, offline = 0;
    filtered.forEach((b) => {
      const bd = devices.filter((d) => d.branch === b.name);
      online += bd.filter((d) => d.online && d.active).length;
      offline += bd.filter((d) => !d.online || !d.active).length;
    });
    return { branches: filtered.length, online, offline, total: online + offline };
  }, [subFilter]);

  const list = useMemo(() => {
    const filtered = subFilter === "all" ? branches : branches.filter((b) => b.subscriberId === subFilter);
    return filtered.map((b) => {
      const bd = devices.filter((d) => d.branch === b.name);
      return {
        ...b,
        online: bd.filter((d) => d.online && d.active).length,
        offline: bd.filter((d) => !d.online || !d.active).length,
        sub: subscribers.find((s) => s.id === b.subscriberId),
      };
    });
  }, [subFilter]);

  return (
    <div>
      <PageHeader
        title="Live Branch Map"
        description="Real-time geographic view of every branch and its device status."
        actions={
          <div className="flex items-center gap-2">
            <select
              value={subFilter}
              onChange={(e) => setSubFilter(e.target.value)}
              className="rounded-md border border-border bg-background px-3 py-2 text-sm"
            >
              <option value="all">All Subscribers</option>
              {subscribers.map((s) => <option key={s.id} value={s.id}>{s.company}</option>)}
            </select>
            <Link
              to="/branches"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm hover:bg-muted"
            >
              <List className="h-4 w-4" /> List View
            </Link>
          </div>
        }
      />

      <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Branches" value={stats.branches} icon={MapPin} tone="text-info" />
        <StatCard label="Devices Online" value={stats.online} icon={Wifi} tone="text-success" />
        <StatCard label="Devices Offline" value={stats.offline} icon={WifiOff} tone="text-destructive" />
        <StatCard label="Total Devices" value={stats.total} icon={Cpu} tone="text-primary" />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <BranchMap subscriberFilter={subFilter} />

        <div className="rounded-xl border border-border bg-card">
          <div className="border-b border-border px-4 py-3">
            <div className="text-sm font-semibold">Branch Locations</div>
            <div className="text-xs text-muted-foreground">{list.length} sites tracked</div>
          </div>
          <div className="max-h-[504px] overflow-y-auto divide-y divide-border">
            {list.map((b) => (
              <div key={b.id} className="px-4 py-3 hover:bg-muted/40">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{b.name}</div>
                    <div className="truncate text-xs text-muted-foreground">{b.location}</div>
                    <div className="mt-1 truncate text-[11px] text-muted-foreground">{b.sub?.company}</div>
                  </div>
                  <Badge tone={statusTone(b.status)}>{b.status}</Badge>
                </div>
                <div className="mt-2 flex items-center gap-3 text-xs">
                  <span className="inline-flex items-center gap-1 text-success">
                    <Wifi className="h-3 w-3" /> {b.online}
                  </span>
                  <span className="inline-flex items-center gap-1 text-destructive">
                    <WifiOff className="h-3 w-3" /> {b.offline}
                  </span>
                  <span className="ml-auto text-muted-foreground">{b.users} users</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, tone }: { label: string; value: number; icon: React.ComponentType<{ className?: string }>; tone: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</div>
        <Icon className={`h-4 w-4 ${tone}`} />
      </div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
    </div>
  );
}
