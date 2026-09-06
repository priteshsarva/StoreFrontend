import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Check } from "lucide-react";
import { useStore } from "../../context/StoreContext";
import { useCart } from "../../context/CartContext";
import { inr } from "../../lib/money";
import { withStore } from "../../lib/tenant";
import { useCustomerAuth } from "../../context/CustomerAuthContext";
import { setPending } from "../../lib/pendingPay";

const INPUT = "w-full border border-line-strong bg-paper px-3.5 py-2.5 text-sm text-ink placeholder:text-muted focus:outline-none focus:border-ink transition-colors";

export default function CheckoutPage() {
  const { api, config } = useStore();
  const { items: cartItems, total: cartTotal, clear } = useCart();
  const { customer, booted, sessionFromCheckout } = useCustomerAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const quickItem = location.state?.quickItem || null;
  const lineItems = quickItem ? [quickItem] : cartItems;
  const total = quickItem ? quickItem.price * quickItem.qty : cartTotal;

  const [addresses, setAddresses] = useState([]);
  const [addressId, setAddressId] = useState("");
  const [form, setForm] = useState({ name: "", phone: "", email: "", line1: "", line2: "", city: "", state: "", pincode: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null); // { order_no, total, wa_url }

  useEffect(() => {
    if (customer) {
      api.me().then((r) => {
        setAddresses(r.addresses || []);
        const def = (r.addresses || []).find((a) => a.is_default) || r.addresses?.[0];
        if (def) setAddressId(def.id);
      }).catch(() => {});
    }
  }, [customer]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { api.track("begin_checkout", { value: total }); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!booted) return null;
  // checked after `result` below: a successful cart checkout clears the cart,
  // which would otherwise make this fire instead of the success screen.
  if (!result && lineItems.length === 0) {
    return (
      <div className="max-w-screen-sm mx-auto px-4 py-24 text-center text-muted">
        Nothing to check out. <Link to={withStore("/")} className="text-ink underline">Go shopping</Link>
      </div>
    );
  }

  function set(k, v) { setForm((f) => ({ ...f, [k]: v })); }

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setError(null);
    try {
      const address = customer && addressId ? undefined : form;
      const note = lineItems.filter((it) => it.size).map((it) => `${it.name}: Size ${it.size}`).join("; ") || undefined;

      const r = await api.createOrder({
        items: lineItems.map((it) => ({ product_id: it.product_id, db_name: it.db_name, qty: it.qty, size: it.size || undefined })),
        ...(address ? { address } : { address_id: addressId }),
        buyer_name: address ? address.name : undefined,
        buyer_phone: address ? address.phone : undefined,
        buyer_email: !customer && form.email ? form.email.trim() : undefined,
        note,
      });
      // Guest checkout: the backend hands back a session for the (new or unclaimed)
      // account — log them straight in so their order history is theirs.
      if (r.token) sessionFromCheckout(r.token, r.customer);
      if (!quickItem) clear();

      // Store has UPI set up → go to the pay screen (QR + deep link + resume).
      // Save the payment so a refresh / return from the UPI app can restore it.
      if (config?.upi_id) {
        setPending({
          slug: config.slug, orderNo: r.order_no, total: r.total,
          storeName: config.store_name, upiId: config.upi_id,
          upiName: config.upi_name, whatsapp: config.whatsapp,
        });
        navigate(withStore(`/pay/${encodeURIComponent(r.order_no)}`));
        return;
      }
      setResult(r); // no UPI configured → WhatsApp-only confirmation (unchanged)
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (result) {
    return (
      <div className="max-w-screen-sm mx-auto px-4 py-20 text-center">
        <div className="w-14 h-14 rounded-full mx-auto mb-5 flex items-center justify-center text-white" style={{ background: "var(--store-primary, #1a1512)" }}>
          <Check size={26} />
        </div>
        <h1 className="text-2xl text-ink mb-2">Order {result.order_no} placed</h1>
        <p className="text-ink-soft mb-8 leading-relaxed">
          Total <span className="num">{inr(result.total)}</span>. Send this order to {config?.store_name} on WhatsApp to confirm it.
        </p>
        {result.token && (
          <p className="text-sm text-ink-soft mb-6">
            You're now signed in — see this order any time under <Link to={withStore("/account")} className="text-ink underline">your account</Link>.
          </p>
        )}
        {result.account_exists && (
          <p className="text-sm text-ink-soft mb-6">
            You already have an account with this email. <Link to={withStore("/account")} className="text-ink underline">Log in</Link> to see this order in your history.
          </p>
        )}
        <a href={result.wa_url} target="_blank" rel="noreferrer" className="btn text-white" style={{ background: "#25D366" }}>
          Complete on WhatsApp
        </a>
        <div className="mt-6">
          <Link to={withStore("/")} className="text-sm text-muted hover:text-ink underline transition-colors">Continue shopping</Link>
        </div>
      </div>
    );
  }

  const usingSavedAddress = customer && addresses.length > 0 && addressId;

  return (
    <div className="max-w-screen-md mx-auto px-4 lg:px-6 py-10">
      <h1 className="text-3xl md:text-4xl text-ink mb-8">Checkout</h1>

      <div className="mb-8 border border-line bg-paper p-5">
        {lineItems.map((it, i) => (
          <div key={i} className="flex justify-between text-sm py-1.5 text-ink-soft">
            <span>{it.name}{it.size ? ` — Size ${it.size}` : ""} × {it.qty}</span>
            <span className="num">{inr(it.price * it.qty)}</span>
          </div>
        ))}
        <div className="flex justify-between pt-3 mt-2 border-t border-line">
          <span className="text-ink" style={{ fontWeight: 600 }}>Total</span>
          <span className="price text-xl text-ink">{inr(total)}</span>
        </div>
      </div>

      <form onSubmit={submit}>
        {customer && addresses.length > 0 && (
          <div className="mb-5">
            <label className="block text-xs uppercase tracking-[0.12em] text-muted mb-2.5">Deliver to</label>
            <div className="flex flex-col gap-2">
              {addresses.map((a) => (
                <label key={a.id} className={`border p-3.5 text-sm cursor-pointer transition-colors ${addressId === a.id ? "border-ink bg-panel" : "border-line hover:border-line-strong"}`}>
                  <input type="radio" name="address" className="mr-2 accent-[var(--store-primary,#1a1512)]" checked={addressId === a.id} onChange={() => setAddressId(a.id)} />
                  <strong className="text-ink">{a.name}</strong> · {a.phone}<br />
                  <span className="text-muted ml-5">{a.line1}, {a.city}, {a.state} - {a.pincode}</span>
                </label>
              ))}
              <button type="button" onClick={() => setAddressId("")} className="text-sm text-left underline text-muted hover:text-ink transition-colors mt-1">
                + Use a different address
              </button>
            </div>
          </div>
        )}

        {!usingSavedAddress && (
          <div className="grid sm:grid-cols-2 gap-4 mb-5">
            <Field label="Full name"><input required className={INPUT} value={form.name} onChange={(e) => set("name", e.target.value)} /></Field>
            <Field label="Phone"><input required type="tel" className={INPUT} value={form.phone} onChange={(e) => set("phone", e.target.value)} /></Field>
            {!customer && (
              <Field label="Email" className="sm:col-span-2">
                <input required type="email" className={INPUT} value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@email.com" />
              </Field>
            )}
            <Field label="Address line" className="sm:col-span-2"><input required className={INPUT} value={form.line1} onChange={(e) => set("line1", e.target.value)} /></Field>
            <Field label="Landmark (optional)" className="sm:col-span-2"><input className={INPUT} value={form.line2} onChange={(e) => set("line2", e.target.value)} /></Field>
            <Field label="City"><input required className={INPUT} value={form.city} onChange={(e) => set("city", e.target.value)} /></Field>
            <Field label="State"><input required className={INPUT} value={form.state} onChange={(e) => set("state", e.target.value)} /></Field>
            <Field label="Pincode"><input required inputMode="numeric" className={INPUT} value={form.pincode} onChange={(e) => set("pincode", e.target.value)} /></Field>
          </div>
        )}

        {!customer && (
          <p className="text-xs text-muted mb-5">
            We'll create an account with your email so you can track this order — no password needed now.
            Already have one? <Link to={withStore("/account")} className="text-ink underline">Log in</Link>.
          </p>
        )}

        {error && <div className="text-sm text-rose-700 bg-rose-50 border border-rose-200 px-3 py-2 mb-5">{error}</div>}

        <button type="submit" disabled={busy} className="btn btn-primary w-full">
          {busy ? "Placing order…" : "Place order"}
        </button>
      </form>
    </div>
  );
}

function Field({ label, children, className = "" }) {
  return (
    <label className={`block ${className}`}>
      <span className="block text-xs uppercase tracking-[0.1em] text-muted mb-1.5">{label}</span>
      {children}
    </label>
  );
}
