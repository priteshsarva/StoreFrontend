// UPI payment screen. Reached after checkout (/pay/:orderNo) and re-openable on
// refresh or return from the UPI app — it restores the pending payment from
// localStorage, so nobody loses the QR / amount / order number mid-payment.
// Manual reconcile: the buyer pays into the vendor's UPI account and sends the
// screenshot on WhatsApp; the vendor confirms the order by hand in the portal.
import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import QRCode from "qrcode";
import { Check } from "lucide-react";
import { useStore } from "../../context/StoreContext";
import { inr } from "../../lib/money";
import { withStore } from "../../lib/tenant";
import { getPending, clearPending, upiLink, payWhatsAppUrl } from "../../lib/pendingPay";

const PAY_MINUTES = 10;

export default function PaymentPage() {
  const { orderNo } = useParams();
  const { config } = useStore();
  const [utr, setUtr] = useState("");
  const [qr, setQr] = useState("");
  const [left, setLeft] = useState(PAY_MINUTES * 60);

  // Prefer the saved payment (survives config reload); fall back to live config
  // so a shared /pay link still works for the store's current UPI details.
  const pending = getPending(config?.slug);
  const pay = useMemo(() => {
    const base = pending && pending.orderNo === orderNo ? pending : null;
    const upiId = base?.upiId || config?.upi_id;
    if (!upiId) return null;
    return {
      orderNo,
      total: base?.total ?? 0,
      storeName: base?.storeName || config?.store_name || "Store",
      upiId,
      upiName: base?.upiName || config?.upi_name || "",
      whatsapp: base?.whatsapp || config?.whatsapp || "",
    };
  }, [pending, orderNo, config]);

  const link = pay ? upiLink(pay) : "";

  useEffect(() => {
    if (!link) return;
    QRCode.toDataURL(link, { width: 460, margin: 2 }).then(setQr).catch(() => setQr(""));
  }, [link]);

  useEffect(() => {
    if (!pay) return;
    const t = setInterval(() => setLeft((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [pay]);

  if (!pay) {
    return (
      <div className="max-w-screen-sm mx-auto px-4 py-24 text-center text-muted">
        This payment link has expired or was already completed.
        <div className="mt-4"><Link to={withStore("/")} className="text-ink underline">Back to shop</Link></div>
      </div>
    );
  }

  const waUrl = payWhatsAppUrl({ ...pay, utr: utr.trim() });
  const m = Math.floor(left / 60), s = String(left % 60).padStart(2, "0");
  const copy = (t, el) => { try { navigator.clipboard.writeText(t); if (el) { el.textContent = "✓ Copied"; setTimeout(() => (el.textContent = "Copy UPI ID"), 1500); } } catch { /* ignore */ } };

  return (
    <div className="max-w-screen-sm mx-auto px-4 py-10 text-center">
      <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center text-white" style={{ background: "var(--store-primary, #1a1512)" }}>
        <Check size={22} />
      </div>
      <h1 className="text-2xl text-ink mb-1">Order {pay.orderNo} placed</h1>
      <p className="text-ink-soft mb-6">Pay now to confirm it. Then send the screenshot on WhatsApp.</p>

      <div className="border border-line bg-paper p-6">
        <div className="text-xs uppercase tracking-[0.12em] text-muted">Amount to pay</div>
        <div className="price text-4xl text-ink mb-3">{inr(pay.total)}</div>

        {left > 0
          ? <div className="text-sm text-rose-700 bg-rose-50 border border-rose-200 px-3 py-2 mb-4">⏳ Pay within <strong>{m}:{s}</strong> to keep your order reserved</div>
          : <div className="text-sm text-ink-soft bg-panel border border-line px-3 py-2 mb-4">Still here to complete — pay and send your screenshot any time.</div>}

        {qr
          ? <img src={qr} alt={`Scan to pay ${inr(pay.total)}`} width={220} height={220} className="mx-auto border border-line rounded-lg p-2 bg-white" />
          : <div className="text-sm text-muted py-8">Preparing QR… use the UPI ID below to pay.</div>}
        <p className="text-xs text-muted mt-2 mb-4">Scan with any UPI app — amount &amp; reference are already filled in</p>

        {/* Opens the phone's UPI app chooser (GPay / PhonePe / Paytm) */}
        <a href={link} className="btn btn-primary w-full mb-3">📲 Pay in your UPI app</a>

        <div className="border border-line rounded-md p-3 mb-4">
          <div className="text-xs uppercase tracking-[0.1em] text-muted mb-1">Or pay to this UPI ID</div>
          <div className="text-lg text-ink" style={{ fontWeight: 700 }}>{pay.upiId}</div>
          <button type="button" onClick={(e) => copy(pay.upiId, e.currentTarget)} className="text-sm underline text-muted hover:text-ink transition-colors mt-1">Copy UPI ID</button>
        </div>

        <label className="block text-left mb-4">
          <span className="block text-xs uppercase tracking-[0.1em] text-muted mb-1.5">UTR / reference number (optional)</span>
          <input value={utr} onChange={(e) => setUtr(e.target.value)} placeholder="12-digit ref from your UPI app"
            className="w-full border border-line-strong bg-paper px-3.5 py-2.5 text-sm text-ink placeholder:text-muted focus:outline-none focus:border-ink transition-colors" />
          <span className="block text-xs text-muted mt-1">Helps us match your payment faster. We'll include it in your WhatsApp message.</span>
        </label>

        <a href={waUrl} target="_blank" rel="noreferrer" className="btn text-white w-full" style={{ background: "#25D366" }}>
          📲 I've paid — send screenshot on WhatsApp
        </a>
      </div>

      <button type="button" onClick={() => { clearPending(config?.slug); window.location.href = withStore("/"); }}
        className="text-sm text-muted hover:text-ink underline transition-colors mt-6">
        Done
      </button>
    </div>
  );
}
