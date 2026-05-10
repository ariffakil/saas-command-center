import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft, Building2, Mail, Phone, MapPin, Pause, Play, Trash2,
} from "lucide-react";
import {
  subscribers, moduleList, branches as allBranches, devices as allDevices,
  invoices as allInvoices, payments as allPayments, quotations, activityLogs,
} from "@/lib/mock-data";
import { PageHeader, Card, CardTitle, Btn, Badge, statusTone, Progress, TableShell, Th, Td } from "@/components/ui-bits";

export const Route = createFileRoute("/_app/subscribers/$id")({
  component: SubscriberDetail,
  loader: ({ params }) => {
    const sub = subscribers.find((s) => s.id === params.id);
    if (!sub) throw notFound();
    return { sub };
  },
  notFoundComponent: () => (
    <div className="p-8 text-center">
      <h1 className="text-xl font-semibold">Subscriber not found</h1>
      <Link to="/subscribers" className="mt-2 inline-block text-primary hover:underline">Back to subscribers</Link>
    </div>
  ),
  errorComponent: ({ error }) => <div className="p-6 text-destructive">{error.message}</div>,
});

const TABS = ["Overview", "Subscription", "Modules", "Users", "Devices", "Branches", "Invoices", "Quotations", "Payments", "Activity"] as const;
type Tab = (typeof TABS)[number];

