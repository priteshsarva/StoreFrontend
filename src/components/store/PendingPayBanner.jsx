// Site-wide "finish your payment" bar — shows whenever the buyer has a pending
// UPI payment saved (they left mid-payment, refreshed, or came back from the
// UPI app). Links straight back to the pay screen. Hidden on the pay screen
// itself. This is what makes an unfinished payment recoverable on refresh.
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useStore } from "../../context/StoreContext";
import { inr } from "../../lib/money";
import { withStore } from "../../lib/tenant";
import { getPending } from "../../lib/pendingPay";

export default function PendingPayBanner() {
  const { config } = useStore();
  const location = useLocation();
  const pending = getPending(config?.slug);
  if (!pending || location.pathname.startsWith("/pay/")) return null;

  return (
    <Link to={withStore(`/pay/${encodeURIComponent(pending.orderNo)}`)}
      style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, flexWrap: "wrap",
        background: "#fff5f5", borderBottom: "1px solid #f7c9c7", color: "#a23a4b",
        padding: "9px 14px", fontSize: 13.5, fontWeight: 600, textDecoration: "none" }}>
      ⏳ Finish paying for order {pending.orderNo} — {inr(pending.total)}
      <span style={{ textDecoration: "underline" }}>Complete payment →</span>
    </Link>
  );
}
