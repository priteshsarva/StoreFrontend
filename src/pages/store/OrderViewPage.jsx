// Public read-only order view (/o/:orderNo?t=token). Opened from the "View order"
// link in the buyer's payment WhatsApp so the vendor can verify the order without
// logging in. The signed ?t= token gates it server-side; no customer session.
import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { useStore } from "../../context/StoreContext";
import { inr } from "../../lib/money";
import { withStore } from "../../lib/tenant";

const safeJson = (s) => { try { return JSON.parse(s); } catch { return {}; } };

export default function OrderViewPage() {
  const { orderNo } = useParams();
  const [sp] = useSearchParams();
  const { api } = useStore();
  const [data, setData] = useState(undefined); // undefined = loading, null = not found

  useEffect(() => {
    api.orderView(orderNo, sp.get("t")).then(setData).catch(() => setData(null));
  }, [orderNo]); // eslint-disable-line react-hooks/exhaustive-deps

  if (data === undefined) return <div className="max-w-screen-sm mx-auto px-4 py-24 text-center text-muted">Loading…</div>;
  if (!data) return (
    <div className="max-w-screen-sm mx-auto px-4 py-24 text-center text-muted">
      Order not found or the link has expired.
      <div className="mt-4"><Link to={withStore("/")} className="text-ink underline">Back to shop</Link></div>
    </div>
  );

  const { order, items } = data;
  const a = typeof order.address === "string" ? safeJson(order.address) : (order.address || {});
  const paid = order.payment_status === "verified" || ["processing", "completed"].includes(order.status);
  const payLabel = paid ? "Paid" : order.payment_status === "claimed" ? "Payment pending confirmation" : "Payment pending";

  return (
    <div className="max-w-screen-md mx-auto px-4 lg:px-6 py-10">
      <h1 className="text-3xl text-ink mb-1">Order {order.order_no}</h1>
      <p className="text-sm text-muted mb-6">
        {new Date(order.created_at).toLocaleString()} · <span className="capitalize">{order.status}</span> · {payLabel}
      </p>

      <div className="border border-line bg-paper p-5 mb-6">
        {items.map((it, i) => (
          <div key={i} className="flex gap-3 py-2.5 border-b border-line last:border-0">
            <div className="w-12 h-12 bg-panel shrink-0 overflow-hidden">
              {it.image_url && <img src={it.image_url} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />}
            </div>
            <div className="flex-1 min-w-0">
              {it.page_url
                ? <a href={it.page_url} target="_blank" rel="noreferrer" className="text-sm text-ink underline">{it.product_name}</a>
                : <span className="text-sm text-ink">{it.product_name}</span>}
              <div className="text-xs text-muted mt-0.5">{it.size ? `Size ${it.size} · ` : ""}Qty {it.qty} · {inr(it.unit_price)}</div>
            </div>
            <div className="text-sm num text-ink whitespace-nowrap">{inr(it.line_total)}</div>
          </div>
        ))}
        <div className="flex justify-between pt-3 mt-2 border-t border-line text-ink" style={{ fontWeight: 600 }}>
          <span>Total</span><span className="price">{inr(order.total)}</span>
        </div>
        {Number(order.cod_due) > 0 && (
          <div className="flex justify-between text-xs text-muted mt-1.5">
            <span>{Number(order.online_amount) > 0 ? "Paid online · on delivery" : "Pay on delivery"}</span>
            <span className="num">{Number(order.online_amount) > 0 ? `${inr(order.online_amount)} · ${inr(order.cod_due)}` : inr(order.cod_due)}</span>
          </div>
        )}
      </div>

      <div className="border border-line bg-paper p-5 text-sm">
        <div className="eyebrow !text-ink mb-2">Deliver to</div>
        <div className="text-ink" style={{ fontWeight: 600 }}>{order.buyer_name}</div>
        {order.buyer_phone && <div className="text-muted">{order.buyer_phone}</div>}
        <div className="text-muted mt-1">{[a.line1, a.line2, a.city, a.state, a.pincode].filter(Boolean).join(", ")}</div>
      </div>

      <div className="mt-6"><Link to={withStore("/")} className="text-sm text-muted hover:text-ink underline transition-colors">Back to shop</Link></div>
    </div>
  );
}
