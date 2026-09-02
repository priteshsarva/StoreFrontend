import React, { useEffect, useState } from "react";
import { useStore } from "../../context/StoreContext";
import { useCustomerAuth } from "../../context/CustomerAuthContext";
import { inr } from "../../lib/money";

const INPUT = "w-full border border-line-strong bg-paper px-3.5 py-2.5 text-sm text-ink placeholder:text-muted focus:outline-none focus:border-ink transition-colors";

export default function AccountPage() {
  const { customer, booted, login, signup } = useCustomerAuth();
  if (!booted) return null;
  return customer ? <AccountDashboard /> : <AuthForm login={login} signup={signup} />;
}

function AuthForm({ login, signup }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setError(null);
    try {
      if (mode === "login") await login(email, password);
      else await signup({ email, password, name, phone });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto px-4 py-20">
      <div className="eyebrow mb-3 text-center">{mode === "login" ? "Welcome back" : "Join us"}</div>
      <h1 className="text-3xl mb-8 text-center text-ink">{mode === "login" ? "Sign in" : "Create account"}</h1>
      {error && <div className="text-sm text-rose-700 bg-rose-50 border border-rose-200 px-3 py-2 mb-4">{error}</div>}
      <form onSubmit={submit} className="flex flex-col gap-3">
        {mode === "signup" && (
          <>
            <input placeholder="Name" className={INPUT} value={name} onChange={(e) => setName(e.target.value)} />
            <input placeholder="Phone" type="tel" className={INPUT} value={phone} onChange={(e) => setPhone(e.target.value)} />
          </>
        )}
        <input required type="email" placeholder="Email" className={INPUT} value={email} onChange={(e) => setEmail(e.target.value)} />
        <input required type="password" placeholder="Password" className={INPUT} value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" disabled={busy} className="btn btn-primary w-full mt-2">
          {busy ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
        </button>
      </form>
      <button onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(null); }} className="mt-5 text-sm text-muted hover:text-ink underline block mx-auto transition-colors">
        {mode === "login" ? "Need an account? Sign up" : "Have an account? Sign in"}
      </button>
    </div>
  );
}

