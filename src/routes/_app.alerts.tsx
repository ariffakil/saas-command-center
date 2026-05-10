import { createFileRoute, Link } from "@tanstack/react-router";
import { renewalAlerts, invoices, subscribers } from "@/lib/mock-data";
import { PageHeader, Card, CardTitle, Badge, type Tone } from "@/components/ui-bits";
import { AlertTriangle, BellRing, Clock, ShieldAlert } from "lucide-react";

export const Route = createFileRoute("/_app/alerts")({ component: AlertsPage });

function AlertsPage() {
  const overdue = invoices.filter((i) => i.status === "Overdue");
  const suspended = subscribers.filter((s) => s.status === "Suspended");
  const exceeded = subscribers.filter((s) => s.devices.used >= s.devices.limit || s.users.used / s.users.limit >= 1);
  const soon = renewalAlerts.filter((r) => r.days >= 0 && r.days <= 7);
  const later = renewalAlerts.filter((r) => r.days > 7 && r.days <= 30);
  const expired = renewalAlerts.filter((r) => r.days < 0);

  return (
    <div>
      <PageHeader title="Renewal & Expiry Alerts" description="Critical events that need your attention." />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card><CardTitle><span className="inline-flex items-center gap-2"><BellRing className="h-4 w-4 text-warning" /> Expiring in 7 days</span></CardTitle>
          <List items={soon.map((r) => ({ id: r.id, title: r.company, sub: `${r.type} • In ${r.days} days`, tone: "warning" }))} /></Card>
        <Card><CardTitle><span className="inline-flex items-center gap-2"><Clock className="h-4 w-4 text-info" /> Expiring in 30 days</span></CardTitle>
          <List items={later.map((r) => ({ id: r.id, title: r.company, sub: `${r.type} • In ${r.days} days`, tone: "info" }))} /></Card>
        <Card><CardTitle><span className="inline-flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-destructive" /> Overdue payments</span></CardTitle>
          <List items={overdue.map((i) => ({ id: i.id, title: i.subscriber, sub: `${i.id} • $${i.total.toLocaleString()} • Due ${i.dueDate}`, tone: "danger" }))} /></Card>
        <Card><CardTitle><span className="inline-flex items-center gap-2"><ShieldAlert className="h-4 w-4 text-destructive" /> Expired accounts</span></CardTitle>
          <List items={expired.map((r) => ({ id: r.id, title: r.company, sub: `Expired ${-r.days} days ago`, tone: "danger" }))} /></Card>
        <Card><CardTitle>Suspended accounts</CardTitle>
          <List items={suspended.map((s) => ({ id: s.id, title: s.company, sub: `${s.plan} • ${s.country}`, tone: "warning" }))} /></Card>
        <Card><CardTitle>License limits exceeded</CardTitle>
          <List items={exceeded.map((s) => ({ id: s.id, title: s.company, sub: `Devices ${s.devices.used}/${s.devices.limit} • Users ${s.users.used}/${s.users.limit}`, tone: "danger" }))} /></Card>
      </div>
    </div>
  );
}

function List({ items }: { items: { id: string; title: string; sub: string; tone: Tone }[] }) {
  if (items.length === 0) return <div className="py-3 text-sm text-muted-foreground">Nothing here. ✓</div>;
  return (
    <ul className="divide-y divide-border">
      {items.map((it, idx) => (
        <li key={it.id + idx} className="flex items-center justify-between py-3">
          <div>
            <Link to="/subscribers" className="text-sm font-medium hover:underline">{it.title}</Link>
            <div className="text-xs text-muted-foreground">{it.sub}</div>
          </div>
          <Badge tone={it.tone}>{it.id}</Badge>
        </li>
      ))}
    </ul>
  );
}