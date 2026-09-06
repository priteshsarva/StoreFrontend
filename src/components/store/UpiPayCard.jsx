// Shared UPI pay UI: amount, QR (client-generated), "Pay in your UPI app" deep
// link, copy-VPA, UTR field, and the WhatsApp "I've paid" button. Used both on
// the /pay page and in the checkout popup. Presentational — the caller owns the
// pay object, the UTR state, and any surrounding chrome (passed as children).
import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import { inr } from "../../lib/money";
import { upiLink, payWhatsAppUrl } from "../../lib/pendingPay";

const PAY_MINUTES = 10;

export default function UpiPayCard({ pay, utr, onUtr, showTimer = true, waLabel, onWhatsApp, children }) {
  const [qr, setQr] = useState("");
  const [left, setLeft] = useState(PAY_MINUTES * 60);
  const link = upiLink(pay);
  const waUrl = payWhatsAppUrl({ ...pay, utr: (utr || "").trim() });

  useEffect(() => {
    QRCode.toDataURL(link, { width: 460, margin: 2 }).then(setQr).catch(() => setQr(""));
  }, [link]);

  useEffect(() => {
    if (!showTimer) return;
    const t = setInterval(() => setLeft((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [showTimer]);

  const m = Math.floor(left / 60), s = String(left % 60).padStart(2, "0");
  const copy = (t, el) => { try { navigator.clipboard.writeText(t); if (el) { el.textContent = "✓ Copied"; setTimeout(() => (el.textContent = "Copy UPI ID"), 1500); } } catch { /* ignore */ } };

  return (
    <div className="border border-line bg-paper p-6">
      <div className="text-xs uppercase tracking-[0.12em] text-muted">Amount to pay</div>
      <div className="price text-4xl text-ink mb-3">{inr(pay.total)}</div>

      {showTimer && (left > 0
        ? <div className="text-sm text-rose-700 bg-rose-50 border border-rose-200 px-3 py-2 mb-4">⏳ Pay within <strong>{m}:{s}</strong> to keep your order reserved</div>
        : <div className="text-sm text-ink-soft bg-panel border border-line px-3 py-2 mb-4">Still here to complete — pay and send your screenshot any time.</div>)}

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
        <input value={utr || ""} onChange={(e) => onUtr && onUtr(e.target.value)} placeholder="12-digit ref from your UPI app"
          className="w-full border border-line-strong bg-paper px-3.5 py-2.5 text-sm text-ink placeholder:text-muted focus:outline-none focus:border-ink transition-colors" />
        <span className="block text-xs text-muted mt-1">Helps us match your payment faster. We'll include it in your WhatsApp message.</span>
      </label>

      <a href={waUrl} target="_blank" rel="noreferrer" onClick={onWhatsApp} className="btn text-white w-full" style={{ background: "#25D366" }}>
        {waLabel || "📲 I've paid — send screenshot on WhatsApp"}
      </a>

      {children}
    </div>
  );
}
