import { createFileRoute, Link } from "@tanstack/react-router";
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
  moduleUsage, deviceStatus, renewalAlerts,
} from "@/lib/mock-data";
import { KpiCard, PageHeader, Card, CardTitle, Badge, statusTone } from "@/components/ui-bits";

export const Route = createFileRoute("/_app/")({
  component: Dashboard,
});

const fmt = (n: number) => n.toLocaleString();
const money = (n: number) => `$${n.toLocaleString()}`;

function Dashboard() {
  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Overview of subscribers, revenue, devices, and renewals across your platform."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <KpiCard label="Total Subscribers" value={fmt(kpiSummary.totalSubscribers)} hint="+8 this month" icon={Building2} tone="primary" />
        <KpiCard label="Active Subscribers" value={fmt(kpiSummary.activeSubscribers)} hint="67% of total" icon={CheckCircle2} tone="success" />
        <KpiCard label="Trial Accounts" value={fmt(kpiSummary.trialAccounts)} hint="6 expiring soon" icon={Sparkles} tone="info" />
        <KpiCard label="Expired" value={fmt(kpiSummary.expiredSubscriptions)} hint="Needs follow-up" icon={Clock} tone="danger" />
        <KpiCard label="Monthly Revenue" value={money(kpiSummary.monthlyRevenue)} hint="+8.4% vs last month" icon={DollarSign} tone="success" />
        <KpiCard label="Total Users" value={fmt(kpiSummary.totalUsers)} hint="Across all tenants" icon={Users} tone="primary" />
        <KpiCard label="Total Devices" value={fmt(kpiSummary.totalDevices)} hint="412 online" icon={Cpu} tone="info" />
        <KpiCard label="Total Branches" value={fmt(kpiSummary.totalBranches)} hint="32 added this quarter" icon={GitBranch} tone="primary" />
        <KpiCard label="Pending Payments" value={money(kpiSummary.pendingPayments)} hint="3 invoices overdue" icon={AlertTriangle} tone="warning" />
        <KpiCard label="Upcoming Renewals" value={fmt(kpiSummary.upcomingRenewals)} hint="Next 30 days" icon={BellRing} tone="warning" />
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
    </div>
  );
}