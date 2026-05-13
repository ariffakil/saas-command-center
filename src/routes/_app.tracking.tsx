import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Activity, CheckCircle2, Cpu, Radio, Users, Wifi, WifiOff, MapPin, Pause, Play } from "lucide-react";
import { devices, subscribers, branches } from "@/lib/mock-data";
import { PageHeader, Card, Badge, Btn, Select, KpiCard, TableShell, Th, Td } from "@/components/ui-bits";

export const Route = createFileRoute("/_app/tracking")({ component: LiveTrackingPage });

type Event = {
  id: string;
  time: string;
  subscriber: string;
  branch: string;
  device: string;
  user: string;
  type: "Check-In" | "Check-Out" | "Access Granted" | "Access Denied";
};

const sampleNames = [
  "Ahmed Khan", "Fatima Noor", "Carlos Mendes", "Layla Hammoud", "Erik Lindqvist",
  "Priya Sharma", "James Whittaker", "Mona Said", "Yusuf Karim", "Sarah Connor",
  "Tariq Sayegh", "Eleanor Brooks", "Sven Berg", "Karim Fouad", "Omar Belkacem",
];

function rand<T>(arr: readonly T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

function makeEvent(subscriberFilter?: string): Event {
  const pool = subscriberFilter && subscriberFilter !== "all"
    ? devices.filter((d) => d.subscriberId === subscriberFilter)
    : devices;
  const dev = rand(pool.length ? pool : devices);
  const sub = subscribers.find((s) => s.id === dev.subscriberId);
  const types: Event["type"][] = ["Check-In", "Check-In", "Check-Out", "Access Granted", "Access Denied"];
  return {
    id: `EV-${Date.now()}-${Math.floor(Math.random() * 9999)}`,
    time: new Date().toLocaleTimeString(),
    subscriber: sub?.company ?? "Unknown",
    branch: dev.branch,
    device: dev.name,
    user: rand(sampleNames),
    type: rand(types),
  };
}

function eventTone(t: Event["type"]) {
  if (t === "Access Denied") return "danger" as const;
  if (t === "Check-Out") return "info" as const;
  if (t === "Access Granted") return "primary" as const;
  return "success" as const;
}

function LiveTrackingPage() {
  const [feed, setFeed] = useState<Event[]>(() => Array.from({ length: 8 }, () => makeEvent()));
  const [running, setRunning] = useState(true);
  const [subFilter, setSubFilter] = useState<string>("all");
  const [tick, setTick] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!running) return;
    timer.current = setInterval(() => {
      setFeed((prev) => [makeEvent(subFilter), ...prev].slice(0, 60));
      setTick((t) => t + 1);
    }, 2200);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [running, subFilter]);

  const onlineDevices = devices.filter((d) => d.online).length;
  const offlineDevices = devices.length - onlineDevices;
  const activeBranches = branches.filter((b) => b.status === "Active").length;
  const totalUsers = subscribers.reduce((s, x) => s + x.users.used, 0);

  const filteredDevices = useMemo(
    () => (subFilter === "all" ? devices : devices.filter((d) => d.subscriberId === subFilter)),
    [subFilter],
  );

  const recentByBranch = useMemo(() => {
    const map = new Map<string, number>();
    feed.forEach((e) => map.set(e.branch, (map.get(e.branch) ?? 0) + 1));
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 6);
  }, [feed, tick]);

  return (
    <div>
      <PageHeader
        title="Live Tracking"
        description="Real-time attendance & device activity across all subscribers."
        actions={
          <div className="flex items-center gap-2">
            <Select value={subFilter} onChange={(e) => setSubFilter(e.target.value)}>
              <option value="all">All Subscribers</option>
              {subscribers.map((s) => <option key={s.id} value={s.id}>{s.company}</option>)}
            </Select>
            <Btn variant={running ? "outline" : "primary"} onClick={() => setRunning((r) => !r)}>
              {running ? <><Pause className="h-4 w-4" /> Pause</> : <><Play className="h-4 w-4" /> Resume</>}
            </Btn>
          </div>
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Devices Online" value={onlineDevices} hint={`${offlineDevices} offline`} icon={Wifi} tone="success" />
        <KpiCard label="Active Branches" value={activeBranches} hint="Currently reporting" icon={MapPin} tone="primary" />
        <KpiCard label="Tracked Users" value={totalUsers.toLocaleString()} hint="Across subscribers" icon={Users} tone="info" />
        <KpiCard label="Live Events / min" value={Math.round((feed.length / Math.max(1, tick)) * 27) || 27} hint="Streaming now" icon={Activity} tone="warning" />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`relative flex h-2.5 w-2.5 ${running ? "" : "opacity-40"}`}>
                {running && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />}
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-success" />
              </span>
              <h3 className="text-base font-semibold">Live Activity Feed</h3>
              <Badge tone={running ? "success" : "neutral"}>{running ? "LIVE" : "PAUSED"}</Badge>
            </div>
            <span className="text-xs text-muted-foreground">{feed.length} events buffered</span>
          </div>
          <div className="max-h-[520px] space-y-2 overflow-y-auto pr-1">
            {feed.map((e) => (
              <div key={e.id} className="flex items-center justify-between rounded-lg border border-border bg-muted/20 p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary-soft text-accent-foreground">
                    {e.type === "Access Denied" ? <Radio className="h-4 w-4 text-destructive" /> : <CheckCircle2 className="h-4 w-4" />}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{e.user} <span className="text-muted-foreground">·</span> <Badge tone={eventTone(e.type)}>{e.type}</Badge></div>
                    <div className="text-xs text-muted-foreground">{e.subscriber} — {e.branch} • {e.device}</div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">{e.time}</div>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-5">
          <Card>
            <h3 className="mb-3 text-base font-semibold">Top Active Branches</h3>
            <ul className="space-y-2">
              {recentByBranch.length === 0 && <li className="text-sm text-muted-foreground">Waiting for events…</li>}
              {recentByBranch.map(([name, count]) => (
                <li key={name} className="flex items-center justify-between rounded-md bg-muted/30 px-3 py-2 text-sm">
                  <span className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-primary" />{name}</span>
                  <Badge tone="primary">{count} events</Badge>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <h3 className="mb-3 text-base font-semibold">Device Status</h3>
            <div className="max-h-[260px] space-y-2 overflow-y-auto">
              {filteredDevices.map((d) => (
                <div key={d.id} className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{d.name}</div>
                      <div className="text-xs text-muted-foreground">{d.branch}</div>
                    </div>
                  </div>
                  {d.online
                    ? <Badge tone="success"><Wifi className="mr-1 h-3 w-3" />Online</Badge>
                    : <Badge tone="danger"><WifiOff className="mr-1 h-3 w-3" />Offline</Badge>}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <div className="mt-6">
        <Card>
          <h3 className="mb-3 text-base font-semibold">Recent Events Log</h3>
          <TableShell>
            <thead className="bg-muted/40"><tr>
              <Th>Time</Th><Th>User</Th><Th>Event</Th><Th>Subscriber</Th><Th>Branch</Th><Th>Device</Th>
            </tr></thead>
            <tbody className="divide-y divide-border">
              {feed.slice(0, 12).map((e) => (
                <tr key={e.id}>
                  <Td className="text-xs text-muted-foreground">{e.time}</Td>
                  <Td className="font-medium">{e.user}</Td>
                  <Td><Badge tone={eventTone(e.type)}>{e.type}</Badge></Td>
                  <Td>{e.subscriber}</Td>
                  <Td>{e.branch}</Td>
                  <Td className="text-muted-foreground">{e.device}</Td>
                </tr>
              ))}
            </tbody>
          </TableShell>
        </Card>
      </div>
    </div>
  );
}