import type { DocumentView } from "@/lib/document-data";
import { companyInfo } from "@/lib/document-data";

const fmt = (n: number) =>
  n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function DocumentTemplate({ doc }: { doc: DocumentView }) {
  const isInvoice = doc.type === "invoice";
  const heading = isInvoice ? "TAX INVOICE" : "Quotation";
  const rateLabel = isInvoice ? "Unit Price" : "Rate";

  return (
    <div className="doc-page">
      <style>{`
        .doc-page { font-family: 'Helvetica Neue', Arial, sans-serif; color: #333; background:#fff; padding: 56px 56px 40px; max-width: 820px; margin: 0 auto; font-size: 12px; line-height: 1.5; }
        .doc-head { display: flex; justify-content: space-between; align-items: flex-start; }
        .doc-logo { display:flex; align-items:center; gap:8px; }
        .doc-logo .badge { width: 38px; height: 38px; border-radius: 6px; background:#7a1f1f; color:#fff; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:14px; box-shadow: inset 0 0 0 2px #fff2; }
        .doc-logo .name { font-weight: 800; font-size: 22px; letter-spacing: 4px; color:#c1272d; }
        .doc-logo .sub { font-size: 8px; letter-spacing: 2px; color:#444; margin-top: 2px; }
        .company-block { margin-top: 14px; }
        .company-block .cn { font-weight: 700; font-size: 13px; color:#222; }
        .company-block .cl { color:#444; font-size: 11.5px; }
        .heading { font-size: 34px; font-weight: 300; color:#3f4a60; text-align:right; letter-spacing:1px; }
        .docnum { text-align:right; font-weight:700; color:#3f4a60; margin-top: 6px; font-size: 13px; }
        .balance-label { text-align:right; color:#444; margin-top: 22px; font-size: 12px; }
        .balance-amt { text-align:right; font-weight:700; font-size:18px; color:#222; }
        .meta { margin-top: 36px; display: grid; grid-template-columns: 1fr auto auto; gap: 8px 24px; align-items:start; }
        .meta .lbl { color:#444; }
        .meta .val { color:#222; font-weight:500; text-align:right; }
        .billto { margin-top: 6px; }
        .billto .lbl { color:#666; font-size: 12px; }
        .billto .nm { font-weight: 700; font-size: 13px; color:#222; margin-top: 2px; }
        .items { width: 100%; border-collapse: collapse; margin-top: 28px; }
        .items thead th { background:#3f4a60; color:#fff; font-weight:500; text-align:right; padding: 10px 12px; font-size: 12px; }
        .items thead th:first-child, .items thead th:nth-child(2) { text-align:left; }
        .items tbody td { padding: 14px 12px; border-bottom: 1px solid #e5e7eb; vertical-align: top; text-align:right; }
        .items tbody td:first-child, .items tbody td:nth-child(2) { text-align:left; }
        .items .desc-title { font-weight:600; color:#222; }
        .items .desc-body { color:#555; font-size: 11.5px; margin-top:2px; white-space: pre-line; }
        .items .qty-unit { color:#666; font-size: 11px; }
        .totals-row td { border-bottom: 1px solid #e5e7eb !important; font-weight:600; }
        .totals-row .lbl { text-align:right; }
        .grand-row td { border-bottom: none !important; padding-top: 16px; }
        .grand-row .grand-lbl { font-weight:700; color:#222; }
        .grand-row .grand-val { font-weight:800; color:#222; font-size: 14px; }
        .tax-summary { margin-top: 36px; }
        .tax-summary .h { font-size: 13px; color:#444; margin-bottom: 8px; }
        .tax-table { width:100%; border-collapse: collapse; }
        .tax-table thead th { background:#3f4a60; color:#fff; font-weight:500; padding: 8px 12px; font-size: 12px; }
        .tax-table thead th:last-child { text-align:right; }
        .tax-table tbody td { padding: 10px 12px; border-bottom: 1px solid #e5e7eb; }
        .tax-table tbody td:last-child { text-align:right; }
        .tax-table .tot td { font-weight:700; }
        .terms { margin-top: 36px; }
        .terms .h { color:#444; font-size: 13px; margin-bottom: 6px; }
        .terms p { margin: 0 0 4px; color:#444; }
        .signoff { margin-top: 22px; color:#444; }
        .footer { margin-top: 60px; padding-top: 12px; border-top: 1px solid #d1d5db; text-align:center; color:#666; font-size: 11px; }
        @media print {
          body { background:#fff !important; }
          .doc-page { padding: 24px; box-shadow: none; max-width: none; }
          .no-print { display:none !important; }
        }
      `}</style>

      <div className="doc-head">
        <div style={{ maxWidth: "55%" }}>
          <div className="doc-logo">
            <div className="badge">★</div>
            <div>
              <div className="name">FACETIME</div>
              <div className="sub">CLOUD ATTENDANCE</div>
            </div>
          </div>
          <div className="company-block">
            <div className="cn">{companyInfo.name}</div>
            <div className="cl">{companyInfo.address}</div>
            <div className="cl">{companyInfo.phones}</div>
            <div className="cl">{companyInfo.contact}</div>
            <div className="cl">{companyInfo.trn}</div>
          </div>
        </div>
        <div style={{ minWidth: "40%" }}>
          <div className="heading">{heading}</div>
          <div className="docnum"># {doc.number}</div>
          {doc.type === "invoice" && (
            <>
              <div className="balance-label">Balance Due</div>
              <div className="balance-amt">AED{fmt(doc.balanceDue)}</div>
            </>
          )}
        </div>
      </div>

      <div className="meta">
        <div className="billto">
          <div className="lbl">Bill To</div>
          <div className="nm">{doc.billTo.name}</div>
          {doc.billTo.trn && <div className="cl" style={{ color:"#444" }}>{doc.billTo.trn}</div>}
          {doc.billTo.address && <div className="cl" style={{ color:"#444" }}>{doc.billTo.address}</div>}
          {doc.billTo.email && <div className="cl" style={{ color:"#444" }}>{doc.billTo.email}</div>}
        </div>
        <div>
          {isInvoice ? (
            <>
              <div className="lbl">Invoice Date :</div>
              <div className="lbl">Terms :</div>
              <div className="lbl">Due Date :</div>
            </>
          ) : (
            <>
              <div className="lbl">Quotation Date :</div>
              <div className="lbl">Valid Until :</div>
            </>
          )}
        </div>
        <div>
          {isInvoice ? (
            <>
              <div className="val">{doc.date}</div>
              <div className="val">{doc.terms}</div>
              <div className="val">{doc.dueDate}</div>
            </>
          ) : (
            <>
              <div className="val">{doc.date}</div>
              <div className="val">{doc.validUntil}</div>
            </>
          )}
        </div>
      </div>

      <table className="items">
        <thead>
          <tr>
            <th style={{ width: 32 }}>#</th>
            <th>Item &amp; Description</th>
            <th style={{ width: 80 }}>Qty</th>
            <th style={{ width: 90 }}>{rateLabel}</th>
            <th style={{ width: 70 }}>Tax</th>
            <th style={{ width: 100 }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {doc.items.map((it, idx) => (
            <tr key={idx}>
              <td>{idx + 1}</td>
              <td>
                <div className="desc-title">{it.code}</div>
                <div className="desc-body">{it.title}{"\n"}{it.description}</div>
              </td>
              <td>
                {fmt(it.qty)}
                <div className="qty-unit">{it.unit}</div>
              </td>
              <td>{fmt(it.rate)}</td>
              <td>{fmt(it.tax)}</td>
              <td>{fmt(it.amount)}</td>
            </tr>
          ))}
          <tr className="totals-row">
            <td colSpan={3}></td>
            <td className="lbl">Sub Total</td>
            <td>{fmt(doc.subTotalTax)}</td>
            <td>{fmt(doc.subTotalAmount)}</td>
          </tr>
          <tr className="grand-row">
            <td colSpan={3}></td>
            <td className="grand-lbl" style={{ textAlign:"right" }}>Total</td>
            <td></td>
            <td className="grand-val">AED{fmt(doc.total)}</td>
          </tr>
        </tbody>
      </table>

      {isInvoice && (
        <div className="tax-summary">
          <div className="h">Tax Summary</div>
          <table className="tax-table">
            <thead>
              <tr>
                <th>Tax Details</th>
                <th>Tax Amount (AED)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Standard Rate (5%)</td>
                <td>{fmt(doc.subTotalTax)}</td>
              </tr>
              <tr className="tot">
                <td>Total</td>
                <td>AED{fmt(doc.subTotalTax)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <div className="terms">
        <div className="h">Terms &amp; Conditions</div>
        {isInvoice ? (
          <>
            <p>Subscription is non-refundable once activated on the FaceTime cloud platform.</p>
            <p>Service remains active subject to timely payment as per the agreed billing cycle.</p>
            <p>Late payments may result in account suspension and a reactivation fee.</p>
          </>
        ) : (
          <>
            <p>Warranty: Cloud platform uptime SLA 99.9% as per service agreement.</p>
            <p>Order Placement: Purchase Order to be made in favor of "FaceTime Technologies LLC".</p>
            <p>Payment: 100% advance against subscription activation.</p>
            <p>Validity: This offer is valid up to 30 days from the date of submission.</p>
          </>
        )}
        <div className="signoff">
          {companyInfo.name}<br />
          {companyInfo.signatory} | {companyInfo.signatoryPhone} | {companyInfo.signatoryEmail}
        </div>
      </div>

      <div className="footer">
        This is a system generated {isInvoice ? "Invoice" : "Quotation"} and does not require a signature.
      </div>
    </div>
  );
}