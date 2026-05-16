export type AccountStatus = "Active" | "Suspended" | "Trial" | "Expired";
export type PlanType = "Trial" | "Basic" | "Professional" | "Enterprise";

export interface Subscriber {
  id: string;
  company: string;
  holder: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  businessType: string;
  status: AccountStatus;
  plan: PlanType;
  startDate: string;
  expiryDate: string;
  users: { used: number; limit: number };
  devices: { used: number; limit: number };
  branches: { used: number; limit: number };
  monthlyValue: number;
}

export const subscribers: Subscriber[] = [
  { id: "SUB-1001", company: "Emirates Logistics LLC", holder: "Ahmed Al Mansoori", email: "ahmed@emirateslog.ae", phone: "+971 50 123 4567", country: "UAE", city: "Dubai", businessType: "Logistics", status: "Active", plan: "Enterprise", startDate: "2024-01-15", expiryDate: "2026-01-15", users: { used: 412, limit: 500 }, devices: { used: 28, limit: 30 }, branches: { used: 6, limit: 10 }, monthlyValue: 4800 },
  { id: "SUB-1002", company: "Gulf Construction Co.", holder: "Fatima Hassan", email: "fatima@gulfco.sa", phone: "+966 55 234 5678", country: "Saudi Arabia", city: "Riyadh", businessType: "Construction", status: "Active", plan: "Professional", startDate: "2024-03-01", expiryDate: "2025-12-01", users: { used: 180, limit: 200 }, devices: { used: 14, limit: 15 }, branches: { used: 4, limit: 5 }, monthlyValue: 2200 },
  { id: "SUB-1003", company: "Al Noor Hospital Group", holder: "Dr. Khalid Rahman", email: "k.rahman@alnoor.qa", phone: "+974 33 345 6789", country: "Qatar", city: "Doha", businessType: "Healthcare", status: "Active", plan: "Enterprise", startDate: "2023-11-20", expiryDate: "2025-11-20", users: { used: 720, limit: 1000 }, devices: { used: 42, limit: 50 }, branches: { used: 8, limit: 12 }, monthlyValue: 6500 },
  { id: "SUB-1004", company: "BlueWave Tech", holder: "Sarah Connor", email: "sarah@bluewave.io", phone: "+1 415 555 0193", country: "USA", city: "San Francisco", businessType: "Software", status: "Trial", plan: "Trial", startDate: "2026-04-25", expiryDate: "2026-05-25", users: { used: 12, limit: 25 }, devices: { used: 2, limit: 3 }, branches: { used: 1, limit: 1 }, monthlyValue: 0 },
  { id: "SUB-1005", company: "Sahara Retail Group", holder: "Omar Belkacem", email: "omar@sahara-retail.dz", phone: "+213 55 678 9012", country: "Algeria", city: "Algiers", businessType: "Retail", status: "Expired", plan: "Basic", startDate: "2024-05-10", expiryDate: "2025-05-10", users: { used: 45, limit: 50 }, devices: { used: 5, limit: 5 }, branches: { used: 2, limit: 3 }, monthlyValue: 850 },
  { id: "SUB-1006", company: "Pinnacle Hotels", holder: "James Whittaker", email: "j.whittaker@pinnacle.co.uk", phone: "+44 20 7946 0123", country: "UK", city: "London", businessType: "Hospitality", status: "Active", plan: "Professional", startDate: "2024-08-12", expiryDate: "2026-08-12", users: { used: 95, limit: 150 }, devices: { used: 11, limit: 15 }, branches: { used: 3, limit: 6 }, monthlyValue: 1950 },
  { id: "SUB-1007", company: "Nile Manufacturing", holder: "Mona Said", email: "mona@nile-mfg.eg", phone: "+20 100 234 5678", country: "Egypt", city: "Cairo", businessType: "Manufacturing", status: "Suspended", plan: "Basic", startDate: "2024-02-05", expiryDate: "2025-08-05", users: { used: 60, limit: 60 }, devices: { used: 6, limit: 6 }, branches: { used: 2, limit: 2 }, monthlyValue: 750 },
  { id: "SUB-1008", company: "Crescent Education", holder: "Yusuf Karim", email: "yusuf@crescent.edu.pk", phone: "+92 300 123 4567", country: "Pakistan", city: "Lahore", businessType: "Education", status: "Active", plan: "Professional", startDate: "2025-01-08", expiryDate: "2026-01-08", users: { used: 240, limit: 300 }, devices: { used: 18, limit: 20 }, branches: { used: 5, limit: 8 }, monthlyValue: 1800 },
  { id: "SUB-1009", company: "Atlas Banking Services", holder: "Layla Hammoud", email: "l.hammoud@atlasbank.lb", phone: "+961 71 456 789", country: "Lebanon", city: "Beirut", businessType: "Finance", status: "Active", plan: "Enterprise", startDate: "2023-06-01", expiryDate: "2026-06-01", users: { used: 580, limit: 800 }, devices: { used: 35, limit: 40 }, branches: { used: 9, limit: 15 }, monthlyValue: 5400 },
  { id: "SUB-1010", company: "Verde Agro Solutions", holder: "Carlos Mendes", email: "carlos@verdeagro.br", phone: "+55 11 98765 4321", country: "Brazil", city: "São Paulo", businessType: "Agriculture", status: "Trial", plan: "Trial", startDate: "2026-05-01", expiryDate: "2026-05-31", users: { used: 8, limit: 25 }, devices: { used: 1, limit: 3 }, branches: { used: 1, limit: 1 }, monthlyValue: 0 },
  { id: "SUB-1011", company: "Northstar Mining", holder: "Erik Lindqvist", email: "erik@northstar.no", phone: "+47 95 123 456", country: "Norway", city: "Oslo", businessType: "Mining", status: "Active", plan: "Enterprise", startDate: "2024-04-18", expiryDate: "2026-04-18", users: { used: 320, limit: 400 }, devices: { used: 22, limit: 25 }, branches: { used: 4, limit: 8 }, monthlyValue: 3900 },
  { id: "SUB-1012", company: "Lotus Garments", holder: "Priya Sharma", email: "priya@lotusgarments.in", phone: "+91 98765 43210", country: "India", city: "Mumbai", businessType: "Textile", status: "Expired", plan: "Professional", startDate: "2024-04-30", expiryDate: "2025-04-30", users: { used: 150, limit: 150 }, devices: { used: 12, limit: 12 }, branches: { used: 3, limit: 3 }, monthlyValue: 1700 },
];