function SubscriberDetail() {
  const { sub } = Route.useLoaderData();
  const [tab, setTab] = useState<Tab>("Overview");
  const subBranches = allBranches.filter((b) => b.subscriberId === sub.id);
  const subDevices = allDevices.filter((d) => d.subscriberId === sub.id);
  const subInvoices = allInvoices.filter((i) => i.subscriberId === sub.id);
  const subPayments = allPayments.filter((p) => p.subscriber === sub.company);

  return (
    <div>
      <PageHeader
        title={sub.company}
        description={`${sub.id} • ${sub.businessType} • ${sub.city}, ${sub.country}`}
        actions={
          <>
            <Link to="/subscribers"><Btn variant="outline"><ArrowLeft className="h-4 w-4" /> Back</Btn></Link>
            {sub.status === "Suspended" ? (
              <Btn><Play className="h-4 w-4" /> Activate</Btn>
            ) : (
              <Btn variant="outline"><Pause className="h-4 w-4" /> Suspend</Btn>
            )}
            <Btn variant="danger"><Trash2 className="h-4 w-4" /> Delete</Btn>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card>
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-soft text-accent-foreground">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <div className="text-sm font-semibold">{sub.holder}</div>
              <Badge tone={statusTone(sub.status)}>{sub.status}</Badge>
            </div>
          </div>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2"><Mail className="h-4 w-4" /> {sub.email}</div>
            <div className="flex items-center gap-2"><Phone className="h-4 w-4" /> {sub.phone}</div>
            <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {sub.city}, {sub.country}</div>
          </div>
        </Card>

        <Card>
          <CardTitle>Subscription</CardTitle>
          <dl className="grid grid-cols-2 gap-y-2 text-sm">
            <dt className="text-muted-foreground">Plan</dt><dd className="font-medium">{sub.plan}</dd>
            <dt className="text-muted-foreground">Start</dt><dd>{sub.startDate}</dd>
            <dt className="text-muted-foreground">Expiry</dt><dd>{sub.expiryDate}</dd>
            <dt className="text-muted-foreground">MRR</dt><dd className="font-medium">${sub.monthlyValue.toLocaleString()}</dd>
          </dl>
        </Card>

        <Card>
          <CardTitle>License Usage</CardTitle>
          <div className="space-y-3 text-sm">
            <div>
              <div className="mb-1 flex justify-between"><span>Users</span><span className="text-muted-foreground">{sub.users.used} / {sub.users.limit}</span></div>
              <Progress value={sub.users.used} max={sub.users.limit} />
            </div>
            <div>
              <div className="mb-1 flex justify-between"><span>Devices</span><span className="text-muted-foreground">{sub.devices.used} / {sub.devices.limit}</span></div>
              <Progress value={sub.devices.used} max={sub.devices.limit} />
            </div>
            <div>
              <div className="mb-1 flex justify-between"><span>Branches</span><span className="text-muted-foreground">{sub.branches.used} / {sub.branches.limit}</span></div>
              <Progress value={sub.branches.used} max={sub.branches.limit} />
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-6 flex gap-1 overflow-x-auto rounded-xl border border-border bg-card p-1 shadow-sm">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`whitespace-nowrap rounded-md px-3 py-1.5 text-sm transition ${
              tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
            }`}>{t}</button>
        ))}
      </div>

      <div className="mt-4">
        {tab === "Overview" && (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card><CardTitle>Recent Invoices</CardTitle>
              <ul className="divide-y divide-border text-sm">
                {subInvoices.slice(0,5).map((i)=>(
                  <li key={i.id} className="flex items-center justify-between py-2">
                    <span>{i.id}</span>
                    <Badge tone={statusTone(i.status)}>{i.status}</Badge>
                    <span className="font-medium">${i.total.toLocaleString()}</span>
                  </li>
                ))}
                {subInvoices.length === 0 && <li className="py-3 text-muted-foreground">No invoices yet.</li>}
              </ul>
            </Card>
            <Card><CardTitle>Recent Activity</CardTitle>
              <ul className="divide-y divide-border text-sm">
                {activityLogs.slice(0,5).map((a)=>(
                  <li key={a.id} className="py-2">
                    <div>{a.action}</div>
                    <div className="text-xs text-muted-foreground">{a.time} • {a.target}</div>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        )}

        {tab === "Modules" && (
          <Card>
            <CardTitle>Module Control</CardTitle>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {moduleList.map((m, i) => <ModuleToggle key={m} name={m} initial={i % 4 !== 3} />)}
            </div>
          </Card>
        )}

        {tab === "Subscription" && (
          <Card>
            <CardTitle>Plan Details</CardTitle>
            <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
              <Stat label="Plan" value={sub.plan} />
              <Stat label="Billing" value="Yearly" />
              <Stat label="Auto-renew" value="On" />
              <Stat label="Status" value={<Badge tone={statusTone(sub.status)}>{sub.status}</Badge>} />
              <Stat label="Subtotal" value={`$${(sub.monthlyValue*12).toLocaleString()}`} />
              <Stat label="Discount" value="$0" />
              <Stat label="Tax (5%)" value={`$${Math.round(sub.monthlyValue*12*0.05).toLocaleString()}`} />
              <Stat label="Final" value={`$${Math.round(sub.monthlyValue*12*1.05).toLocaleString()}`} />
            </div>
          </Card>
        )}

        {tab === "Users" && (
          <Card>
            <CardTitle>User Limit</CardTitle>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Stat label="Licensed" value={sub.users.limit} />
              <Stat label="Active" value={Math.round(sub.users.used*0.9)} />
              <Stat label="Inactive" value={Math.round(sub.users.used*0.1)} />
              <Stat label="Remaining" value={sub.users.limit - sub.users.used} />
            </div>
          </Card>
        )}

        {tab === "Devices" && (
          <TableShell>
            <thead className="bg-muted/40"><tr>
              <Th>Device</Th><Th>Serial</Th><Th>Type</Th><Th>Branch</Th><Th>Last Sync</Th><Th>Status</Th>
            </tr></thead>
            <tbody className="divide-y divide-border">
              {subDevices.map((d)=>(
                <tr key={d.id}>
                  <Td>{d.name}</Td><Td className="text-muted-foreground">{d.serial}</Td>
                  <Td>{d.type}</Td><Td>{d.branch}</Td><Td>{d.lastSync}</Td>
                  <Td><Badge tone={d.online ? "success" : "danger"}>{d.online ? "Online" : "Offline"}</Badge></Td>
                </tr>
              ))}
            </tbody>
          </TableShell>
        )}

        {tab === "Branches" && (
          <TableShell>
            <thead className="bg-muted/40"><tr>
              <Th>Branch</Th><Th>Location</Th><Th>Manager</Th><Th>Users</Th><Th>Devices</Th><Th>Status</Th>
            </tr></thead>
            <tbody className="divide-y divide-border">
              {subBranches.map((b)=>(
                <tr key={b.id}>
                  <Td>{b.name}</Td><Td>{b.location}</Td><Td>{b.manager}</Td>
                  <Td>{b.users}</Td><Td>{b.devices}</Td>
                  <Td><Badge tone={statusTone(b.status)}>{b.status}</Badge></Td>
                </tr>
              ))}
            </tbody>
          </TableShell>
        )}

        {tab === "Invoices" && (
          <TableShell>
            <thead className="bg-muted/40"><tr>
              <Th>Invoice</Th><Th>Date</Th><Th>Total</Th><Th>Status</Th>
            </tr></thead>
            <tbody className="divide-y divide-border">
              {subInvoices.map((i)=>(
                <tr key={i.id}><Td>{i.id}</Td><Td>{i.date}</Td><Td>${i.total.toLocaleString()}</Td>
                  <Td><Badge tone={statusTone(i.status)}>{i.status}</Badge></Td></tr>
              ))}
              {subInvoices.length === 0 && <tr><Td className="text-muted-foreground">No invoices.</Td><Td></Td><Td></Td><Td></Td></tr>}
            </tbody>
          </TableShell>
        )}

        {tab === "Quotations" && (
          <TableShell>
            <thead className="bg-muted/40"><tr><Th>Quote</Th><Th>Plan</Th><Th>Total</Th><Th>Status</Th></tr></thead>
            <tbody className="divide-y divide-border">
              {quotations.slice(0,3).map((q)=>(
                <tr key={q.id}><Td>{q.id}</Td><Td>{q.plan}</Td><Td>${q.total.toLocaleString()}</Td>
                  <Td><Badge tone={statusTone(q.status)}>{q.status}</Badge></Td></tr>
              ))}
            </tbody>
          </TableShell>
        )}

        {tab === "Payments" && (
          <TableShell>
            <thead className="bg-muted/40"><tr><Th>Date</Th><Th>Invoice</Th><Th>Amount</Th><Th>Method</Th><Th>Status</Th></tr></thead>
            <tbody className="divide-y divide-border">
              {subPayments.map((p)=>(
                <tr key={p.id}><Td>{p.date}</Td><Td>{p.invoiceId}</Td>
                  <Td>${p.amount.toLocaleString()}</Td><Td>{p.method}</Td>
                  <Td><Badge tone={statusTone(p.status)}>{p.status}</Badge></Td></tr>
              ))}
              {subPayments.length === 0 && <tr><Td className="text-muted-foreground">No payments.</Td><Td></Td><Td></Td><Td></Td><Td></Td></tr>}
            </tbody>
          </TableShell>
        )}

        {tab === "Activity" && (
          <Card><ul className="divide-y divide-border text-sm">
            {activityLogs.map((a)=>(
              <li key={a.id} className="py-3">
                <div className="font-medium">{a.action}</div>
                <div className="text-xs text-muted-foreground">{a.time} • {a.actor} → {a.target}</div>
              </li>
            ))}
          </ul></Card>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-background p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 text-base font-semibold">{value}</div>
    </div>
  );
}

import { useState as useS } from "react";
function ModuleToggle({ name, initial }: { name: string; initial: boolean }) {
  const [on, setOn] = useS(initial);
  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-background p-3">
      <div className="text-sm font-medium">{name}</div>
      <button
        onClick={() => setOn((v) => !v)}
        className={`relative h-6 w-11 rounded-full transition ${on ? "bg-primary" : "bg-muted-foreground/30"}`}
        aria-label={`Toggle ${name}`}
      >
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${on ? "left-5" : "left-0.5"}`} />
      </button>
    </div>
  );
}