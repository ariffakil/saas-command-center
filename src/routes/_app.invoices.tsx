import { createFileRoute } from "@tanstack/react-router";
import { invoices } from "@/lib/mock-data";
import { PageHeader, TableShell, Th, Td, Badge, statusTone, Btn } from "@/components/ui-bits";
import { Download, Mail, Plus } from "lucide-react";

export const Route = createFileRoute("/_app/invoices")({ component: () => (
  <div>
    <PageHeader title="Invoices" description="Billing invoices across all subscribers." actions={<><Btn variant="outline"><Download className="h-4 w-4" /> Export</Btn><Btn><Plus className="h-4 w-4" /> New Invoice</Btn></>} />
    <TableShell>
      <thead className="bg-muted/40"><tr>
        <Th>Invoice</Th><Th>Subscriber</Th><Th>Date</Th><Th>Due</Th><Th>Amount</Th><Th>Tax</Th><Th>Total</Th><Th>Status</Th><Th></Th>
      </tr></thead>
      <tbody className="divide-y divide-border">
        {invoices.map((i) => (
          <tr key={i.id} className="hover:bg-muted/30">
            <Td className="font-medium">{i.id}</Td><Td>{i.subscriber}</Td>
            <Td>{i.date}</Td><Td className="text-muted-foreground">{i.dueDate}</Td>
            <Td>${i.amount.toLocaleString()}</Td><Td>${i.tax}</Td>
            <Td className="font-semibold">${i.total.toLocaleString()}</Td>
            <Td><Badge tone={statusTone(i.status)}>{i.status}</Badge></Td>
            <Td><div className="flex gap-1"><Btn variant="ghost" size="sm"><Download className="h-4 w-4" /></Btn><Btn variant="ghost" size="sm"><Mail className="h-4 w-4" /></Btn></div></Td>
          </tr>
        ))}
      </tbody>
    </TableShell>
  </div>
) });