export const moduleList = [
  "Time Attendance", "Face Recognition", "Access Control", "Visitor Management",
  "Payroll Report", "WPS Report", "Leave Management", "Mobile App",
  "Multi-Branch Management", "Device Management", "Live Dashboard",
  "Advanced Reports", "API Integration",
] as const;

export interface Branch {
  id: string; subscriberId: string; name: string; location: string;
  manager: string; phone: string; users: number; devices: number; status: "Active" | "Inactive";
  lat: number; lng: number;
}
export const branches: Branch[] = [
  { id: "BR-001", subscriberId: "SUB-1001", name: "Dubai HQ", location: "Dubai, UAE", manager: "Hassan Ali", phone: "+971 4 123 4567", users: 180, devices: 12, status: "Active", lat: 25.2048, lng: 55.2708 },
  { id: "BR-002", subscriberId: "SUB-1001", name: "Abu Dhabi Branch", location: "Abu Dhabi, UAE", manager: "Mariam Saleh", phone: "+971 2 234 5678", users: 95, devices: 8, status: "Active", lat: 24.4539, lng: 54.3773 },
  { id: "BR-003", subscriberId: "SUB-1003", name: "Doha Main Hospital", location: "Doha, Qatar", manager: "Dr. Aisha Faris", phone: "+974 44 567 890", users: 320, devices: 18, status: "Active", lat: 25.2854, lng: 51.5310 },
  { id: "BR-004", subscriberId: "SUB-1003", name: "West Bay Clinic", location: "West Bay, Qatar", manager: "Nora Salim", phone: "+974 44 890 123", users: 110, devices: 9, status: "Active", lat: 25.3243, lng: 51.5310 },
  { id: "BR-005", subscriberId: "SUB-1009", name: "Beirut Central", location: "Beirut, Lebanon", manager: "Tariq Sayegh", phone: "+961 1 345 678", users: 220, devices: 15, status: "Active", lat: 33.8938, lng: 35.5018 },
  { id: "BR-006", subscriberId: "SUB-1006", name: "London Mayfair", location: "London, UK", manager: "Eleanor Brooks", phone: "+44 20 7946 0123", users: 45, devices: 5, status: "Active", lat: 51.5074, lng: -0.1278 },
  { id: "BR-007", subscriberId: "SUB-1011", name: "Oslo Operations", location: "Oslo, Norway", manager: "Sven Berg", phone: "+47 22 12 34 56", users: 140, devices: 10, status: "Active", lat: 59.9139, lng: 10.7522 },
  { id: "BR-008", subscriberId: "SUB-1007", name: "Cairo Plant", location: "Cairo, Egypt", manager: "Karim Fouad", phone: "+20 2 2345 6789", users: 60, devices: 6, status: "Inactive", lat: 30.0444, lng: 31.2357 },
];

