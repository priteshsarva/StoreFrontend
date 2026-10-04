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

// WhatsApp "I've paid" message — carries the order + amount + (optional) UTR,
// the ordered items (with product links), the buyer's name / phone / address,
// and a link to the full order, so the vendor can verify at a glance.
export function payWhatsAppUrl({ whatsapp, storeName, orderNo, total, utr, name, phone: buyerPhone, address, codDue, items, orderUrl }) {
  const money = (n) => "₹" + Math.round(Number(n) || 0).toLocaleString("en-IN");
  const a = address || {};
  const addrLine = [a.line1, a.line2, a.city, a.state, a.pincode].filter(Boolean).join(", ");
  const L = [
    `Hi ${storeName || ""}! 👋`,
    `I've paid for my order *${orderNo}* — ${money(total)}.`,
  ];
  if (Number(codDue) > 0) L.push(`(${money(codDue)} to pay on delivery)`);
  if (utr) L.push(`UTR / reference: *${utr}*`);
  if (Array.isArray(items) && items.length) {
    L.push("", "🛍️ *Items*");
    items.forEach((it, i) => {
      L.push(`${i + 1}. ${it.name} ×${it.qty || 1} — ${money((it.price || 0) * (it.qty || 1))}`);
      if (it.url) L.push(`   🔗 ${it.url}`);
    });
  }
  if (name || buyerPhone || addrLine) {
    L.push("", "📦 *Deliver to*");
    if (name) L.push(`👤 ${name}`);
    if (buyerPhone) L.push(`📞 ${buyerPhone}`);
    if (addrLine) L.push(addrLine);
  }
  if (orderUrl) L.push("", `🧾 View order: ${orderUrl}`);
  L.push("", "Sending my payment screenshot now 📸");
  const phone = String(whatsapp || "").replace(/[^\d]/g, "");
  return `https://wa.me/${phone}?text=${encodeURIComponent(L.join("\n"))}`;
}
