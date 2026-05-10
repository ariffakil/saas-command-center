import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Save } from "lucide-react";
import { PageHeader, Card, CardTitle, Btn, Input, Select } from "@/components/ui-bits";

export const Route = createFileRoute("/_app/subscribers/new")({
  component: NewSubscriber,
});

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function NewSubscriber() {
  const navigate = useNavigate();
  return (
    <div>
      <PageHeader
        title="Add Subscriber"
        description="Create a new subscriber account and configure initial subscription."
        actions={
          <>
            <Btn variant="outline" onClick={() => navigate({ to: "/subscribers" })}><ArrowLeft className="h-4 w-4" /> Back</Btn>
            <Btn onClick={() => navigate({ to: "/subscribers" })}><Save className="h-4 w-4" /> Save Subscriber</Btn>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardTitle>Company Information</CardTitle>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Company Name *"><Input placeholder="Acme Corporation" /></Field>
            <Field label="Account Holder *"><Input placeholder="John Doe" /></Field>
            <Field label="Email *"><Input type="email" placeholder="contact@acme.com" /></Field>
            <Field label="Phone *"><Input placeholder="+1 555 0100" /></Field>
            <Field label="Country"><Input placeholder="UAE" /></Field>
            <Field label="City"><Input placeholder="Dubai" /></Field>
            <Field label="Business Type">
              <Select defaultValue="Logistics">
                {["Logistics","Retail","Healthcare","Construction","Education","Finance","Hospitality","Manufacturing","Software","Other"].map((b)=>(<option key={b}>{b}</option>))}
              </Select>
            </Field>
            <Field label="Address"><Input placeholder="Street, building, area" /></Field>
          </div>
        </Card>

        <Card>
          <CardTitle>Subscription</CardTitle>
          <div className="space-y-4">
            <Field label="Plan">
              <Select defaultValue="Professional">
                {["Trial","Basic","Professional","Enterprise"].map((p)=>(<option key={p}>{p}</option>))}
              </Select>
            </Field>
            <Field label="Billing Type">
              <Select defaultValue="Yearly">
                {["Monthly","Yearly","One-time"].map((b)=>(<option key={b}>{b}</option>))}
              </Select>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Start Date"><Input type="date" /></Field>
              <Field label="Expiry Date"><Input type="date" /></Field>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Users"><Input type="number" defaultValue={100} /></Field>
              <Field label="Devices"><Input type="number" defaultValue={10} /></Field>
              <Field label="Branches"><Input type="number" defaultValue={3} /></Field>
            </div>
            <label className="flex items-center gap-2 text-sm text-card-foreground">
              <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-input" />
              Enable auto-renewal
            </label>
          </div>
        </Card>
      </div>

      <Card className="mt-4">
        <CardTitle>Notes</CardTitle>
        <textarea
          rows={4}
          placeholder="Internal notes about this subscriber…"
          className="w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground outline-none ring-ring/40 focus:ring-2"
        />
      </Card>
    </div>
  );
}