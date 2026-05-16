import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import React, { useState } from "react";
import {
  ArrowLeft, Building2, Mail, Phone, MapPin, Pause, Play, Trash2, Plus, Pencil,
  Cloud, Monitor, Key, Copy, Check,
} from "lucide-react";
import {
  subscribers, moduleList, branches as allBranches, devices as allDevices,
  invoices as allInvoices, payments as allPayments, quotations, activityLogs,
  type Branch,
} from "@/lib/mock-data";
import { PageHeader, Card, CardTitle, Btn, Badge, statusTone, Progress, TableShell, Th, Td } from "@/components/ui-bits";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { generateLicense } from "@/lib/license";

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

type Tab =
  | "Overview" | "Subscription" | "Modules" | "Users" | "Devices" | "Branches"
  | "License" | "Invoices" | "Quotations" | "Payments" | "Activity";

function SubscriberDetail() {
  const { sub } = Route.useLoaderData();
  const isDesktop = sub.deployment === "Desktop";
  const TABS: Tab[] = [
    "Overview", "Subscription", "Modules", "Users", "Devices", "Branches",
    ...(isDesktop ? (["License"] as Tab[]) : []),
    "Invoices", "Quotations", "Payments", "Activity",
  ];
  const [tab, setTab] = useState<Tab>("Overview");
  const [branchList, setBranchList] = useState<Branch[]>(
    allBranches.filter((b) => b.subscriberId === sub.id),
  );
  const [branchDialog, setBranchDialog] = useState<{ open: boolean; editing?: Branch }>({ open: false });
  const subDevices = allDevices.filter((d) => d.subscriberId === sub.id);
  const subInvoices = allInvoices.filter((i) => i.subscriberId === sub.id);
  const subPayments = allPayments.filter((p) => p.subscriber === sub.company);

  function saveBranch(data: Omit<Branch, "id" | "subscriberId" | "lat" | "lng">, editing?: Branch) {
    if (editing) {
      setBranchList((list) => list.map((b) => (b.id === editing.id ? { ...editing, ...data } : b)));
    } else {
      const newId = `BR-${Math.floor(Math.random() * 9000 + 1000)}`;
      setBranchList((list) => [
        ...list,
        { id: newId, subscriberId: sub.id, lat: 0, lng: 0, ...data },
      ]);
    }
    setBranchDialog({ open: false });
  }

  function deleteBranch(id: string) {
    if (!confirm("Delete this branch?")) return;
    setBranchList((list) => list.filter((b) => b.id !== id));
  }

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
              <div className="flex flex-wrap items-center gap-1">
                <Badge tone={statusTone(sub.status)}>{sub.status}</Badge>
                <Badge tone={isDesktop ? "warning" : "info"}>
                  <span className="inline-flex items-center gap-1">
                    {isDesktop ? <Monitor className="h-3 w-3" /> : <Cloud className="h-3 w-3" />}
                    {sub.deployment}
                  </span>
                </Badge>
              </div>
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
          <div className="space-y-3">
            <div className="flex justify-end">
              <Btn onClick={() => setBranchDialog({ open: true })}>
                <Plus className="h-4 w-4" /> Add Branch
              </Btn>
            </div>
            <TableShell>
              <thead className="bg-muted/40"><tr>
                <Th>Branch</Th><Th>Location</Th><Th>Manager</Th><Th>Phone</Th><Th>Users</Th><Th>Devices</Th><Th>Status</Th><Th>Actions</Th>
              </tr></thead>
              <tbody className="divide-y divide-border">
                {branchList.map((b)=>(
                  <tr key={b.id}>
                    <Td><div className="font-medium">{b.name}</div><div className="text-xs text-muted-foreground">{b.id}</div></Td>
                    <Td>{b.location}</Td><Td>{b.manager}</Td>
                    <Td className="text-muted-foreground">{b.phone}</Td>
                    <Td>{b.users}</Td><Td>{b.devices}</Td>
                    <Td><Badge tone={statusTone(b.status)}>{b.status}</Badge></Td>
                    <Td>
                      <div className="flex gap-1">
                        <button onClick={() => setBranchDialog({ open: true, editing: b })}
                          className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="Edit">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button onClick={() => deleteBranch(b.id)}
                          className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive" aria-label="Delete">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </Td>
                  </tr>
                ))}
                {branchList.length === 0 && (
                  <tr><Td className="text-muted-foreground">No branches yet.</Td><Td></Td><Td></Td><Td></Td><Td></Td><Td></Td><Td></Td><Td></Td></tr>
                )}
              </tbody>
            </TableShell>
            <BranchDialog
              open={branchDialog.open}
              editing={branchDialog.editing}
              onClose={() => setBranchDialog({ open: false })}
              onSave={saveBranch}
            />
          </div>
        )}

        {tab === "License" && isDesktop && (
          <DesktopLicense subscriberId={sub.id} expiry={sub.expiryDate} devices={subDevices} />
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

function ModuleToggle({ name, initial }: { name: string; initial: boolean }) {
  const [on, setOn] = useState(initial);
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

function BranchDialog({
  open, editing, onClose, onSave,
}: {
  open: boolean;
  editing?: Branch;
  onClose: () => void;
  onSave: (data: Omit<Branch, "id" | "subscriberId" | "lat" | "lng">, editing?: Branch) => void;
}) {
  const [form, setForm] = useState({
    name: "", location: "", manager: "", phone: "",
    users: 0, devices: 0, status: "Active" as "Active" | "Inactive",
  });

  React.useEffect(() => {
    if (open) {
      setForm(editing ? {
        name: editing.name, location: editing.location, manager: editing.manager,
        phone: editing.phone, users: editing.users, devices: editing.devices, status: editing.status,
      } : { name: "", location: "", manager: "", phone: "", users: 0, devices: 0, status: "Active" });
    }
  }, [open, editing]);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editing ? "Edit Branch" : "Add Branch"}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Branch Name"><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
          <Field label="Location"><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></Field>
          <Field label="Manager"><Input value={form.manager} onChange={(e) => setForm({ ...form, manager: e.target.value })} /></Field>
          <Field label="Phone"><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field>
          <Field label="Users"><Input type="number" value={form.users} onChange={(e) => setForm({ ...form, users: Number(e.target.value) })} /></Field>
          <Field label="Devices"><Input type="number" value={form.devices} onChange={(e) => setForm({ ...form, devices: Number(e.target.value) })} /></Field>
          <Field label="Status">
            <select value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as "Active" | "Inactive" })}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm">
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </Field>
        </div>
        <DialogFooter>
          <Btn variant="outline" onClick={onClose}>Cancel</Btn>
          <Btn onClick={() => { if (!form.name.trim()) return; onSave(form, editing); }}>
            {editing ? "Save Changes" : "Add Branch"}
          </Btn>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="space-y-1.5 text-sm">
      <div className="text-muted-foreground">{label}</div>
      {children}
    </label>
  );
}

