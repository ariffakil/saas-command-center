import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import {
  Building2, Users, Cpu, GitBranch, AlertTriangle, ArrowUpRight,
  TrendingUp, TrendingDown, Clock, Activity, Zap, Wifi, WifiOff,
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
} from "recharts";
import {
  kpiSummary, monthlyRevenue, subscriberGrowth, renewalAlerts, subscribers,
  devices as devicesData, invoices, moduleUsage, accountStatusBreakdown,
  activityLogs,
} from "@/lib/mock-data";
import { Badge } from "@/components/ui-bits";

export const Route = createFileRoute("/_app/")({ component: Dashboard });

const money = (n: number) => `$${n.toLocaleString()}`;
const fmt = (n: number) => n.toLocaleString();

const trendData = [
  { v: 32 }, { v: 38 }, { v: 35 }, { v: 42 }, { v: 48 }, { v: 45 }, { v: 56 },
];

function Dashboard() {
  const onlineDevices = useMemo(() => devicesData.filter((d) => d.online && d.active).length, []);
  const offlineDevices = devicesData.length - onlineDevices;
  const overdueCount = invoices.filter((i) => i.status === "Overdue").length;
  const topSubs = useMemo(
    () => [...subscribers].filter((s) => s.status === "Active").sort((a, b) => b.monthlyValue - a.monthlyValue).slice(0, 5),
    []
  );

  return (
    <div className="space-y-6">
      {/* HERO BANNER */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary via-primary to-primary/80 p-6 text-primary-foreground shadow-lg">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 right-20 h-48 w-48 rounded-full bg-white/5 blur-2xl" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground/70">
              Super Admin Console
            </div>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">Welcome back 👋</h1>
            <p className="mt-1 text-sm text-primary-foreground/80">
              Here's what's happening across your platform today.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link to="/subscribers/new" className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-primary shadow hover:bg-white/90">
                + Add Subscriber
              </Link>
              <Link to="/invoices" className="rounded-lg border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur hover:bg-white/20">
                New Invoice
              </Link>
              <Link to="/tracking" className="rounded-lg border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur hover:bg-white/20">
                <Activity className="mr-1 inline h-3.5 w-3.5" /> Live Tracking
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center lg:gap-6">
            <HeroStat label="MRR" value={money(kpiSummary.monthlyRevenue)} delta="+8.4%" up />
            <HeroStat label="Active" value={fmt(kpiSummary.activeSubscribers)} delta="+5" up />
            <HeroStat label="Renewals" value={fmt(kpiSummary.upcomingRenewals)} delta="30d" />
          </div>
        </div>
      </div>

      {/* COMPACT KPI STRIP */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiTile icon={Building2} label="Subscribers" value={fmt(kpiSummary.totalSubscribers)} delta="+8" up tone="text-primary" bg="bg-primary-soft" trend={trendData} />
        <KpiTile icon={Users} label="Users" value={fmt(kpiSummary.totalUsers)} delta="+212" up tone="text-info" bg="bg-info/10" trend={trendData} />
        <KpiTile icon={Cpu} label="Devices" value={fmt(kpiSummary.totalDevices)} delta={`${onlineDevices} online`} up tone="text-success" bg="bg-success/10" trend={trendData} />
        <KpiTile icon={GitBranch} label="Branches" value={fmt(kpiSummary.totalBranches)} delta="+32 Q2" up tone="text-warning-foreground" bg="bg-warning/15" trend={trendData} />
      </div>

      {/* OVERDUE BANNER */}
      {overdueCount > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span className="font-medium">{overdueCount} invoices are overdue</span>
          <span className="text-destructive/80">— totaling ${invoices.filter((i) => i.status === "Overdue").reduce((a, i) => a + i.total, 0).toLocaleString()}</span>
          <Link to="/invoices" className="ml-auto inline-flex items-center gap-1 text-xs font-semibold hover:underline">
            Review <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
      )}

      {/* MAIN CHART + STATUS DONUT */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Panel className="lg:col-span-2">
          <PanelHeader title="Revenue Overview" subtitle="Monthly recurring revenue, last 7 months">
            <div className="flex items-center gap-4 text-xs">
              <LegendDot color="hsl(var(--primary))" label="MRR" />
              <span className="font-semibold text-success">+8.4%</span>
            </div>
          </PanelHeader>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyRevenue} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  formatter={(v: number) => [`$${v.toLocaleString()}`, "Revenue"]}
                />
                <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2.5} fill="url(#revGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel>
          <PanelHeader title="Account Status" subtitle="Subscriber distribution" />
          <div className="flex items-center justify-center">
            <div className="relative h-44 w-44">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={accountStatusBreakdown}
                    dataKey="value"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    stroke="hsl(var(--card))"
                    strokeWidth={2}
                  >
                    {accountStatusBreakdown.map((d, i) => {
                      const colors = ["hsl(var(--success))", "hsl(var(--info))", "hsl(var(--destructive))", "hsl(var(--warning))"];
                      return <Cell key={i} fill={colors[i % colors.length]} />;
                    })}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-2xl font-bold">{fmt(kpiSummary.totalSubscribers)}</div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Accounts</div>
              </div>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            {accountStatusBreakdown.map((s, i) => {
              const colors = ["hsl(var(--success))", "hsl(var(--info))", "hsl(var(--destructive))", "hsl(var(--warning))"];
              return (
                <div key={s.name} className="flex items-center justify-between rounded-md bg-muted/40 px-2 py-1.5">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full" style={{ background: colors[i] }} />
                    {s.name}
                  </span>
                  <span className="font-semibold">{s.value}</span>
                </div>
              );
            })}
          </div>
        </Panel>
      </div>

      {/* GROWTH + MODULES */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Panel>
          <PanelHeader title="Subscriber Growth" subtitle="Net new subscribers" />
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={subscriberGrowth} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="subscribers" stroke="hsl(var(--info))" strokeWidth={2.5} dot={{ r: 4, fill: "hsl(var(--info))" }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel className="lg:col-span-2">
          <PanelHeader title="Module Usage" subtitle="Most adopted modules across tenants">
            <Link to="/modules" className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
              Manage <ArrowUpRight className="h-3 w-3" />
            </Link>
          </PanelHeader>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={moduleUsage} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="module" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} angle={-10} textAnchor="end" height={50} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }} />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      {/* DEVICES + TOP SUBSCRIBERS + ALERTS */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Panel>
          <PanelHeader title="Device Health" subtitle={`${devicesData.length} devices total`} />
          <div className="space-y-3">
            <HealthBar icon={Wifi} label="Online" value={onlineDevices} total={devicesData.length} tone="success" />
            <HealthBar icon={WifiOff} label="Offline" value={offlineDevices} total={devicesData.length} tone="destructive" />
            <HealthBar icon={Zap} label="Active" value={devicesData.filter((d) => d.active).length} total={devicesData.length} tone="primary" />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-4">
            {(["Face", "Fingerprint", "RFID"] as const).map((t) => {
              const n = devicesData.filter((d) => d.type === t).length;
              return (
                <div key={t} className="rounded-lg bg-muted/40 p-2 text-center">
                  <div className="text-lg font-bold">{n}</div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{t}</div>
                </div>
              );
            })}
          </div>
        </Panel>

        <Panel>
          <PanelHeader title="Top Subscribers" subtitle="By monthly value">
            <Link to="/subscribers" className="text-xs font-medium text-primary hover:underline">View all</Link>
          </PanelHeader>
          <ul className="space-y-2">
            {topSubs.map((s, i) => (
              <li key={s.id}>
                <Link to="/subscribers/$id" params={{ id: s.id }} className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted/50">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-xs font-bold text-primary">
                    {i + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{s.company}</div>
                    <div className="text-xs text-muted-foreground">{s.plan} • {s.country}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">{money(s.monthlyValue)}</div>
                    <div className="text-[10px] text-muted-foreground">/mo</div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel>
          <PanelHeader title="Renewal Alerts" subtitle={`${renewalAlerts.length} upcoming`}>
            <Link to="/alerts" className="text-xs font-medium text-primary hover:underline">View all</Link>
          </PanelHeader>
          <ul className="space-y-2">
            {renewalAlerts.slice(0, 5).map((a) => {
              const tone = a.days < 0 ? "danger" : a.days <= 7 ? "warning" : "info";
              return (
                <li key={a.id} className="flex items-center justify-between gap-2 rounded-lg p-2 hover:bg-muted/50">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{a.company}</div>
                    <div className="text-xs text-muted-foreground">{a.type}</div>
                  </div>
                  <Badge tone={tone}>
                    {a.days < 0 ? `−${-a.days}d` : `${a.days}d`}
                  </Badge>
                </li>
              );
            })}
          </ul>
        </Panel>
      </div>

      {/* ACTIVITY FEED */}
      <Panel>
        <PanelHeader title="Recent Activity" subtitle="Latest events across the platform">
          <Link to="/activity" className="text-xs font-medium text-primary hover:underline">View log</Link>
        </PanelHeader>
        <ul className="divide-y divide-border">
          {activityLogs.slice(0, 6).map((a) => {
            const toneMap = { create: "success", update: "info", delete: "danger", billing: "primary", security: "warning" } as const;
            return (
              <li key={a.id} className="flex items-center gap-3 py-3">
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${toneMap[a.type] === "success" ? "bg-success/15 text-success" : toneMap[a.type] === "danger" ? "bg-destructive/15 text-destructive" : toneMap[a.type] === "warning" ? "bg-warning/15 text-warning-foreground" : toneMap[a.type] === "primary" ? "bg-primary-soft text-primary" : "bg-info/15 text-info"}`}>
                  <Activity className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm">
                    <span className="font-medium">{a.actor}</span>{" "}
                    <span className="text-muted-foreground">{a.action.toLowerCase()}</span>{" "}
                    <span className="font-medium">{a.target}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <Clock className="mr-1 inline h-3 w-3" />{a.time}
                  </div>
                </div>
                <Badge tone={toneMap[a.type]}>{a.type}</Badge>
              </li>
            );
          })}
        </ul>
      </Panel>
    </div>
  );
}

/* ---------- atoms ---------- */

function HeroStat({ label, value, delta, up }: { label: string; value: string; delta: string; up?: boolean }) {
  return (
    <div className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-primary-foreground/70">{label}</div>
      <div className="mt-1 text-xl font-bold">{value}</div>
      <div className="mt-0.5 text-[11px] text-primary-foreground/80">
        {up !== undefined && (up ? <TrendingUp className="mr-0.5 inline h-3 w-3" /> : <TrendingDown className="mr-0.5 inline h-3 w-3" />)}
        {delta}
      </div>
    </div>
  );
}

function KpiTile({ icon: Icon, label, value, delta, up, tone, bg, trend }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; delta: string; up?: boolean; tone: string; bg: string; trend: { v: number }[] }) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-4 transition hover:border-primary/40 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</div>
          <div className="mt-1.5 text-2xl font-bold tracking-tight">{value}</div>
          <div className={`mt-1 inline-flex items-center gap-1 text-xs font-medium ${up ? "text-success" : "text-muted-foreground"}`}>
            {up && <TrendingUp className="h-3 w-3" />} {delta}
          </div>
        </div>
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${bg} ${tone}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-10 opacity-60 transition group-hover:opacity-100">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trend}>
            <defs>
              <linearGradient id={`spark-${label}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="v" stroke="hsl(var(--primary))" strokeWidth={1.5} fill={`url(#spark-${label})`} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-border bg-card p-5 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

function PanelHeader({ title, subtitle, children }: { title: string; subtitle?: string; children?: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-start justify-between gap-2">
      <div>
        <div className="text-sm font-semibold">{title}</div>
        {subtitle && <div className="text-xs text-muted-foreground">{subtitle}</div>}
      </div>
      {children}
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
      <span className="h-2 w-2 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}

function HealthBar({ icon: Icon, label, value, total, tone }: { icon: React.ComponentType<{ className?: string }>; label: string; value: number; total: number; tone: "success" | "destructive" | "primary" }) {
  const pct = total === 0 ? 0 : (value / total) * 100;
  const colorClass = tone === "success" ? "bg-success" : tone === "destructive" ? "bg-destructive" : "bg-primary";
  const textClass = tone === "success" ? "text-success" : tone === "destructive" ? "text-destructive" : "text-primary";
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="inline-flex items-center gap-1.5 font-medium">
          <Icon className={`h-3.5 w-3.5 ${textClass}`} /> {label}
        </span>
        <span className="text-muted-foreground">{value} / {total}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div className={`h-full rounded-full ${colorClass} transition-all`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

