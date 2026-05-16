import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { subscribers } from "@/lib/mock-data";
import { PageHeader, Card, Badge, Btn, TableShell, Th, Td, statusTone } from "@/components/ui-bits";
import { Mail, BellRing, Calendar, Clock, Send, Eye, X, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/_app/reminders")({ component: RemindersPage });

const TODAY = new Date("2026-05-10");

function daysUntil(dateStr: string) {
  const d = new Date(dateStr);
  return Math.ceil((d.getTime() - TODAY.getTime()) / (1000 * 60 * 60 * 24));
}

function nextSendLabel(days: number) {
  if (days < 0) return "Final notice (overdue)";
  if (days === 0) return "Expires today";
  return `Tomorrow • T-${days - 1} days`;
}

function urgencyTone(days: number) {
  if (days < 0) return "danger" as const;
  if (days <= 3) return "danger" as const;
  if (days <= 7) return "warning" as const;
  if (days <= 14) return "info" as const;
  return "neutral" as const;
}

function RemindersPage() {
  const [enabled, setEnabled] = useState(true);
  const [windowDays, setWindowDays] = useState(30);
  const [preview, setPreview] = useState<null | { id: string }>(null);

  const queue = useMemo(() => {
    return subscribers
      .map((s) => ({ ...s, days: daysUntil(s.expiryDate) }))
      .filter((s) => s.status !== "Suspended" && s.days <= windowDays)
      .sort((a, b) => a.days - b.days);
  }, [windowDays]);

  const sentToday = Math.floor(queue.length * 0.85);
  const failed = 1;

  const selected = preview ? queue.find((q) => q.id === preview.id) ?? null : null;

  return (
    <div>
      <PageHeader
        title="Renewal Reminders"
        description="Automated daily email notifications sent to subscribers approaching renewal."
        actions={
          <Btn onClick={() => alert("Triggered manual run for all eligible subscribers.")}>
            <Send className="h-4 w-4" /> Run Now
          </Btn>
        }
      />

      <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={BellRing} label="Active Schedule" value={enabled ? "Daily • 09:00 UTC" : "Paused"} tone="text-info" />
        <Stat icon={Calendar} label="Reminder Window" value={`${windowDays} days`} tone="text-primary" />
        <Stat icon={Mail} label="Emails Sent Today" value={String(sentToday)} tone="text-success" />
        <Stat icon={Clock} label="In Queue" value={String(queue.length - sentToday)} tone="text-warning" />
      </div>

      <div className="mb-4 grid gap-4 lg:grid-cols-3">
        <Card>
          <div className="mb-3 text-sm font-semibold">Schedule Settings</div>
          <div className="space-y-3 text-sm">
            <label className="flex items-center justify-between gap-3">
              <span>Enabled</span>
              <button
                onClick={() => setEnabled(!enabled)}
                className={`relative h-6 w-11 rounded-full transition ${enabled ? "bg-primary" : "bg-muted"}`}
              >
                <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${enabled ? "left-5" : "left-0.5"}`} />
              </button>
            </label>
            <div>
              <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                <span>Start reminders</span>
                <span className="font-medium text-foreground">{windowDays} days before expiry</span>
              </div>
              <input
                type="range" min={7} max={60} value={windowDays}
                onChange={(e) => setWindowDays(Number(e.target.value))}
                className="w-full accent-primary"
              />
            </div>
            <div className="flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
              <span>Frequency</span><span className="font-medium text-foreground">Every day at 09:00 UTC</span>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Channel</span><span className="font-medium text-foreground">Email (Lovable Cloud)</span>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Failures</span><span className="font-medium text-destructive">{failed}</span>
            </div>
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm font-semibold">Reminder Cadence</div>
            <div className="text-xs text-muted-foreground">Per subscriber, until renewal or expiry +7d</div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { range: "T-30 → T-15", tone: "info" as const, desc: "Soft reminder", color: "bg-info/10 text-info" },
              { range: "T-14 → T-8", tone: "info" as const, desc: "Renewal nudge", color: "bg-primary-soft text-primary" },
              { range: "T-7 → T-1", tone: "warning" as const, desc: "Urgent reminder", color: "bg-warning/15 text-warning-foreground" },
              { range: "T-0 → +7", tone: "danger" as const, desc: "Expiry / overdue", color: "bg-destructive/15 text-destructive" },
            ].map((b) => (
              <div key={b.range} className={`rounded-lg border border-border p-3 ${b.color}`}>
                <div className="text-xs font-semibold">{b.range}</div>
                <div className="mt-1 text-[11px] opacity-80">{b.desc}</div>
              </div>
            ))}
          </div>
          <div className="mt-3 rounded-lg border border-dashed border-border bg-muted/40 p-3 text-xs text-muted-foreground">
            One email per subscriber per day. Subject line dynamically shows the remaining days,
            e.g. <span className="font-mono text-foreground">"Your FaceTime subscription expires in 12 days"</span>.
          </div>
        </Card>
      </div>

      <Card>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold">Today's Reminder Queue</div>
            <div className="text-xs text-muted-foreground">{queue.length} subscribers eligible (within {windowDays} days)</div>
          </div>
        </div>
        <TableShell>
          <thead className="bg-muted/40"><tr>
            <Th>Subscriber</Th><Th>Plan</Th><Th>Expiry Date</Th><Th>Days Left</Th>
            <Th>Recipient</Th><Th>Next Send</Th><Th>Last Sent</Th><Th>Status</Th><Th></Th>
          </tr></thead>
          <tbody className="divide-y divide-border">
            {queue.map((s, i) => {
              const sent = i < sentToday;
              return (
                <tr key={s.id} className="hover:bg-muted/30">
                  <Td>
                    <div className="font-medium">{s.company}</div>
                    <div className="text-xs text-muted-foreground">{s.id}</div>
                  </Td>
                  <Td><Badge tone={statusTone(s.plan)}>{s.plan}</Badge></Td>
                  <Td className="text-muted-foreground">{s.expiryDate}</Td>
                  <Td>
                    <Badge tone={urgencyTone(s.days)}>
                      {s.days < 0 ? `${Math.abs(s.days)}d overdue` : `${s.days}d`}
                    </Badge>
                  </Td>
                  <Td className="text-muted-foreground">{s.email}</Td>
                  <Td className="text-xs">{nextSendLabel(s.days)}</Td>
                  <Td className="text-xs text-muted-foreground">
                    {sent ? (
                      <span className="inline-flex items-center gap-1 text-success">
                        <CheckCircle2 className="h-3 w-3" /> Today 09:02
                      </span>
                    ) : "—"}
                  </Td>
                  <Td>
                    <Badge tone={sent ? "success" : "info"}>{sent ? "Sent" : "Queued"}</Badge>
                  </Td>
                  <Td>
                    <button
                      onClick={() => setPreview({ id: s.id })}
                      className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs hover:bg-muted"
                    >
                      <Eye className="h-3 w-3" /> Preview
                    </button>
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </TableShell>
      </Card>

      {selected && (
        <EmailPreview onClose={() => setPreview(null)} sub={selected} />
      )}
    </div>
  );
}

function Stat({ icon: Icon, label, value, tone }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; tone: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</div>
        <Icon className={`h-4 w-4 ${tone}`} />
      </div>
      <div className="mt-2 text-xl font-semibold">{value}</div>
    </div>
  );
}

function EmailPreview({ sub, onClose }: { sub: { company: string; holder: string; email: string; plan: string; expiryDate: string; days: number; monthlyValue: number }; onClose: () => void }) {
  const urgent = sub.days <= 7;
  const expired = sub.days < 0;
  const subject = expired
    ? `URGENT: Your FaceTime subscription expired ${Math.abs(sub.days)} days ago`
    : sub.days === 0
    ? `Final notice: Your FaceTime subscription expires today`
    : `Your FaceTime subscription expires in ${sub.days} days`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-xl bg-card shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <div>
            <div className="text-sm font-semibold">Email Preview</div>
            <div className="text-xs text-muted-foreground">To: {sub.email}</div>
          </div>
          <button onClick={onClose} className="rounded-md p-1 hover:bg-muted"><X className="h-4 w-4" /></button>
        </div>
        <div className="border-b border-border bg-muted/30 px-5 py-3">
          <div className="text-xs text-muted-foreground">Subject</div>
          <div className="text-sm font-semibold">{subject}</div>
        </div>
        <div className="max-h-[60vh] overflow-y-auto bg-white p-8 text-black" style={{ fontFamily: "Arial, sans-serif" }}>
          <div style={{ borderBottom: "3px solid #dc2626", paddingBottom: 12, marginBottom: 20 }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#dc2626" }}>FaceTime</div>
            <div style={{ fontSize: 11, color: "#666" }}>Face Recognition Attendance Software</div>
          </div>
          <h1 style={{ fontSize: 20, margin: "0 0 12px" }}>
            {expired ? "Your subscription has expired" : sub.days === 0 ? "Your subscription expires today" : `${sub.days} days until renewal`}
          </h1>
          <p style={{ fontSize: 14, lineHeight: 1.6, color: "#333" }}>Dear {sub.holder},</p>
          <p style={{ fontSize: 14, lineHeight: 1.6, color: "#333" }}>
            {expired
              ? `Your FaceTime ${sub.plan} subscription for ${sub.company} expired on ${sub.expiryDate}. Service has been restricted and devices may stop syncing. Please renew immediately to avoid data interruption.`
              : `This is a friendly reminder that your FaceTime ${sub.plan} subscription for ${sub.company} will expire on ${sub.expiryDate} — that's ${sub.days === 0 ? "today" : `in ${sub.days} day${sub.days === 1 ? "" : "s"}`}.`}
          </p>
          <div style={{ background: "#f8f9fa", border: "1px solid #e2e8f0", borderRadius: 8, padding: 16, margin: "16px 0", fontSize: 13 }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}><strong>Account</strong><span>{sub.company}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}><strong>Plan</strong><span>{sub.plan}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}><strong>Expiry Date</strong><span>{sub.expiryDate}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", color: urgent ? "#dc2626" : "#333" }}>
              <strong>Days Remaining</strong>
              <span style={{ fontWeight: 700 }}>{expired ? `${Math.abs(sub.days)} days overdue` : `${sub.days} days`}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}><strong>Renewal Amount</strong><span>${sub.monthlyValue.toLocaleString()}/mo</span></div>
          </div>
          <div style={{ textAlign: "center", margin: "24px 0" }}>
            <a href="#" style={{ background: "#dc2626", color: "white", padding: "12px 28px", borderRadius: 6, textDecoration: "none", fontWeight: 600, fontSize: 14, display: "inline-block" }}>
              Renew Subscription
            </a>
          </div>
          <p style={{ fontSize: 13, color: "#666", lineHeight: 1.6 }}>
            Need help? Contact our team at <a href="mailto:billing@facetime.app" style={{ color: "#dc2626" }}>billing@facetime.app</a> or call +971 4 000 0000.
          </p>
          <hr style={{ border: 0, borderTop: "1px solid #e5e7eb", margin: "24px 0" }} />
          <p style={{ fontSize: 11, color: "#999", textAlign: "center" }}>
            © FaceTime SaaS • This is an automated reminder sent daily until renewal.
          </p>
        </div>
      </div>
    </div>
  );
}
