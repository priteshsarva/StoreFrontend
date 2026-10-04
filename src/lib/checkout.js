// Display-only mirror of the backend's portal/checkoutMath.js. The SERVER is
// authoritative: it recomputes on order creation and hands back the real split
// (total / online_amount / cod_due). This only previews the breakdown in the UI
// before the buyer places the order. Keep the formula identical to the backend.
const round2 = (n) => Math.round((Number(n) || 0) * 100) / 100;

export const METHOD_LABELS = {
  prepaid: "Pay online",
  cod: "Cash on delivery",
  semicod: "Pay part now, rest on delivery",
};

export function enabledMethods(cfg = {}) {
  const on = Array.isArray(cfg.methods) ? cfg.methods : [];
  return on.length ? on : ["prepaid"];
}

export function computeCheckout(subtotal, method, cfg = {}) {
  subtotal = round2(subtotal);
  method = ["prepaid", "cod", "semicod"].includes(method) ? method : "prepaid";
  const codFee = Math.max(0, round2(cfg.cod_fee));
  const prepaidDisc = Math.max(0, round2(cfg.prepaid_discount));

  let cod_fee = 0, prepaid_discount = 0;
  if (method === "prepaid") prepaid_discount = Math.min(prepaidDisc, subtotal);
  else cod_fee = codFee;
  const total = round2(subtotal + cod_fee - prepaid_discount);

  let online_amount, cod_due;
  if (method === "prepaid") { online_amount = total; cod_due = 0; }
  else if (method === "cod") { online_amount = 0; cod_due = total; }
  else {
    const type = cfg.advance_type === "fixed" ? "fixed" : "percent";
    const val = Math.max(0, Number(cfg.advance_value) || 0);
    let adv = type === "fixed" ? val : (total * val) / 100;
    adv = round2(Math.min(Math.max(adv, 0), total));
    online_amount = adv; cod_due = round2(total - adv);
  }
  return { method, subtotal, total, cod_fee, prepaid_discount, online_amount, cod_due };
}
