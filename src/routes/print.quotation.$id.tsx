import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { DocumentTemplate } from "@/components/document-template";
import { getQuotationView } from "@/lib/document-data";
import { Printer, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/print/quotation/$id")({
  component: PrintQuotation,
  loader: ({ params }) => {
    const doc = getQuotationView(params.id);
    if (!doc) throw notFound();
    return { doc };
  },
  notFoundComponent: () => (
    <div className="p-10 text-center">
      <h1 className="text-xl font-semibold">Quotation not found</h1>
      <Link to="/quotations" className="mt-2 inline-block text-primary hover:underline">Back</Link>
    </div>
  ),
  errorComponent: ({ error }) => <div className="p-6 text-destructive">{error.message}</div>,
});

function PrintQuotation() {
  const { doc } = Route.useLoaderData();
  useEffect(() => { document.body.style.background = "#f3f4f6"; }, []);
  return (
    <div style={{ minHeight: "100vh", padding: "16px 0" }}>
      <div className="no-print" style={{ maxWidth: 820, margin: "0 auto 12px", display:"flex", justifyContent:"space-between", padding: "0 8px" }}>
        <Link to="/quotations" style={{ display:"inline-flex", alignItems:"center", gap:6, fontSize:14, color:"#374151", textDecoration:"none" }}>
          <ArrowLeft size={16} /> Back to Quotations
        </Link>
        <button onClick={() => window.print()} style={{ display:"inline-flex", alignItems:"center", gap:6, background:"#3f4a60", color:"#fff", border:0, padding:"8px 14px", borderRadius:6, cursor:"pointer", fontSize:14 }}>
          <Printer size={16} /> Print / Save PDF
        </button>
      </div>
      <div style={{ background:"#fff", maxWidth: 820, margin:"0 auto", boxShadow:"0 1px 3px rgba(0,0,0,.1)" }}>
        <DocumentTemplate doc={doc} />
      </div>
    </div>
  );
}