export interface Device {
  id: string; subscriberId: string; name: string; serial: string;
  type: "Face" | "Fingerprint" | "RFID"; branch: string; lastSync: string;
  online: boolean; firmware: string; assignedUsers: number; active: boolean;
}
export const devices: Device[] = [
  { id: "DV-1001", subscriberId: "SUB-1001", name: "FaceX Pro 01", serial: "FX-2024-0001", type: "Face", branch: "Dubai HQ", lastSync: "2026-05-10 09:14", online: true, firmware: "v3.2.1", assignedUsers: 180, active: true },
  { id: "DV-1002", subscriberId: "SUB-1001", name: "FaceX Pro 02", serial: "FX-2024-0002", type: "Face", branch: "Dubai HQ", lastSync: "2026-05-10 09:12", online: true, firmware: "v3.2.1", assignedUsers: 175, active: true },
  { id: "DV-1003", subscriberId: "SUB-1001", name: "Gate Reader 03", serial: "RF-2024-0033", type: "RFID", branch: "Abu Dhabi Branch", lastSync: "2026-05-10 08:55", online: true, firmware: "v2.1.0", assignedUsers: 95, active: true },
  { id: "DV-1004", subscriberId: "SUB-1003", name: "Hospital Cam A1", serial: "FX-2024-0091", type: "Face", branch: "Doha Main Hospital", lastSync: "2026-05-10 09:18", online: true, firmware: "v3.2.1", assignedUsers: 320, active: true },
  { id: "DV-1005", subscriberId: "SUB-1003", name: "Clinic FP 02", serial: "FP-2024-0011", type: "Fingerprint", branch: "West Bay Clinic", lastSync: "2026-05-09 17:40", online: false, firmware: "v1.9.4", assignedUsers: 110, active: true },
  { id: "DV-1006", subscriberId: "SUB-1009", name: "Atlas Vault FX", serial: "FX-2024-0150", type: "Face", branch: "Beirut Central", lastSync: "2026-05-10 09:00", online: true, firmware: "v3.2.0", assignedUsers: 220, active: true },
  { id: "DV-1007", subscriberId: "SUB-1006", name: "Pinnacle Lobby", serial: "FX-2024-0077", type: "Face", branch: "London Mayfair", lastSync: "2026-05-10 09:05", online: true, firmware: "v3.2.1", assignedUsers: 45, active: true },
  { id: "DV-1008", subscriberId: "SUB-1007", name: "Plant Reader 1", serial: "FP-2024-0044", type: "Fingerprint", branch: "Cairo Plant", lastSync: "2026-04-30 18:22", online: false, firmware: "v1.8.2", assignedUsers: 60, active: false },
];

