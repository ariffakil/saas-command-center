import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Package, Search } from "lucide-react";
import { PageHeader, TableShell, Th, Td, Badge, statusTone, Btn, Input, Select, Card } from "@/components/ui-bits";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/_app/products")({ component: ProductsPage });

type Product = {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: "Active" | "Inactive";
  description?: string;
};

const STORAGE_KEY = "facetime.products.v1";

const seed: Product[] = [
  { id: "P-1001", sku: "FX-PRO-01", name: "FaceX Pro Terminal", category: "Device", price: 650, stock: 24, status: "Active", description: "Cloud-connected face recognition terminal." },
  { id: "P-1002", sku: "FX-LITE-01", name: "FaceX Lite Terminal", category: "Device", price: 320, stock: 40, status: "Active", description: "Entry-level attendance terminal." },
  { id: "P-1003", sku: "MOD-ACL-01", name: "Access Control Module", category: "Module", price: 250, stock: 999, status: "Active" },
  { id: "P-1004", sku: "PLAN-PRO-12", name: "Professional Plan (Annual)", category: "Subscription", price: 1788, stock: 999, status: "Active" },
];

const empty: Product = { id: "", sku: "", name: "", category: "Device", price: 0, stock: 0, status: "Active", description: "" };

function ProductsPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product>(empty);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<string>("All");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      setItems(raw ? JSON.parse(raw) : seed);
    } catch {
      setItems(seed);
    }
  }, []);

  useEffect(() => {
    if (items.length) localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const openNew = () => {
    setEditing({ ...empty, id: `P-${Date.now().toString().slice(-6)}` });
    setOpen(true);
  };
  const openEdit = (p: Product) => { setEditing(p); setOpen(true); };
  const save = () => {
    if (!editing.name.trim() || !editing.sku.trim()) return;
    setItems((prev) => {
      const exists = prev.some((p) => p.id === editing.id);
      return exists ? prev.map((p) => (p.id === editing.id ? editing : p)) : [editing, ...prev];
    });
    setOpen(false);
  };
  const remove = (id: string) => {
    if (!confirm("Delete this product?")) return;
    setItems((prev) => prev.filter((p) => p.id !== id));
  };

  const categories = ["All", "Device", "Module", "Subscription", "Accessory", "Service"];
  const filtered = items.filter((p) =>
    (filter === "All" || p.category === filter) &&
    (p.name.toLowerCase().includes(query.toLowerCase()) || p.sku.toLowerCase().includes(query.toLowerCase())),
  );

  const totalValue = items.reduce((s, p) => s + p.price * p.stock, 0);

  return (
    <div>
      <PageHeader
        title="Products"
        description="Manage your catalog — devices, modules, plans and accessories."
        actions={<Btn onClick={openNew}><Plus className="h-4 w-4" /> Add Product</Btn>}
      />

      <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card><div className="text-xs uppercase text-muted-foreground">Total Products</div><div className="mt-2 text-2xl font-semibold">{items.length}</div></Card>
        <Card><div className="text-xs uppercase text-muted-foreground">Active</div><div className="mt-2 text-2xl font-semibold">{items.filter(i => i.status === "Active").length}</div></Card>
        <Card><div className="text-xs uppercase text-muted-foreground">Inventory Value</div><div className="mt-2 text-2xl font-semibold">${totalValue.toLocaleString()}</div></Card>
      </div>

      <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name or SKU..." className="pl-9" />
        </div>
        <Select value={filter} onChange={(e) => setFilter(e.target.value)}>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </Select>
      </div>

      <TableShell>
        <thead className="bg-muted/40"><tr>
          <Th>SKU</Th><Th>Product</Th><Th>Category</Th><Th>Price</Th><Th>Stock</Th><Th>Status</Th><Th /></tr></thead>
        <tbody className="divide-y divide-border">
          {filtered.length === 0 && (
            <tr><Td className="py-10 text-center text-muted-foreground" ><div className="flex flex-col items-center gap-2"><Package className="h-8 w-8 opacity-40" />No products yet — click "Add Product" to create one.</div></Td>
              <Td /><Td /><Td /><Td /><Td /><Td />
            </tr>
          )}
          {filtered.map((p) => (
            <tr key={p.id} className="hover:bg-muted/30">
              <Td className="font-mono text-xs">{p.sku}</Td>
              <Td className="font-medium">{p.name}<div className="text-xs text-muted-foreground">{p.description}</div></Td>
              <Td><Badge tone="primary">{p.category}</Badge></Td>
              <Td className="font-semibold">${p.price.toLocaleString()}</Td>
              <Td>{p.stock}</Td>
              <Td><Badge tone={statusTone(p.status)}>{p.status}</Badge></Td>
              <Td>
                <div className="flex gap-1">
                  <Btn variant="ghost" size="sm" onClick={() => openEdit(p)}><Pencil className="h-4 w-4" /></Btn>
                  <Btn variant="ghost" size="sm" onClick={() => remove(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Btn>
                </div>
              </Td>
            </tr>
          ))}
        </tbody>
      </TableShell>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{items.some(i => i.id === editing.id) ? "Edit Product" : "Add Product"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div><Label>SKU</Label><Input value={editing.sku} onChange={(e) => setEditing({ ...editing, sku: e.target.value })} placeholder="FX-PRO-01" /></div>
            <div><Label>Name</Label><Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} placeholder="Product name" /></div>
            <div>
              <Label>Category</Label>
              <Select value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })}>
                {["Device", "Module", "Subscription", "Accessory", "Service"].map((c) => <option key={c} value={c}>{c}</option>)}
              </Select>
            </div>
            <div>
              <Label>Status</Label>
              <Select value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value as Product["status"] })}>
                <option value="Active">Active</option><option value="Inactive">Inactive</option>
              </Select>
            </div>
            <div><Label>Price (USD)</Label><Input type="number" value={editing.price} onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })} /></div>
            <div><Label>Stock</Label><Input type="number" value={editing.stock} onChange={(e) => setEditing({ ...editing, stock: Number(e.target.value) })} /></div>
            <div className="md:col-span-2"><Label>Description</Label><Textarea value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} placeholder="Short description" /></div>
          </div>
          <DialogFooter>
            <Btn variant="outline" onClick={() => setOpen(false)}>Cancel</Btn>
            <Btn onClick={save}>Save Product</Btn>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}