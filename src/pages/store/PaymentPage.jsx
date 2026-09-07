// UPI payment screen (/pay/:orderNo). Reached after checkout and re-openable on
// refresh / return from the UPI app — it restores the pending payment from
// localStorage. When the buyer taps "send screenshot on WhatsApp" we CLAIM the
// payment (server marks it 'claimed', we flag it locally) so this page stops
// prompting and the site-wide banner disappears. The real paid/verified status
// is set by the vendor (direct) or admin (platform), never the buyer.
import React, { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Check } from "lucide-react";
import { useStore } from "../../context/StoreContext";
import { withStore } from "../../lib/tenant";
import { getPending, clearPending, markClaimed } from "../../lib/pendingPay";
import UpiPayCard from "../../components/store/UpiPayCard";

export default function PaymentPage() {
  const { orderNo } = useParams();
  const { config, api } = useStore();
  const [utr, setUtr] = useState("");
  const pending = getPending(config?.slug);
  const [claimed, setClaimed] = useState(!!(pending && pending.orderNo === orderNo && pending.claimed));

  const payCfg = config?.payment || {};
  const pay = useMemo(() => {
    const base = pending && pending.orderNo === orderNo ? pending : null;
    const upiId = base?.upiId || payCfg.upi_id;
    if (!upiId) return null;
    return {
      orderNo,
      total: base?.total ?? 0,
      storeName: base?.storeName || config?.store_name || "Store",
      upiId,
      upiName: base?.upiName || payCfg.upi_name || "",
      whatsapp: base?.whatsapp || payCfg.whatsapp || "",
    };
  }, [pending, orderNo, config]); // eslint-disable-line react-hooks/exhaustive-deps

  // Buyer tapped "I've paid — send screenshot on WhatsApp": record the claim
  // (fire-and-forget) so the page/banner stop nagging, then let the WhatsApp
  // link open normally.
  function onClaim() {
    setClaimed(true);
    markClaimed(config?.slug);
    api.claimPayment(orderNo).catch(() => {});
  }

  if (!pay) {
    return (
      <div className="max-w-screen-sm mx-auto px-4 py-24 text-center text-muted">
        This payment link has expired or was already completed.
        <div className="mt-4"><Link to={withStore("/")} className="text-ink underline">Back to shop</Link></div>
      </div>
    );
  }

  if (claimed) {
    return (
      <div className="max-w-screen-sm mx-auto px-4 py-20 text-center">
        <div className="w-14 h-14 rounded-full mx-auto mb-5 flex items-center justify-center text-white" style={{ background: "#25D366" }}>
          <Check size={26} />
        </div>
        <h1 className="text-2xl text-ink mb-2">Thanks — we're confirming your payment</h1>
        <p className="text-ink-soft mb-6 leading-relaxed">
          Order <strong>{pay.orderNo}</strong>. Once we verify it, your order moves to processing. You can track it under
          {" "}<Link to={withStore("/account")} className="text-ink underline">your account</Link>.
        </p>
        <a href="#" onClick={(e) => { e.preventDefault(); setClaimed(false); }} className="text-sm text-muted hover:text-ink underline transition-colors">Haven't paid yet? Show payment details</a>
        <div className="mt-4"><Link to={withStore("/")} className="btn btn-outline">Continue shopping</Link></div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-sm mx-auto px-4 py-10 text-center">
      <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center text-white" style={{ background: "var(--store-primary, #1a1512)" }}>
        <Check size={22} />
      </div>
      <h1 className="text-2xl text-ink mb-1">Order {pay.orderNo} placed</h1>
      <p className="text-ink-soft mb-6">Pay now to confirm it, then tap the WhatsApp button so we can verify it.</p>

      <UpiPayCard pay={pay} utr={utr} onUtr={setUtr} onWhatsApp={onClaim} />

      <button type="button" onClick={() => { clearPending(config?.slug); window.location.href = withStore("/"); }}
        className="text-sm text-muted hover:text-ink underline transition-colors mt-6">
        I'll pay later
      </button>
    </div>
  );
}
