// QR pay popup for an unfinished order. Appears on every page load (until the
// buyer claims payment) so an unpaid order keeps asking to be paid — the order
// isn't confirmed until it is. Close is per-load only (reappears next refresh);
// "I've paid" claims it and stops the nag. Reuses UpiPayCard + getPending.
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { X } from "lucide-react";
import { useStore } from "../../context/StoreContext";
import { withStore } from "../../lib/tenant";
import { getPending, markClaimed } from "../../lib/pendingPay";
import UpiPayCard from "./UpiPayCard";

export default function PendingPayModal() {
  const { config, api } = useStore();
  const location = useLocation();
  const [closed, setClosed] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [utr, setUtr] = useState("");

  const pending = getPending(config?.slug);
  if (!pending || pending.claimed || claimed || closed || location.pathname.startsWith("/pay/")) return null;

  const payCfg = config?.payment || {};
  const pay = {
    orderNo: pending.orderNo, total: pending.total,
    storeName: pending.storeName || config?.store_name || "Store",
    upiId: pending.upiId || payCfg.upi_id, upiName: pending.upiName || payCfg.upi_name || "", whatsapp: pending.whatsapp || payCfg.whatsapp || "",
  };
  if (!pay.upiId) return null; // no UPI to show a QR for

  function onWhatsApp() { setClaimed(true); markClaimed(config?.slug); api.claimPayment(pending.orderNo).catch(() => {}); }

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(10,12,16,0.6)", display: "grid", placeItems: "center", padding: 16, overflowY: "auto" }}>
      <div style={{ position: "relative", width: "min(440px, 100%)" }}>
        <button onClick={() => setClosed(true)} aria-label="Close" style={{ position: "absolute", top: -10, right: -10, zIndex: 2, width: 32, height: 32, borderRadius: 999, border: "none", background: "#0E1726", color: "#fff", cursor: "pointer" }}><X size={16} /></button>
        <div style={{ background: "var(--color-paper,#fff)", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ padding: "14px 16px 0", textAlign: "center" }}>
            <div style={{ fontWeight: 700, fontSize: 16 }}>Complete your payment</div>
            <div style={{ fontSize: 12.5, color: "var(--color-muted,#6b7688)", marginTop: 3 }}>Order {pending.orderNo} isn't confirmed until payment is done.</div>
          </div>
          {Array.isArray(pending.lines) && pending.lines.length > 0 && (
            <div style={{ display: "flex", gap: 8, overflowX: "auto", padding: "12px 16px 0" }}>
              {pending.lines.map((l, i) => (
                <div key={i} style={{ flex: "0 0 auto", width: 56, textAlign: "center" }}>
                  <div style={{ width: 56, height: 56, borderRadius: 8, overflow: "hidden", background: "var(--color-panel,#f4f5f8)", border: "1px solid var(--color-line,#e6e9f0)" }}>
                    {l.image ? <img src={l.image} alt={l.name || ""} referrerPolicy="no-referrer" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : null}
                  </div>
                  <div style={{ fontSize: 10, color: "var(--color-muted,#6b7688)", marginTop: 2 }}>×{l.qty}</div>
                </div>
              ))}
            </div>
          )}
          <UpiPayCard pay={pay} utr={utr} onUtr={setUtr} onWhatsApp={onWhatsApp} />
          <div style={{ textAlign: "center", padding: "0 16px 14px" }}>
            <Link to={withStore(`/pay/${encodeURIComponent(pending.orderNo)}`)} onClick={() => setClosed(true)} style={{ fontSize: 12.5, color: "var(--color-muted,#6b7688)", textDecoration: "underline" }}>Open the full payment page</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
