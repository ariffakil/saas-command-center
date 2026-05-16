import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Download, Filter, Eye, Edit, MoreHorizontal, Cloud, Monitor } from "lucide-react";
import { subscribers } from "@/lib/mock-data";
import { PageHeader, Btn, Input, Select, TableShell, Th, Td, Badge, statusTone } from "@/components/ui-bits";

export const Route = createFileRoute("/_app/subscribers/")({
  component: SubscribersPage,
});

function SubscribersPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("All");
  const [plan, setPlan] = useState("All");
  const [deployment, setDeployment] = useState("All");

  const rows = useMemo(() => {
    return subscribers.filter((s) => {
      const matchesQ = `${s.company} ${s.holder} ${s.email} ${s.id}`.toLowerCase().includes(q.toLowerCase());
      const matchesStatus = status === "All" || s.status === status;
      const matchesPlan = plan === "All" || s.plan === plan;
      const matchesDeployment = deployment === "All" || s.deployment === deployment;
      return matchesQ && matchesStatus && matchesPlan && matchesDeployment;
    });
  }, [q, status, plan, deployment]);

  return (
    <div>
      <PageHeader
        title="Subscribers"
        description="Manage all subscriber companies, plans and account status."
        actions={
          <>
            <Btn variant="outline"><Download className="h-4 w-4" /> Export</Btn>
            <Link to="/subscribers/new"><Btn><Plus className="h-4 w-4" /> Add Subscriber</Btn></Link>
          </>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center gap-1 text-sm text-muted-foreground"><Filter className="h-4 w-4" /> Filters</div>
        <Input placeholder="Search company, holder, email…" value={q} onChange={(e) => setQ(e.target.value)} className="md:w-72" />
        <Select value={status} onChange={(e) => setStatus(e.target.value)}>
          {["All", "Active", "Trial", "Suspended", "Expired"].map((s) => <option key={s}>{s}</option>)}
        </Select>
        <Select value={plan} onChange={(e) => setPlan(e.target.value)}>
          {["All", "Trial", "Basic", "Professional", "Enterprise"].map((s) => <option key={s}>{s}</option>)}
        </Select>
        <Select value={deployment} onChange={(e) => setDeployment(e.target.value)}>
          {["All", "Cloud", "Desktop"].map((s) => <option key={s}>{s}</option>)}
        </Select>
        <div className="ml-auto text-sm text-muted-foreground">{rows.length} of {subscribers.length}</div>
      </div>

      <TableShell>
        <thead className="bg-muted/40">
          <tr>
            <Th>Account</Th><Th>Type</Th><Th>Plan</Th><Th>Status</Th><Th>Country</Th>
            <Th>Users</Th><Th>Devices</Th><Th>Expiry</Th><Th>MRR</Th><Th></Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((s) => (
            <tr key={s.id} className="hover:bg-muted/30">
              <Td>
                <div className="font-medium text-card-foreground">{s.company}</div>
                <div className="text-xs text-muted-foreground">{s.id} • {s.holder}</div>
              </Td>
              <Td>
                <Badge tone={s.deployment === "Desktop" ? "warning" : "info"}>
                  <span className="inline-flex items-center gap-1">
                    {s.deployment === "Desktop" ? <Monitor className="h-3 w-3" /> : <Cloud className="h-3 w-3" />}
                    {s.deployment}
                  </span>
                </Badge>
              </Td>
              <Td><Badge tone={s.plan === "Enterprise" ? "primary" : s.plan === "Trial" ? "info" : "neutral"}>{s.plan}</Badge></Td>
              <Td><Badge tone={statusTone(s.status)}>{s.status}</Badge></Td>
              <Td>{s.country}</Td>
              <Td>{s.users.used} / {s.users.limit}</Td>
              <Td>{s.devices.used} / {s.devices.limit}</Td>
              <Td className="text-muted-foreground">{s.expiryDate}</Td>
              <Td>${s.monthlyValue.toLocaleString()}</Td>
              <Td>
                <div className="flex items-center gap-1">
                  <Link to="/subscribers/$id" params={{ id: s.id }}>
                    <Btn variant="ghost" size="sm" aria-label="View"><Eye className="h-4 w-4" /></Btn>
                  </Link>
                  <Btn variant="ghost" size="sm" aria-label="Edit"><Edit className="h-4 w-4" /></Btn>
                  <Btn variant="ghost" size="sm" aria-label="More"><MoreHorizontal className="h-4 w-4" /></Btn>
                </div>
              </Td>
            </tr>
          ))}
        </tbody>
      </TableShell>
    </div>
  );
}