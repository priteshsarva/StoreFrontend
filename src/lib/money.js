// One place for storefront price rendering. INR, whole rupees (these stores
// never price in paise), grouped Indian-style: ₹1,20,000.
export const inr = (n) => "₹" + Math.round(Number(n) || 0).toLocaleString("en-IN");
