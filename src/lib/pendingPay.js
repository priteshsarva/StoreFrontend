// A UPI payment the buyer started but may not have finished. Persisted so a
// refresh — or leaving the tab for the UPI app and coming back — never loses
// the QR / amount / order number. One pending payment per store (slug).
import { resolveSlug } from "./storeApi";

const key = (slug) => `spp_pending_pay:${slug || resolveSlug()}`;
const TTL_MS = 24 * 3600 * 1000; // a day; after that assume it's stale

export function setPending(p) {
  try { localStorage.setItem(key(p.slug), JSON.stringify({ ...p, ts: Date.now() })); } catch { /* private mode */ }
}

export function getPending(slug) {
  try {
    const p = JSON.parse(localStorage.getItem(key(slug)) || "null");
    if (!p || !p.orderNo) return null;
    if (Date.now() - (p.ts || 0) > TTL_MS) { clearPending(slug); return null; }
    return p;
  } catch { return null; }
}

export function clearPending(slug) {
  try { localStorage.removeItem(key(slug)); } catch { /* ignore */ }
}

// Buyer said they've paid (tapped WhatsApp). We keep the record (so the pay page
// still shows the QR if they return) but flag it claimed so the site-wide banner
// stops nagging. The real paid/verified state is set by the vendor/admin.
export function markClaimed(slug) {
  try {
    const p = JSON.parse(localStorage.getItem(key(slug)) || "null");
    if (p) { p.claimed = true; localStorage.setItem(key(slug), JSON.stringify(p)); }
  } catch { /* ignore */ }
}

// Fire the purchase pixel at most once per order (survives refresh/return).
export function markPurchaseTracked(slug, orderNo) {
  try { localStorage.setItem(`spp_purch:${slug || resolveSlug()}:${orderNo}`, "1"); } catch { /* ignore */ }
}
export function isPurchaseTracked(slug, orderNo) {
  try { return localStorage.getItem(`spp_purch:${slug || resolveSlug()}:${orderNo}`) === "1"; } catch { return false; }
}

// upi://pay deep link — opens the phone's UPI app chooser (GPay/PhonePe/Paytm)
// with amount + order reference pre-filled. Same string powers the QR.
export function upiLink({ upiId, upiName, storeName, total, orderNo }) {
  const p = new URLSearchParams({
    pa: upiId, pn: upiName || storeName || "Store",
    am: String(total), cu: "INR", tn: orderNo || "",
  });
  return "upi://pay?" + p.toString();
}

// WhatsApp "I've paid" message — carries the order + amount + (optional) UTR so
// the vendor can match the screenshot and confirm the order.
export function payWhatsAppUrl({ whatsapp, storeName, orderNo, total, utr }) {
  const inr = "₹" + Math.round(Number(total) || 0).toLocaleString("en-IN");
  const lines = [
    `Hi ${storeName || ""}! 👋`, "",
    `I've paid for my order *${orderNo}* — ${inr}.`,
    utr ? `UTR / reference: *${utr}*` : "",
    "Sending my payment screenshot now 📸",
  ].filter(Boolean);
  const phone = String(whatsapp || "").replace(/[^\d]/g, "");
  return `https://wa.me/${phone}?text=${encodeURIComponent(lines.join("\n"))}`;
}