type DeviceLite = {
  id: string; name: string; serial: string; branch: string;
  type: string; online: boolean;
};

function DesktopLicense({
  subscriberId, expiry, devices,
}: { subscriberId: string; expiry: string; devices: DeviceLite[] }) {
  const [serial, setSerial] = useState("");
  const [license, setLicense] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  function generate(s: string) {
    if (!s.trim()) return;
    setSerial(s);
    setLicense(generateLicense({ subscriberId, serial: s, expiry }));
    setCopied(false);
  }

  function copy() {
    if (!license) return;
    navigator.clipboard.writeText(license);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardTitle>Generate Activation License</CardTitle>
        <p className="mb-3 text-sm text-muted-foreground">
          Activation keys are bound to the device serial number and the subscription expiry date.
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            placeholder="Enter device serial number (e.g. FX-2024-0001)"
            value={serial}
            onChange={(e) => setSerial(e.target.value)}
            className="font-mono"
          />
          <Btn onClick={() => generate(serial)}>
            <Key className="h-4 w-4" /> Generate
          </Btn>
        </div>

        {license && (
          <div className="mt-4 rounded-lg border border-border bg-muted/40 p-4">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">Activation Key</div>
              <button
                onClick={copy}
                className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2 py-1 text-xs hover:bg-muted"
              >
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <div className="break-all font-mono text-lg font-semibold tracking-wider">{license}</div>
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <div>Serial: <span className="font-mono">{serial.toUpperCase()}</span></div>
              <div>Valid until: <span className="font-mono">{expiry}</span></div>
            </div>
          </div>
        )}
      </Card>

      <Card>
        <CardTitle>Registered Devices</CardTitle>
        <p className="mb-3 text-sm text-muted-foreground">
          Click a device to generate its license instantly.
        </p>
        <TableShell>
          <thead className="bg-muted/40"><tr>
            <Th>Device</Th><Th>Serial</Th><Th>Branch</Th><Th>Status</Th><Th></Th>
          </tr></thead>
          <tbody className="divide-y divide-border">
            {devices.map((d) => (
              <tr key={d.id} className="hover:bg-muted/30">
                <Td>{d.name}</Td>
                <Td className="font-mono text-muted-foreground">{d.serial}</Td>
                <Td>{d.branch}</Td>
                <Td><Badge tone={d.online ? "success" : "danger"}>{d.online ? "Online" : "Offline"}</Badge></Td>
                <Td>
                  <button
                    onClick={() => generate(d.serial)}
                    className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2 py-1 text-xs hover:bg-muted"
                  >
                    <Key className="h-3 w-3" /> Generate
                  </button>
                </Td>
              </tr>
            ))}
            {devices.length === 0 && (
              <tr><Td className="text-muted-foreground">No devices registered yet.</Td><Td></Td><Td></Td><Td></Td><Td></Td></tr>
            )}
          </tbody>
        </TableShell>
      </Card>
    </div>
  );
}