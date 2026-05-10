import { createFileRoute } from "@tanstack/react-router";
import { payments } from "@/lib/mock-data";
import { PageHeader, TableShell, Th, Td, Badge, statusTone, Btn } from "@/components/ui-bits";
import { Download } from "lucide-react";

export const Route = createFileRoute("/_app/payments")({ component: () => (
  <div>
    <PageHeader title="Payment History" description="All received payments and transactions." />
    <TableShell>
      <thead className="bg-muted/40"><tr>
        <Th>Date</Th><Th>Payment</Th><Th>Invoice</Th><Th>Subscriber</Th><Th>Method</Th><Th>Reference</Th><Th>Amount</Th><Th>Status</Th><Th>Receipt</Th></tr></thead>
      <tbody className="divide-y divide-border">
        {payments.map((p) => (
          <tr key={p.id} className="hover:bg-muted/30">
            <Td>{p.date}</Td><Td className="font-medium">{p.id}</Td>
            <Td>{p.invoiceId}</Td><Td>{p.subscriber}</Td>
            <Td><Badge tone="info">{p.method}</Badge></Td>
            <Td className="text-muted-foreground">{p.reference}</Td>
            <Td className="font-semibold">${p.amount.toLocaleString()}</Td>
            <Td><Badge tone={statusTone(p.status)}>{p.status}</Badge></Td>
            <Td><Btn variant="ghost" size="sm"><Download className="h-4 w-4" /></Btn></Td>
          </tr>
        ))}
      </tbody>
    </TableShell>
  </div>
) });