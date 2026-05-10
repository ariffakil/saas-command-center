import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

const tones = {
  success: "bg-success/15 text-success border-success/30",
  warning: "bg-warning/15 text-warning-foreground border-warning/40",
  danger: "bg-destructive/15 text-destructive border-destructive/30",
  info: "bg-info/15 text-info border-info/30",
  neutral: "bg-muted text-muted-foreground border-border",
  primary: "bg-primary-soft text-accent-foreground border-primary/30",
} as const;
export type Tone = keyof typeof tones;

export function Badge({ tone = "neutral", children, className }: { tone?: Tone; children: ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium", tones[tone], className)}>
      {children}
    </span>
  );
}

export function statusTone(s: string): Tone {
  const v = s.toLowerCase();
  if (["active", "paid", "online", "confirmed", "accepted"].includes(v)) return "success";
  if (["trial", "sent", "draft", "partial"].includes(v)) return "info";
  if (["pending"].includes(v)) return "warning";
  if (["expired", "overdue", "suspended", "rejected", "offline", "failed", "inactive"].includes(v)) return "danger";
  return "neutral";
}

export function KpiCard({ label, value, hint, icon: Icon, tone = "primary" }: {
  label: string; value: ReactNode; hint?: ReactNode; icon: React.ComponentType<{ className?: string }>; tone?: Tone;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</div>
          <div className="mt-2 text-2xl font-semibold text-card-foreground">{value}</div>
          {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
        </div>
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", tones[tone])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("rounded-xl border border-border bg-card p-5 shadow-sm", className)}>{children}</div>;
}

export function CardTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h3 className="text-base font-semibold text-card-foreground">{children}</h3>
      {action}
    </div>
  );
}

export function Progress({ value, max, tone }: { value: number; max: number; tone?: Tone }) {
  const pct = Math.min(100, Math.round((value / Math.max(1, max)) * 100));
  const t: Tone = tone ?? (pct >= 90 ? "danger" : pct >= 75 ? "warning" : "success");
  const bar = t === "danger" ? "bg-destructive" : t === "warning" ? "bg-warning" : t === "info" ? "bg-info" : "bg-success";
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
      <div className={cn("h-full rounded-full transition-all", bar)} style={{ width: `${pct}%` }} />
    </div>
  );
}

export function Btn({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "outline" | "ghost" | "danger"; size?: "sm" | "md" }) {
  const v = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline: "border border-input bg-card hover:bg-muted text-foreground",
    ghost: "hover:bg-muted text-foreground",
    danger: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  }[variant];
  const s = size === "sm" ? "h-8 px-3 text-xs" : "h-9 px-4 text-sm";
  return (
    <button {...props} className={cn("inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors disabled:opacity-50", v, s, className)}>
      {children}
    </button>
  );
}

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "h-9 w-full rounded-md border border-input bg-card px-3 text-sm text-foreground outline-none ring-ring/40 transition placeholder:text-muted-foreground focus:ring-2",
        className,
      )}
    />
  );
}

export function Select({ className, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        "h-9 rounded-md border border-input bg-card px-3 text-sm text-foreground outline-none ring-ring/40 focus:ring-2",
        className,
      )}
    >
      {children}
    </select>
  );
}

export function Th({ children, className }: { children?: ReactNode; className?: string }) {
  return (
    <th className={cn("whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground", className)}>
      {children}
    </th>
  );
}

export function Td({ children, className }: { children?: ReactNode; className?: string }) {
  return <td className={cn("whitespace-nowrap px-4 py-3 text-sm text-card-foreground", className)}>{children}</td>;
}

export function TableShell({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-border">{children}</table>
      </div>
    </div>
  );
}