export type InvoiceStatus = "Paid" | "Pending" | "Overdue" | "Partial";
export interface Invoice {
  id: string; subscriberId: string; subscriber: string; date: string;
  dueDate: string; amount: number; tax: number; discount: number;
  total: number; status: InvoiceStatus;
}
export const invoices: Invoice[] = [
  { id: "INV-2026-0042", subscriberId: "SUB-1001", subscriber: "Emirates Logistics LLC", date: "2026-05-01", dueDate: "2026-05-15", amount: 4800, tax: 240, discount: 0, total: 5040, status: "Paid" },
  { id: "INV-2026-0041", subscriberId: "SUB-1003", subscriber: "Al Noor Hospital Group", date: "2026-05-01", dueDate: "2026-05-15", amount: 6500, tax: 325, discount: 200, total: 6625, status: "Paid" },
  { id: "INV-2026-0040", subscriberId: "SUB-1009", subscriber: "Atlas Banking Services", date: "2026-05-01", dueDate: "2026-05-15", amount: 5400, tax: 270, discount: 0, total: 5670, status: "Pending" },
  { id: "INV-2026-0039", subscriberId: "SUB-1002", subscriber: "Gulf Construction Co.", date: "2026-04-15", dueDate: "2026-04-30", amount: 2200, tax: 110, discount: 0, total: 2310, status: "Overdue" },
  { id: "INV-2026-0038", subscriberId: "SUB-1006", subscriber: "Pinnacle Hotels", date: "2026-04-12", dueDate: "2026-04-26", amount: 1950, tax: 97, discount: 50, total: 1997, status: "Paid" },
  { id: "INV-2026-0037", subscriberId: "SUB-1011", subscriber: "Northstar Mining", date: "2026-04-10", dueDate: "2026-04-24", amount: 3900, tax: 195, discount: 0, total: 4095, status: "Partial" },
  { id: "INV-2026-0036", subscriberId: "SUB-1008", subscriber: "Crescent Education", date: "2026-04-08", dueDate: "2026-04-22", amount: 1800, tax: 90, discount: 0, total: 1890, status: "Paid" },
  { id: "INV-2026-0035", subscriberId: "SUB-1005", subscriber: "Sahara Retail Group", date: "2026-04-01", dueDate: "2026-04-15", amount: 850, tax: 42, discount: 0, total: 892, status: "Overdue" },
];

export interface Quotation {
  id: string; prospect: string; date: string; validUntil: string;
  plan: PlanType; modules: number; users: number; devices: number;
  branches: number; total: number; status: "Sent" | "Accepted" | "Rejected" | "Draft";
}
export const quotations: Quotation[] = [
  { id: "QT-2026-019", prospect: "Horizon Airlines", date: "2026-05-08", validUntil: "2026-06-08", plan: "Enterprise", modules: 12, users: 800, devices: 40, branches: 10, total: 7800, status: "Sent" },
  { id: "QT-2026-018", prospect: "Pacific Shipping", date: "2026-05-06", validUntil: "2026-06-06", plan: "Professional", modules: 9, users: 250, devices: 18, branches: 5, total: 2400, status: "Accepted" },
  { id: "QT-2026-017", prospect: "Riverside Schools", date: "2026-05-04", validUntil: "2026-06-04", plan: "Basic", modules: 5, users: 80, devices: 6, branches: 2, total: 950, status: "Sent" },
  { id: "QT-2026-016", prospect: "Apex Manufacturing", date: "2026-05-01", validUntil: "2026-05-31", plan: "Professional", modules: 10, users: 300, devices: 20, branches: 6, total: 2900, status: "Draft" },
  { id: "QT-2026-015", prospect: "Coastal Resorts", date: "2026-04-25", validUntil: "2026-05-25", plan: "Professional", modules: 8, users: 200, devices: 14, branches: 4, total: 2150, status: "Rejected" },
];

export interface Payment {
  id: string; date: string; invoiceId: string; subscriber: string;
  amount: number; method: "Cash" | "Bank Transfer" | "Card" | "Online";
  reference: string; status: "Confirmed" | "Pending" | "Failed";
}
export const payments: Payment[] = [
  { id: "PAY-3001", date: "2026-05-09", invoiceId: "INV-2026-0042", subscriber: "Emirates Logistics LLC", amount: 5040, method: "Bank Transfer", reference: "TXN-AE-998812", status: "Confirmed" },
  { id: "PAY-3000", date: "2026-05-08", invoiceId: "INV-2026-0041", subscriber: "Al Noor Hospital Group", amount: 6625, method: "Bank Transfer", reference: "TXN-QA-552310", status: "Confirmed" },
  { id: "PAY-2999", date: "2026-05-07", invoiceId: "INV-2026-0038", subscriber: "Pinnacle Hotels", amount: 1997, method: "Card", reference: "STRIPE-9JK22", status: "Confirmed" },
  { id: "PAY-2998", date: "2026-05-05", invoiceId: "INV-2026-0037", subscriber: "Northstar Mining", amount: 2000, method: "Online", reference: "PP-AUR-771", status: "Confirmed" },
  { id: "PAY-2997", date: "2026-05-03", invoiceId: "INV-2026-0036", subscriber: "Crescent Education", amount: 1890, method: "Bank Transfer", reference: "TXN-PK-110987", status: "Confirmed" },
  { id: "PAY-2996", date: "2026-04-29", invoiceId: "INV-2026-0033", subscriber: "BlueWave Tech", amount: 0, method: "Card", reference: "TRIAL", status: "Pending" },
];

