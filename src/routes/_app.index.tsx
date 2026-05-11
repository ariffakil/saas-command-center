import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Building2, CheckCircle2, Clock, Sparkles, Users, Cpu, GitBranch,
  DollarSign, AlertTriangle, BellRing, ArrowUpRight,
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, Legend,
} from "recharts";
import {
  kpiSummary, monthlyRevenue, subscriberGrowth, accountStatusBreakdown,
  moduleUsage, deviceStatus, renewalAlerts, subscribers, devices as devicesData,
  branches as branchesData, invoices,
} from "@/lib/mock-data";
import { KpiCard, PageHeader, Card, CardTitle, Badge, statusTone } from "@/components/ui-bits";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export const Route = createFileRoute("/_app/")({
  component: Dashboard,
});

const fmt = (n: number) => n.toLocaleString();
const money = (n: number) => `$${n.toLocaleString()}`;

type KpiKey =
  | "totalSubscribers" | "activeSubscribers" | "trialAccounts" | "expiredSubscriptions"
  | "monthlyRevenue" | "totalUsers" | "totalDevices" | "totalBranches"
  | "pendingPayments" | "upcomingRenewals";

function Dashboard() {
  const [openKpi, setOpenKpi] = useState<KpiKey | null>(null);
  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Overview of subscribers, revenue, devices, and renewals across your platform."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <KpiCard label="Total Subscribers" value={fmt(kpiSummary.totalSubscribers)} hint="+8 this month" icon={Building2} tone="primary" onClick={() => setOpenKpi("totalSubscribers")} />
        <KpiCard label="Active Subscribers" value={fmt(kpiSummary.activeSubscribers)} hint="67% of total" icon={CheckCircle2} tone="success" onClick={() => setOpenKpi("activeSubscribers")} />
        <KpiCard label="Trial Accounts" value={fmt(kpiSummary.trialAccounts)} hint="6 expiring soon" icon={Sparkles} tone="info" onClick={() => setOpenKpi("trialAccounts")} />
        <KpiCard label="Expired" value={fmt(kpiSummary.expiredSubscriptions)} hint="Needs follow-up" icon={Clock} tone="danger" onClick={() => setOpenKpi("expiredSubscriptions")} />
        <KpiCard label="Monthly Revenue" value={money(kpiSummary.monthlyRevenue)} hint="+8.4% vs last month" icon={DollarSign} tone="success" onClick={() => setOpenKpi("monthlyRevenue")} />
        <KpiCard label="Total Users" value={fmt(kpiSummary.totalUsers)} hint="Across all tenants" icon={Users} tone="primary" onClick={() => setOpenKpi("totalUsers")} />
        <KpiCard label="Total Devices" value={fmt(kpiSummary.totalDevices)} hint="412 online" icon={Cpu} tone="info" onClick={() => setOpenKpi("totalDevices")} />
        <KpiCard label="Total Branches" value={fmt(kpiSummary.totalBranches)} hint="32 added this quarter" icon={GitBranch} tone="primary" onClick={() => setOpenKpi("totalBranches")} />
        <KpiCard label="Pending Payments" value={money(kpiSummary.pendingPayments)} hint="3 invoices overdue" icon={AlertTriangle} tone="warning" onClick={() => setOpenKpi("pendingPayments")} />
        <KpiCard label="Upcoming Renewals" value={fmt(kpiSummary.upcomingRenewals)} hint="Next 30 days" icon={BellRing} tone="warning" onClick={() => setOpenKpi("upcomingRenewals")} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardTitle action={<Badge tone="success">+8.4%</Badge>}>Monthly Revenue</CardTitle>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyRevenue} margin={{ left: -10, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Area type="monotone" dataKey="revenue" stroke="var(--primary)" strokeWidth={2} fill="url(#rev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardTitle>Account Status</CardTitle>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={accountStatusBreakdown} dataKey="value" innerRadius={55} outerRadius={90} paddingAngle={2}>
                  {accountStatusBreakdown.map((e) => (<Cell key={e.name} fill={e.color} />))}
                </Pie>
                <Legend />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card>
          <CardTitle>Subscriber Growth</CardTitle>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={subscriberGrowth} margin={{ left: -10, right: 8, top: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Line type="monotone" dataKey="subscribers" stroke="var(--chart-2)" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardTitle>Module Usage</CardTitle>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={moduleUsage} margin={{ left: -10, right: 8, top: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="module" stroke="var(--muted-foreground)" fontSize={11} interval={0} angle={-15} textAnchor="end" height={60} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Bar dataKey="count" fill="var(--primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardTitle>Device Status</CardTitle>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={deviceStatus} dataKey="value" outerRadius={90}>
                  {deviceStatus.map((e) => <Cell key={e.name} fill={e.color} />)}
                </Pie>
                <Legend />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardTitle action={<Link to="/alerts" className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">View all <ArrowUpRight className="h-3 w-3" /></Link>}>
            Renewal & Expiry Alerts
          </CardTitle>
          <div className="divide-y divide-border">
            {renewalAlerts.map((a) => (
              <div key={a.id} className="flex items-center justify-between py-3">
                <div>
                  <div className="text-sm font-medium text-card-foreground">{a.company}</div>
                  <div className="text-xs text-muted-foreground">{a.id} • {a.type}</div>
                </div>
                <Badge tone={a.days < 0 ? "danger" : a.days <= 7 ? "warning" : "info"}>
                  {a.days < 0 ? `Expired ${-a.days}d ago` : `In ${a.days} days`}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <KpiDetailsDialog kpi={openKpi} onClose={() => setOpenKpi(null)} />
    </div>
  );
}

function KpiDetailsDialog({ kpi, onClose }: { kpi: KpiKey | null; onClose: () => void }) {
  const open = kpi !== null;
  const meta = kpi ? KPI_META[kpi] : null;
  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        {meta && (
          <>
            <DialogHeader>
              <DialogTitle>{meta.title}</DialogTitle>
              <DialogDescription>{meta.description}</DialogDescription>
            </DialogHeader>
            <div className="mt-2">{meta.render()}</div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function StatRow({ label, value, tone }: { label: string; value: React.ReactNode; tone?: Parameters<typeof Badge>[0]["tone"] }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      {tone ? <Badge tone={tone}>{value}</Badge> : <span className="font-medium text-card-foreground">{value}</span>}
    </div>
  );
}

function MiniList<T>({ items, render, empty = "No records" }: { items: T[]; render: (it: T) => React.ReactNode; empty?: string }) {
  if (!items.length) return <div className="rounded-lg border border-dashed border-border p-4 text-center text-sm text-muted-foreground">{empty}</div>;
  return <div className="divide-y divide-border rounded-lg border border-border">{items.map((it, i) => <div key={i} className="px-3 py-2 text-sm">{render(it)}</div>)}</div>;
}

const KPI_META: Record<KpiKey, { title: string; description: string; render: () => React.ReactNode }> = {
  totalSubscribers: {
    title: "Total Subscribers",
    description: "All companies registered on the platform.",
    render: () => {
      const byStatus = subscribers.reduce<Record<string, number>>((a, s) => { a[s.status] = (a[s.status] ?? 0) + 1; return a; }, {});
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(byStatus).map(([k, v]) => <StatRow key={k} label={k} value={v} tone={statusTone(k)} />)}
          </div>
          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Recent subscribers</div>
            <MiniList items={subscribers.slice(0, 6)} render={(s) => (
              <div className="flex items-center justify-between"><div><div className="font-medium">{s.company}</div><div className="text-xs text-muted-foreground">{s.id} • {s.country}</div></div><Badge tone={statusTone(s.status)}>{s.status}</Badge></div>
            )} />
          </div>
          <Link to="/subscribers" className="inline-block text-sm font-medium text-primary hover:underline">View all subscribers →</Link>
        </div>
      );
    },
  },
  activeSubscribers: {
    title: "Active Subscribers",
    description: "Companies with an active paid subscription.",
    render: () => {
      const list = subscribers.filter((s) => s.status === "Active");
      return (
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            <StatRow label="Active" value={list.length} tone="success" />
            <StatRow label="Total MRR" value={`$${list.reduce((a, s) => a + s.monthlyValue, 0).toLocaleString()}`} />
            <StatRow label="Avg ARPA" value={`$${Math.round(list.reduce((a, s) => a + s.monthlyValue, 0) / list.length).toLocaleString()}`} />
          </div>
          <MiniList items={list} render={(s) => (
            <div className="flex items-center justify-between"><div><div className="font-medium">{s.company}</div><div className="text-xs text-muted-foreground">{s.plan} • Expires {s.expiryDate}</div></div><span className="text-sm font-medium">${s.monthlyValue}/mo</span></div>
          )} />
        </div>
      );
    },
  },
  trialAccounts: {
    title: "Trial Accounts",
    description: "Subscribers currently on a free trial.",
    render: () => {
      const list = subscribers.filter((s) => s.status === "Trial");
      return <MiniList items={list} render={(s) => (
        <div className="flex items-center justify-between"><div><div className="font-medium">{s.company}</div><div className="text-xs text-muted-foreground">{s.holder} • Trial ends {s.expiryDate}</div></div><Badge tone="info">Trial</Badge></div>
      )} />;
    },
  },
  expiredSubscriptions: {
    title: "Expired Subscriptions",
    description: "Accounts whose license has lapsed and need follow-up.",
    render: () => {
      const list = subscribers.filter((s) => s.status === "Expired");
      return <MiniList items={list} render={(s) => (
        <div className="flex items-center justify-between"><div><div className="font-medium">{s.company}</div><div className="text-xs text-muted-foreground">{s.id} • Expired {s.expiryDate}</div></div><Badge tone="danger">Expired</Badge></div>
      )} />;
    },
  },
  monthlyRevenue: {
    title: "Monthly Revenue",
    description: "Recurring revenue trend across the last 7 months.",
    render: () => (
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-2">
          <StatRow label="This month" value={`$${kpiSummary.monthlyRevenue.toLocaleString()}`} tone="success" />
          <StatRow label="Last month" value="$52,400" />
          <StatRow label="Growth" value="+8.4%" tone="success" />
        </div>
        <MiniList items={[...monthlyRevenue].reverse()} render={(m) => (
          <div className="flex items-center justify-between"><span className="text-muted-foreground">{m.month}</span><span className="font-medium">${m.revenue.toLocaleString()}</span></div>
        )} />
      </div>
    ),
  },
  totalUsers: {
    title: "Total Users",
    description: "Aggregate users provisioned across all tenants.",
    render: () => {
      const top = [...subscribers].sort((a, b) => b.users.used - a.users.used).slice(0, 6);
      return (
        <div className="space-y-3">
          <StatRow label="Total users" value={kpiSummary.totalUsers.toLocaleString()} />
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Top tenants by users</div>
          <MiniList items={top} render={(s) => (
            <div className="flex items-center justify-between"><div className="font-medium">{s.company}</div><span className="text-sm">{s.users.used} / {s.users.limit}</span></div>
          )} />
        </div>
      );
    },
  },
  totalDevices: {
    title: "Total Devices",
    description: "Face Recognition, Fingerprint and RFID devices on the platform.",
    render: () => {
      const online = devicesData.filter((d) => d.online).length;
      const offline = devicesData.length - online;
      return (
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            <StatRow label="Total" value={kpiSummary.totalDevices} />
            <StatRow label="Online" value={online} tone="success" />
            <StatRow label="Offline" value={offline} tone="danger" />
          </div>
          <MiniList items={devicesData.slice(0, 6)} render={(d) => (
            <div className="flex items-center justify-between"><div><div className="font-medium">{d.name}</div><div className="text-xs text-muted-foreground">{d.branch} • {d.type}</div></div><Badge tone={d.online ? "success" : "danger"}>{d.online ? "Online" : "Offline"}</Badge></div>
          )} />
        </div>
      );
    },
  },
  totalBranches: {
    title: "Total Branches",
    description: "Branches registered across all subscriber companies.",
    render: () => (
      <div className="space-y-3">
        <StatRow label="Total branches" value={kpiSummary.totalBranches} />
        <MiniList items={branchesData.slice(0, 6)} render={(b) => (
          <div className="flex items-center justify-between"><div><div className="font-medium">{b.name}</div><div className="text-xs text-muted-foreground">{b.location} • {b.manager}</div></div><Badge tone={statusTone(b.status)}>{b.status}</Badge></div>
        )} />
      </div>
    ),
  },
  pendingPayments: {
    title: "Pending Payments",
    description: "Outstanding invoices awaiting collection.",
    render: () => {
      const list = invoices.filter((i) => i.status === "Pending" || i.status === "Overdue" || i.status === "Partial");
      return <MiniList items={list} render={(i) => (
        <div className="flex items-center justify-between"><div><div className="font-medium">{i.subscriber}</div><div className="text-xs text-muted-foreground">{i.id} • Due {i.dueDate}</div></div><div className="flex items-center gap-2"><span className="font-medium">${i.total.toLocaleString()}</span><Badge tone={statusTone(i.status)}>{i.status}</Badge></div></div>
      )} />;
    },
  },
  upcomingRenewals: {
    title: "Upcoming Renewals",
    description: "Subscriptions and trials ending in the next 30 days.",
    render: () => (
      <MiniList items={renewalAlerts} render={(a) => (
        <div className="flex items-center justify-between"><div><div className="font-medium">{a.company}</div><div className="text-xs text-muted-foreground">{a.id} • {a.type}</div></div><Badge tone={a.days < 0 ? "danger" : a.days <= 7 ? "warning" : "info"}>{a.days < 0 ? `Expired ${-a.days}d ago` : `In ${a.days} days`}</Badge></div>
      )} />
    ),
  },
};