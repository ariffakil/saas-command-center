import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { subscribers, moduleList } from "@/lib/mock-data";
import { PageHeader, Card, Input, Select } from "@/components/ui-bits";

export const Route = createFileRoute("/_app/modules")({
  component: ModulesPage,
});

function ModulesPage() {
  const [q, setQ] = useState("");
  const [subId, setSubId] = useState(subscribers[0].id);
  const sub = useMemo(() => subscribers.find((s) => s.id === subId)!, [subId]);
  const filtered = moduleList.filter((m) => m.toLowerCase().includes(q.toLowerCase()));

  return (
    <div>
      <PageHeader title="Module Control" description="Enable or disable modules per subscriber." />
      <Card className="mb-4">
        <div className="flex flex-wrap items-center gap-2">
          <Select value={subId} onChange={(e) => setSubId(e.target.value)}>
            {subscribers.map((s) => <option key={s.id} value={s.id}>{s.company}</option>)}
          </Select>
          <Input placeholder="Search modules…" value={q} onChange={(e) => setQ(e.target.value)} className="md:w-72" />
          <div className="ml-auto text-sm text-muted-foreground">Active subscriber: <span className="font-medium text-foreground">{sub.company}</span></div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((m, i) => <ModuleRow key={m} name={m} initial={i % 4 !== 3} />)}
      </div>
    </div>
  );
}

function ModuleRow({ name, initial }: { name: string; initial: boolean }) {
  const [on, setOn] = useState(initial);
  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <div className="font-medium">{name}</div>
          <div className="text-xs text-muted-foreground">{on ? "Enabled" : "Disabled"}</div>
        </div>
        <button
          onClick={() => setOn((v) => !v)}
          className={`relative h-6 w-11 rounded-full transition ${on ? "bg-primary" : "bg-muted-foreground/30"}`}
        >
          <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${on ? "left-5" : "left-0.5"}`} />
        </button>
      </div>
    </Card>
  );
}