export interface ActivityLog {
  id: string; time: string; actor: string; action: string; target: string;
  type: "create" | "update" | "delete" | "billing" | "security";
}
export const activityLogs: ActivityLog[] = [
  { id: "AL-501", time: "2026-05-10 09:22", actor: "Super Admin", action: "Marked invoice as paid", target: "INV-2026-0042", type: "billing" },
  { id: "AL-500", time: "2026-05-10 08:45", actor: "Super Admin", action: "Enabled module Face Recognition", target: "SUB-1006", type: "update" },
  { id: "AL-499", time: "2026-05-09 17:11", actor: "Super Admin", action: "Increased device limit to 50", target: "SUB-1003", type: "update" },
  { id: "AL-498", time: "2026-05-09 14:02", actor: "Super Admin", action: "Suspended account", target: "SUB-1007", type: "security" },
  { id: "AL-497", time: "2026-05-09 11:30", actor: "Super Admin", action: "Created subscriber", target: "BlueWave Tech", type: "create" },
  { id: "AL-496", time: "2026-05-08 16:48", actor: "Super Admin", action: "Created invoice", target: "INV-2026-0041", type: "billing" },
  { id: "AL-495", time: "2026-05-08 10:15", actor: "Super Admin", action: "Updated subscription plan to Enterprise", target: "SUB-1009", type: "update" },
  { id: "AL-494", time: "2026-05-07 09:00", actor: "Super Admin", action: "Deleted device", target: "DV-0992", type: "delete" },
];

// Charts data
export const monthlyRevenue = [
  { month: "Nov", revenue: 38200 },
  { month: "Dec", revenue: 41500 },
  { month: "Jan", revenue: 44800 },
  { month: "Feb", revenue: 47200 },
  { month: "Mar", revenue: 49100 },
  { month: "Apr", revenue: 52400 },
  { month: "May", revenue: 56800 },
];

export const subscriberGrowth = [
  { month: "Nov", subscribers: 84 },
  { month: "Dec", subscribers: 91 },
  { month: "Jan", subscribers: 98 },
  { month: "Feb", subscribers: 105 },
  { month: "Mar", subscribers: 112 },
  { month: "Apr", subscribers: 121 },
  { month: "May", subscribers: 128 },
];

export const accountStatusBreakdown = [
  { name: "Active", value: 86, color: "var(--success)" },
  { name: "Trial", value: 18, color: "var(--info)" },
  { name: "Expired", value: 16, color: "var(--destructive)" },
  { name: "Suspended", value: 8, color: "var(--warning)" },
];

export const moduleUsage = [
  { module: "Time Attend.", count: 128 },
  { module: "Face Recog.", count: 112 },
  { module: "Access Ctrl", count: 84 },
  { module: "Payroll", count: 76 },
  { module: "Leave Mgmt", count: 91 },
  { module: "Mobile App", count: 102 },
  { module: "Reports", count: 88 },
];

export const deviceStatus = [
  { name: "Online", value: 412, color: "var(--success)" },
  { name: "Offline", value: 38, color: "var(--muted-foreground)" },
  { name: "Inactive", value: 14, color: "var(--destructive)" },
];

export const renewalAlerts = [
  { id: "SUB-1010", company: "Verde Agro Solutions", days: 21, type: "Trial ending" },
  { id: "SUB-1004", company: "BlueWave Tech", days: 15, type: "Trial ending" },
  { id: "SUB-1002", company: "Gulf Construction Co.", days: 25, type: "Subscription renewal" },
  { id: "SUB-1003", company: "Al Noor Hospital Group", days: 6, type: "Subscription renewal" },
  { id: "SUB-1005", company: "Sahara Retail Group", days: -5, type: "Expired" },
  { id: "SUB-1012", company: "Lotus Garments", days: -10, type: "Expired" },
];

export const kpiSummary = {
  totalSubscribers: 128,
  activeSubscribers: 86,
  expiredSubscriptions: 16,
  trialAccounts: 18,
  totalUsers: 14820,
  totalDevices: 464,
  totalBranches: 312,
  monthlyRevenue: 56800,
  pendingPayments: 12450,
  upcomingRenewals: 9,
};