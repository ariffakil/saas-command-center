import { invoices, quotations, subscribers, type Invoice, type Quotation } from "./mock-data";

export const companyInfo = {
  name: "FaceTime Technologies LLC",
  address: "P.O.Box : 50421 , Dubai , United Arab Emirates",
  phones: "+971 4 5562 100 / +971 55 880 4421",
  contact: "billing@facetime.cloud, www.facetime.cloud",
  trn: "TRN : 100482915600003",
  signatory: "Ahmed Faris",
  signatoryPhone: "055-8804421",
  signatoryEmail: "billing@facetime.cloud",
};

export interface LineItem {
  code: string;
  title: string;
  description: string;
  qty: number;
  unit: string;
  rate: number;
}

export interface DocItem extends LineItem {
  tax: number;
  amount: number;
}

const TAX_RATE = 0.05;

function compute(items: LineItem[]): { items: DocItem[]; subTotalTax: number; subTotalAmount: number; total: number } {
  const out = items.map((li) => {
    const base = li.qty * li.rate;
    const tax = +(base * TAX_RATE).toFixed(2);
    return { ...li, tax, amount: +(base + tax).toFixed(2) };
  });
  const subTotalTax = +out.reduce((s, i) => s + i.tax, 0).toFixed(2);
  const subTotalAmount = +out.reduce((s, i) => s + i.amount, 0).toFixed(2);
  return { items: out, subTotalTax, subTotalAmount, total: subTotalAmount };
}

function planItem(plan: string, users: number, months = 12): LineItem {
  const rate =
    plan === "Enterprise" ? 350 :
    plan === "Professional" ? 180 :
    plan === "Basic" ? 90 : 0;
  return {
    code: `PLAN-${plan.toUpperCase()}`,
    title: `${plan} Plan Subscription`,
    description: `FaceTime Cloud ${plan} subscription for ${users} users — Time Attendance, Face Recognition, Reports & Mobile App.`,
    qty: months,
    unit: "month",
    rate,
  };
}

function deviceLine(qty: number): LineItem {
  return {
    code: "DEV-FX-PRO",
    title: "FaceX Pro Device License",
    description: "Cloud-connected face recognition terminal license, OTA updates and live sync.",
    qty,
    unit: "pcs",
    rate: 65,
  };
}

function moduleLine(): LineItem {
  return {
    code: "MOD-ADV",
    title: "Advanced Module Pack",
    description: "Access Control, Visitor Management, Payroll Report and WPS Report add-ons.",
    qty: 1,
    unit: "pack",
    rate: 250,
  };
}

export interface DocumentView {
  type: "invoice" | "quotation";
  number: string;
  date: string;
  dueDate?: string;
  validUntil?: string;
  terms?: string;
  status: string;
  billTo: { name: string; trn?: string; email?: string; address?: string };
  items: DocItem[];
  subTotalTax: number;
  subTotalAmount: number;
  total: number;
  balanceDue: number;
}

export function getInvoiceView(id: string): DocumentView | null {
  const inv = invoices.find((i) => i.id === id);
  if (!inv) return null;
  const sub = subscribers.find((s) => s.id === inv.subscriberId);
  const lines: LineItem[] = sub
    ? [planItem(sub.plan, sub.users.limit), deviceLine(Math.max(1, Math.round(sub.devices.used / 4)))]
    : [planItem("Professional", 100), deviceLine(2)];
  // scale to roughly match invoice total
  const computed = computeAndScale(lines, inv.amount);
  return {
    type: "invoice",
    number: inv.id,
    date: inv.date,
    dueDate: inv.dueDate,
    terms: "Due on Receipt",
    status: inv.status,
    billTo: {
      name: inv.subscriber,
      trn: sub ? `TRN ${100000000000000 + parseInt(sub.id.replace(/\D/g, ""))}` : undefined,
      email: sub?.email,
      address: sub ? `${sub.city}, ${sub.country}` : undefined,
    },
    ...computed,
    balanceDue: inv.status === "Paid" ? 0 : inv.status === "Partial" ? +(computed.total / 2).toFixed(2) : computed.total,
  };
}

export function getQuotationView(id: string): DocumentView | null {
  const q = quotations.find((x) => x.id === id);
  if (!q) return null;
  const lines: LineItem[] = [
    planItem(q.plan, q.users),
    deviceLine(Math.max(1, Math.round(q.devices / 2))),
    moduleLine(),
  ];
  const computed = computeAndScale(lines, q.total);
  return {
    type: "quotation",
    number: q.id,
    date: q.date,
    validUntil: q.validUntil,
    status: q.status,
    billTo: { name: q.prospect },
    ...computed,
    balanceDue: computed.total,
  };
}

function computeAndScale(items: LineItem[], targetSubtotal: number) {
  const draft = compute(items);
  const currentBase = draft.subTotalAmount - draft.subTotalTax;
  const factor = currentBase > 0 ? targetSubtotal / currentBase : 1;
  const scaled = items.map((li) => ({ ...li, rate: +(li.rate * factor).toFixed(2) }));
  return compute(scaled);
}

export type { Invoice, Quotation };