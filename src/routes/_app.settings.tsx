import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Card, CardTitle, Btn, Input, Select } from "@/components/ui-bits";

export const Route = createFileRoute("/_app/settings")({ component: () => (
  <div>
    <PageHeader title="Settings" description="Configure platform defaults and your admin profile." />
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card>
        <CardTitle>Organization</CardTitle>
        <div className="space-y-3 text-sm">
          <Field label="Platform Name"><Input defaultValue="FaceTime SaaS" /></Field>
          <Field label="Support Email"><Input defaultValue="support@facetime.io" /></Field>
          <Field label="Default Currency"><Select defaultValue="USD">{["USD","EUR","AED","SAR","GBP"].map((c)=><option key={c}>{c}</option>)}</Select></Field>
          <Field label="Default Tax %"><Input type="number" defaultValue={5} /></Field>
        </div>
      </Card>
      <Card>
        <CardTitle>Admin Profile</CardTitle>
        <div className="space-y-3 text-sm">
          <Field label="Name"><Input defaultValue="Super Admin" /></Field>
          <Field label="Email"><Input defaultValue="admin@facetime.io" /></Field>
        </div>
      </Card>
      <Card className="lg:col-span-2">
        <CardTitle>Renewal & Notifications</CardTitle>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3 text-sm">
          <Field label="Reminder before expiry (days)"><Input type="number" defaultValue={7} /></Field>
          <Field label="Overdue grace period (days)"><Input type="number" defaultValue={3} /></Field>
          <Field label="Auto-suspend on expiry"><Select defaultValue="Yes"><option>Yes</option><option>No</option></Select></Field>
        </div>
        <div className="mt-4"><Btn>Save Changes</Btn></div>
      </Card>
    </div>
  </div>
) });

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}