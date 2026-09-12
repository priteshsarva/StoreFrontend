// Pixel-friendly ecommerce dataLayer. StoreContext already injects GA4 (gtag +
// window.dataLayer) and Meta Pixel (fbq) when the vendor sets IDs; this pushes
// standard ecommerce events into all three. First-party api.track() beacons stay
// as-is (dual-track). Everything is guarded so analytics never breaks the store.
const CURRENCY = "INR";
const META = { view_item: "ViewContent", add_to_cart: "AddToCart", begin_checkout: "InitiateCheckout", purchase: "Purchase" };

// Accepts a product object OR a cart line; reads either field shape.
export function toItem(p, qty = 1) {
  return {
    item_id: (p.dbName || p.db_name || "") + ":" + (p.productId || p.product_id || ""),
    item_name: p.productName || p.name || "",
    item_brand: p.productBrand || p.brand || undefined,
    item_category: p.catName || p.category || undefined,
    price: Number(p.price) || 0,
    quantity: Number(qty) || 1,
  };
}

export function ecom(event, { items = [], value, transaction_id } = {}) {
  try {
    if (typeof window === "undefined") return;
    const val = value != null ? Number(value) : items.reduce((s, it) => s + (Number(it.price) || 0) * (Number(it.quantity) || 1), 0);
    const ec = { currency: CURRENCY, value: val, items };
    if (transaction_id) ec.transaction_id = transaction_id;
    // GA4/GTM ecommerce shape — reset ecommerce before each push (GTM best practice).
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ ecommerce: null });
    window.dataLayer.push({ event, ecommerce: ec });
    // GA4 direct (that's what StoreContext injects today).
    if (window.gtag) window.gtag("event", event, ec);
    // Meta Pixel standard events.
    if (window.fbq && META[event]) {
      window.fbq("track", META[event], {
        currency: CURRENCY, value: val, content_type: "product",
        content_ids: items.map((it) => it.item_id),
        contents: items.map((it) => ({ id: it.item_id, quantity: it.quantity, item_price: it.price })),
        ...(transaction_id ? { order_id: transaction_id } : {}),
      });
    }
  } catch { /* analytics never breaks the store */ }
}
