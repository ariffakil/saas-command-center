import { createFileRoute, Link } from "@tanstack/react-router";
import { branches, subscribers } from "@/lib/mock-data";
import { PageHeader, TableShell, Th, Td, Badge, statusTone, Btn } from "@/components/ui-bits";
import { Plus, Map } from "lucide-react";

export const Route = createFileRoute("/_app/branches")({ component: () => (
  <div>
    <PageHeader title="Branches" description="All subscriber branches." actions={
      <div className="flex gap-2">
        <Link to="/branches/map" className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm hover:bg-muted">
          <Map className="h-4 w-4" /> Live Map
        </Link>
        <Btn><Plus className="h-4 w-4" /> Add Branch</Btn>
      </div>
    } />
    <TableShell>
      <thead className="bg-muted/40"><tr>
        <Th>Branch</Th><Th>Subscriber</Th><Th>Location</Th><Th>Manager</Th><Th>Phone</Th><Th>Users</Th><Th>Devices</Th><Th>Status</Th>
      </tr></thead>
      <tbody className="divide-y divide-border">
        {branches.map((b) => {
          const sub = subscribers.find((s) => s.id === b.subscriberId);
          return (
            <tr key={b.id} className="hover:bg-muted/30">
              <Td><div className="font-medium">{b.name}</div><div className="text-xs text-muted-foreground">{b.id}</div></Td>
              <Td>{sub?.company}</Td><Td>{b.location}</Td><Td>{b.manager}</Td>
              <Td className="text-muted-foreground">{b.phone}</Td><Td>{b.users}</Td><Td>{b.devices}</Td>
              <Td><Badge tone={statusTone(b.status)}>{b.status}</Badge></Td>
            </tr>
          );
        })}
      </tbody>
    </TableShell>
  </div>
) });