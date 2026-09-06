// UPI payment screen. Reached after checkout (/pay/:orderNo) and re-openable on
// refresh or return from the UPI app — it restores the pending payment from
// localStorage, so nobody loses the QR / amount / order number mid-payment.
// Manual reconcile: the buyer pays into the vendor's UPI account and sends the
// screenshot on WhatsApp; the vendor confirms the order by hand in the portal.
import React, { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Check } from "lucide-react";
import { useStore } from "../../context/StoreContext";
import { withStore } from "../../lib/tenant";
import { getPending, clearPending } from "../../lib/pendingPay";
import UpiPayCard from "../../components/store/UpiPayCard";

export default function PaymentPage() {
  const { orderNo } = useParams();
  const { config } = useStore();
  const [utr, setUtr] = useState("");

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

  if (!pay) {
    return (
      <div className="max-w-screen-sm mx-auto px-4 py-24 text-center text-muted">
        This payment link has expired or was already completed.
        <div className="mt-4"><Link to={withStore("/")} className="text-ink underline">Back to shop</Link></div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-sm mx-auto px-4 py-10 text-center">
      <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center text-white" style={{ background: "var(--store-primary, #1a1512)" }}>
        <Check size={22} />
      </div>
      <h1 className="text-2xl text-ink mb-1">Order {pay.orderNo} placed</h1>
      <p className="text-ink-soft mb-6">Pay now to confirm it. Then send the screenshot on WhatsApp.</p>

      <UpiPayCard pay={pay} utr={utr} onUtr={setUtr} />

      <button type="button" onClick={() => { clearPending(config?.slug); window.location.href = withStore("/"); }}
        className="text-sm text-muted hover:text-ink underline transition-colors mt-6">
        Done
      </button>
    </div>
  );
}
