import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { PageHeader, Card, Btn, Badge } from "@/components/ui-bits";

export const Route = createFileRoute("/_app/plans")({
  component: PlansPage,
});

const PLANS = [
  { name: "Trial", tag: "Free for 30 days", price: 0, color: "info", features: ["Up to 25 users", "3 devices", "1 branch", "Time Attendance", "Mobile App"] },
  { name: "Basic", tag: "Small teams", price: 49, color: "neutral", features: ["Up to 50 users", "5 devices", "2 branches", "Core attendance modules", "Email support"] },
  { name: "Professional", tag: "Growing companies", price: 149, color: "primary", features: ["Up to 250 users", "20 devices", "8 branches", "All standard modules", "Priority support", "API access"] },
  { name: "Enterprise", tag: "Large enterprises", price: 499, color: "success", features: ["Unlimited users", "Unlimited devices", "Unlimited branches", "All premium modules", "Dedicated CSM", "Custom integrations"] },
] as const;

function PlansPage() {
  return (
    <div>
      <PageHeader title="Subscription Plans" description="Plan tiers offered to subscribers." actions={<Btn>+ Create Plan</Btn>} />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {PLANS.map((p) => (
          <Card key={p.name} className="flex flex-col">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-lg font-semibold">{p.name}</h3>
              <Badge tone={p.color as any}>{p.tag}</Badge>
            </div>
            <div className="mb-4">
              <span className="text-3xl font-semibold">${p.price}</span>
              <span className="text-sm text-muted-foreground">/mo</span>
            </div>
            <ul className="mb-5 flex-1 space-y-2 text-sm">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 text-success" /><span>{f}</span>
                </li>
              ))}
            </ul>
            <Btn variant={p.name === "Professional" ? "primary" : "outline"}>Edit Plan</Btn>
          </Card>
        ))}
      </div>
    </div>
  );
}