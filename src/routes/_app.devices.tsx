import { createFileRoute } from "@tanstack/react-router";
import { devices, subscribers } from "@/lib/mock-data";
import { PageHeader, TableShell, Th, Td, Badge } from "@/components/ui-bits";

export const Route = createFileRoute("/_app/devices")({ component: () => (
  <div>
    <PageHeader title="Devices" description="All face, fingerprint and RFID devices." />
    <TableShell>
      <thead className="bg-muted/40"><tr>
        <Th>Device</Th><Th>Serial</Th><Th>Type</Th><Th>Subscriber</Th><Th>Branch</Th><Th>Last Sync</Th><Th>Firmware</Th><Th>Users</Th><Th>Status</Th>
      </tr></thead>
      <tbody className="divide-y divide-border">
        {devices.map((d) => {
          const sub = subscribers.find((s) => s.id === d.subscriberId);
          return (
            <tr key={d.id} className="hover:bg-muted/30">
              <Td><div className="font-medium">{d.name}</div></Td>
              <Td className="text-muted-foreground">{d.serial}</Td>
              <Td><Badge tone="info">{d.type}</Badge></Td>
              <Td>{sub?.company}</Td><Td>{d.branch}</Td>
              <Td className="text-muted-foreground">{d.lastSync}</Td>
              <Td>{d.firmware}</Td><Td>{d.assignedUsers}</Td>
              <Td>
                <Badge tone={!d.active ? "danger" : d.online ? "success" : "warning"}>
                  {!d.active ? "Inactive" : d.online ? "Online" : "Offline"}
                </Badge>
              </Td>
            </tr>
          );
        })}
      </tbody>
    </TableShell>
  </div>
) });