function AccountDashboard() {
  const { customer, logout } = useCustomerAuth();
  const { api, config } = useStore();
  const [addresses, setAddresses] = useState(null);
  const [orders, setOrders] = useState(null);
  const [addingAddress, setAddingAddress] = useState(false);
  const [editingId, setEditingId] = useState(null); // address being edited

  async function removeAddress(id) {
    if (!window.confirm("Delete this address?")) return;
    try { await api.deleteAddress(id); loadAddresses(); } catch (e) { alert(e.message); }
  }

  function loadAddresses() { api.me().then((r) => setAddresses(r.addresses || [])); }
  useEffect(() => {
    loadAddresses();
    api.myOrders().then((r) => setOrders(r.orders || []));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // vendor-branded help link — only when the vendor set a WhatsApp number
  const waHref = config?.whatsapp
    ? `https://api.whatsapp.com/send?phone=${config.whatsapp.replace(/[^\d]/g, "")}&text=${encodeURIComponent(`Hi ${config.store_name || ""}, I need help with my orders.`)}`
    : null;

  return (
    <div className="max-w-screen-md mx-auto px-4 lg:px-6 py-10">
      <div className="flex items-start justify-between mb-8 pb-6 border-b border-line">
        <div>
          <h1 className="text-3xl text-ink">Hi, {customer.name || customer.email}</h1>
          <p className="text-sm text-muted mt-1">{customer.email}</p>
        </div>
        <button onClick={logout} className="text-sm text-muted hover:text-ink underline transition-colors">Sign out</button>
      </div>

      {waHref && (
        <a href={waHref} target="_blank" rel="noreferrer" className="mb-8 inline-flex items-center gap-2 text-sm px-4 py-2.5 text-white" style={{ background: "#25D366" }}>
          Need help? Chat with {config.store_name || "us"} on WhatsApp
        </a>
      )}

      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="eyebrow !text-ink">Addresses</h2>
          <button onClick={() => setAddingAddress(true)} className="link-quiet">+ Add</button>
        </div>
        {!addresses ? (
          <p className="text-sm text-muted">Loading…</p>
        ) : addresses.length === 0 ? (
          <p className="text-sm text-muted">No saved addresses.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {addresses.map((a) => (
              editingId === a.id ? (
                <AddressForm key={a.id} api={api} initial={a}
                  onDone={() => { setEditingId(null); loadAddresses(); }} onClose={() => setEditingId(null)} />
              ) : (
                <div key={a.id} className="border border-line bg-paper p-4 text-sm">
                  <div className="flex justify-between items-start gap-3">
                    <div>
                      <strong className="text-ink">{a.name}</strong> · {a.phone} {a.is_default && <span className="text-xs text-muted">(default)</span>}
                      <div className="text-muted mt-0.5">{a.line1}, {a.city}, {a.state} - {a.pincode}</div>
                    </div>
                    <div className="flex gap-3 shrink-0">
                      <button onClick={() => { setAddingAddress(false); setEditingId(a.id); }} className="text-xs underline text-ink-soft hover:text-ink">Edit</button>
                      <button onClick={() => removeAddress(a.id)} className="text-xs underline text-rose-600 hover:text-rose-700">Delete</button>
                    </div>
                  </div>
                </div>
              )
            ))}
          </div>
        )}
        {addingAddress && <AddressForm api={api} onDone={() => { setAddingAddress(false); loadAddresses(); }} onClose={() => setAddingAddress(false)} />}
      </section>

      <section>
        <h2 className="eyebrow !text-ink mb-4">Order history</h2>
        {!orders ? (
          <p className="text-sm text-muted">Loading…</p>
        ) : orders.length === 0 ? (
          <p className="text-sm text-muted">No orders yet.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {orders.map((o) => (
              <div key={o.id} className="border border-line bg-paper p-4 text-sm flex justify-between items-center">
                <div>
                  <div className="text-ink" style={{ fontWeight: 600 }}>{o.order_no}</div>
                  <div className="text-muted text-xs mt-0.5">{new Date(o.created_at).toLocaleDateString()}</div>
                </div>
                <div className="text-right">
                  <div className="price text-lg text-ink">{inr(o.total)}</div>
                  <div className="text-xs capitalize text-muted">{o.status}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function AddressForm({ api, initial, onDone, onClose }) {
  const editing = !!(initial && initial.id);
  const [form, setForm] = useState({
    name: initial?.name || "", phone: initial?.phone || "", line1: initial?.line1 || "",
    city: initial?.city || "", state: initial?.state || "", pincode: initial?.pincode || "",
    is_default: !!initial?.is_default,
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  function set(k, v) { setForm((f) => ({ ...f, [k]: v })); }

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setError(null);
    try { editing ? await api.updateAddress(initial.id, form) : await api.addAddress(form); onDone(); }
    catch (err) { setError(err.message); setBusy(false); }
  }

  return (
    <form onSubmit={submit} className="mt-3 border border-line bg-panel p-5 flex flex-col gap-2.5">
      {error && <div className="text-sm text-rose-700">{error}</div>}
      <input required placeholder="Full name" className={INPUT} value={form.name} onChange={(e) => set("name", e.target.value)} />
      <input required placeholder="Phone" type="tel" className={INPUT} value={form.phone} onChange={(e) => set("phone", e.target.value)} />
      <input required placeholder="Address line" className={INPUT} value={form.line1} onChange={(e) => set("line1", e.target.value)} />
      <div className="grid grid-cols-3 gap-2">
        <input required placeholder="City" className={INPUT} value={form.city} onChange={(e) => set("city", e.target.value)} />
        <input required placeholder="State" className={INPUT} value={form.state} onChange={(e) => set("state", e.target.value)} />
        <input required placeholder="Pincode" inputMode="numeric" className={INPUT} value={form.pincode} onChange={(e) => set("pincode", e.target.value)} />
      </div>
      <label className="text-sm flex items-center gap-2 text-ink-soft">
        <input type="checkbox" checked={form.is_default} onChange={(e) => set("is_default", e.target.checked)} className="accent-[var(--store-primary,#1a1512)]" /> Set as default
      </label>
      <div className="flex gap-2 mt-1">
        <button type="submit" disabled={busy} className="btn btn-primary" style={{ padding: "0.65rem 1.4rem" }}>
          {busy ? "Saving…" : editing ? "Update address" : "Save address"}
        </button>
        <button type="button" onClick={onClose} className="btn btn-outline" style={{ padding: "0.65rem 1.4rem" }}>Cancel</button>
      </div>
    </form>
  );
}
