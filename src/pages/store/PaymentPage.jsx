// UPI payment screen (/pay/:orderNo). Works three ways:
//   - right after checkout (amount from the saved pending payment),
//   - returning later via the "Finish paying" banner (pending in localStorage),
//   - from the account page / another device (fetched from the server).
// "Pay later" keeps the saved payment so the banner + this page still work.
// Tapping "send screenshot on WhatsApp" CLAIMS it (server marks 'claimed'); the
// real paid/verified status is set by the vendor/admin.
import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Check } from "lucide-react";
import { useStore } from "../../context/StoreContext";
import { withStore } from "../../lib/tenant";
import { getPending, clearPending, markClaimed } from "../../lib/pendingPay";
import { inr } from "../../lib/money";
import UpiPayCard from "../../components/store/UpiPayCard";

export default function PaymentPage() {
  const { orderNo } = useParams();
  const { config, api } = useStore();
  const [utr, setUtr] = useState("");
  const pending = getPending(config?.slug);
  const [srv, setSrv] = useState(null);          // server order (total + payment_status)
  const [claimed, setClaimed] = useState(!!(pending && pending.orderNo === orderNo && pending.claimed));

  // Pull the order from the server when the buyer is logged in — gives us the
  // real amount + payment status even with no saved pending payment.
  useEffect(() => {
    api.myOrder(orderNo).then((r) => setSrv(r.order || null)).catch(() => setSrv(null));
  }, [orderNo]); // eslint-disable-line react-hooks/exhaustive-deps

  const payCfg = config?.payment || {};
  const base = pending && pending.orderNo === orderNo ? pending : null;
  const total = base?.total ?? (srv ? Number(srv.total) : 0);
  const pay = useMemo(() => {
    const upiId = base?.upiId || payCfg.upi_id;
    if (!upiId) return null;
    return {
      orderNo, total,
      storeName: base?.storeName || config?.store_name || "Store",
      upiId, upiName: base?.upiName || payCfg.upi_name || "", whatsapp: base?.whatsapp || payCfg.whatsapp || "",
    };
  }, [base, total, orderNo, config]); // eslint-disable-line react-hooks/exhaustive-deps

  const serverPaid = srv && (srv.payment_status === "verified");
  const serverClaimed = srv && srv.payment_status === "claimed";

  function onClaim() {
    setClaimed(true);
    markClaimed(config?.slug);
    api.claimPayment(orderNo).catch(() => {});
  }

  if (!pay && !srv) {
    return (
      <div className="max-w-screen-sm mx-auto px-4 py-24 text-center text-muted">
        This payment link has expired or was already completed.
        <div className="mt-4"><Link to={withStore("/")} className="text-ink underline">Back to shop</Link></div>
      </div>
    );
  }

  // Already verified by the store/admin → show a paid confirmation.
  if (serverPaid) {
    return (
      <div className="max-w-screen-sm mx-auto px-4 py-20 text-center">
        <div className="w-14 h-14 rounded-full mx-auto mb-5 flex items-center justify-center text-white" style={{ background: "#25D366" }}><Check size={26} /></div>
        <h1 className="text-2xl text-ink mb-2">Payment confirmed</h1>
        <p className="text-ink-soft mb-6">Order <strong>{orderNo}</strong> is paid and being processed. Track it in <Link to={withStore("/account")} className="text-ink underline">your account</Link>.</p>
        <Link to={withStore("/")} className="btn btn-outline">Continue shopping</Link>
      </div>
    );
  }

  // Buyer already told us they paid (claimed) — awaiting verification.
  if (claimed || serverClaimed) {
    return (
      <div className="max-w-screen-sm mx-auto px-4 py-20 text-center">
        <div className="w-14 h-14 rounded-full mx-auto mb-5 flex items-center justify-center text-white" style={{ background: "#25D366" }}><Check size={26} /></div>
        <h1 className="text-2xl text-ink mb-2">Thanks — we're confirming your payment</h1>
        <p className="text-ink-soft mb-6 leading-relaxed">Order <strong>{orderNo}</strong>. Once we verify it, your order moves to processing. Track it in <Link to={withStore("/account")} className="text-ink underline">your account</Link>.</p>
        <a href="#" onClick={(e) => { e.preventDefault(); setClaimed(false); setSrv((s) => s && { ...s, payment_status: "unpaid" }); }} className="text-sm text-muted hover:text-ink underline transition-colors">Haven't paid yet? Show payment details</a>
        <div className="mt-4"><Link to={withStore("/")} className="btn btn-outline">Continue shopping</Link></div>
      </div>
    );
  }

  if (!pay) return <div className="max-w-screen-sm mx-auto px-4 py-24 text-center text-muted">Loading…</div>;

  return (
    <div className="max-w-screen-sm mx-auto px-4 py-10 text-center">
      <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center text-white" style={{ background: "var(--store-primary, #1a1512)" }}>
        <Check size={22} />
      </div>
      <h1 className="text-2xl text-ink mb-1">Order {orderNo} placed</h1>
      <p className="text-ink-soft mb-6">Pay now to confirm it, then tap the WhatsApp button so we can verify it.</p>

      <UpiPayCard pay={pay} utr={utr} onUtr={setUtr} onWhatsApp={onClaim} />

      {/* Pay later: keep the saved payment so the "Finish paying" banner and this
          page bring the QR back — do NOT clear it. */}
      <div className="mt-6 flex flex-col items-center gap-2">
        <Link to={withStore("/")} className="text-sm text-ink underline">I'll pay later</Link>
        <button type="button" onClick={() => { clearPending(config?.slug); window.location.href = withStore("/"); }}
          className="text-xs text-muted hover:text-ink underline transition-colors">Cancel this payment</button>
      </div>
    </div>
  );
}
