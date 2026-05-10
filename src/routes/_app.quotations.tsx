import { createFileRoute } from "@tanstack/react-router";
import { quotations } from "@/lib/mock-data";
import { PageHeader, TableShell, Th, Td, Badge, statusTone, Btn } from "@/components/ui-bits";
import { Download, FileText, Plus } from "lucide-react";

export const Route = createFileRoute("/_app/quotations")({ component: () => (
  <div>
    <PageHeader title="Quotations" description="Send and manage prospect quotations." actions={<Btn><Plus className="h-4 w-4" /> New Quotation</Btn>} />
    <TableShell>
      <thead className="bg-muted/40"><tr>
        <Th>Quote</Th><Th>Prospect</Th><Th>Date</Th><Th>Valid Until</Th><Th>Plan</Th><Th>Modules</Th><Th>Limits</Th><Th>Total</Th><Th>Status</Th><Th /></tr></thead>
      <tbody className="divide-y divide-border">
        {quotations.map((q) => (
          <tr key={q.id} className="hover:bg-muted/30">
            <Td className="font-medium">{q.id}</Td><Td>{q.prospect}</Td>
            <Td>{q.date}</Td><Td className="text-muted-foreground">{q.validUntil}</Td>
            <Td><Badge tone="primary">{q.plan}</Badge></Td>
            <Td>{q.modules}</Td>
            <Td className="text-xs text-muted-foreground">{q.users}u • {q.devices}d • {q.branches}b</Td>
            <Td className="font-semibold">${q.total.toLocaleString()}</Td>
            <Td><Badge tone={statusTone(q.status)}>{q.status}</Badge></Td>
            <Td><div className="flex gap-1"><Btn variant="ghost" size="sm"><Download className="h-4 w-4" /></Btn><Btn variant="ghost" size="sm" title="Convert to invoice"><FileText className="h-4 w-4" /></Btn></div></Td>
          </tr>
        ))}
      </tbody>
    </TableShell>
  </div>
) });