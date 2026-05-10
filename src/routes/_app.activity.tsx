import { createFileRoute } from "@tanstack/react-router";
import { activityLogs } from "@/lib/mock-data";
import { PageHeader, Card, Badge, type Tone } from "@/components/ui-bits";

const toneOf = (t: string): Tone => t === "create" ? "success" : t === "delete" ? "danger" : t === "billing" ? "info" : t === "security" ? "warning" : "primary";

export const Route = createFileRoute("/_app/activity")({ component: () => (
  <div>
    <PageHeader title="Activity Logs" description="Audit trail of all super admin actions." />
    <Card>
      <ul className="divide-y divide-border">
        {activityLogs.map((a) => (
          <li key={a.id} className="flex items-center gap-4 py-3">
            <Badge tone={toneOf(a.type)}>{a.type}</Badge>
            <div className="flex-1">
              <div className="text-sm font-medium">{a.action}</div>
              <div className="text-xs text-muted-foreground">{a.actor} → {a.target}</div>
            </div>
            <div className="text-xs text-muted-foreground">{a.time}</div>
          </li>
        ))}
      </ul>
    </Card>
  </div>
) });