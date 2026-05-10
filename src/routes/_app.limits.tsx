import { createFileRoute, Link } from "@tanstack/react-router";
import { subscribers } from "@/lib/mock-data";
import { PageHeader, Card, CardTitle, Progress, Badge } from "@/components/ui-bits";

export const Route = createFileRoute("/_app/limits")({
  component: LimitsPage,
});

function LimitsPage() {
  return (
    <div>
      <PageHeader title="License Limits" description="Monitor user, device, and branch quotas across subscribers." />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {subscribers.map((s) => {
          const limits = [
            { label: "Users", v: s.users.used, m: s.users.limit },
            { label: "Devices", v: s.devices.used, m: s.devices.limit },
            { label: "Branches", v: s.branches.used, m: s.branches.limit },
            { label: "Admins", v: 3, m: 5 },
            { label: "Mobile App Users", v: Math.round(s.users.used*0.4), m: Math.round(s.users.limit*0.5) },
            { label: "Storage (GB)", v: 38, m: 100 },
          ];
          const atLimit = limits.some((l) => l.v / l.m >= 0.95);
          return (
            <Card key={s.id}>
              <CardTitle action={atLimit ? <Badge tone="danger">Limit reached</Badge> : <Badge tone="success">Healthy</Badge>}>
                <Link to="/subscribers/$id" params={{ id: s.id }} className="hover:underline">{s.company}</Link>
              </CardTitle>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {limits.map((l) => (
                  <div key={l.label}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="text-muted-foreground">{l.label}</span>
                      <span>{l.v} / {l.m}</span>
                    </div>
                    <Progress value={l.v} max={l.m} />
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}