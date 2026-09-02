// Default legal-page content, ported from the original Aqua Watch legal pages
// but parameterised on the vendor (store name / email / phone), so every hosted
// store ships with real, complete policies out of the box. A vendor's own text
// in site_settings.policies always wins; these are the fallback.
//
// fill(text, config) substitutes {store} / {email} / {phone}.
export function fill(t, config) {
  return String(t)
    .replaceAll("{store}", config?.store_name || "our store")
    .replaceAll("{email}", config?.email || "our support email")
    .replaceAll("{phone}", config?.phone || "our support line");
}

export const LEGAL_DEFAULTS = {
  shipping: `Thank you for choosing {store}. We are committed to a prompt, reliable shopping experience. Please review our shipping policy below.

Shipping Location
• Within India only. International shipping is not available at this time.

Shipping Methods
• Standard shipping on all orders, typically 5–7 business days for delivery. Delivery times vary by location.

Timeframe
• Orders are processed within 1–2 business days after placement.
• Once shipped, you receive a confirmation with tracking details.

Delivery
• We work with reliable logistics partners for timely, safe delivery. Please ensure someone is available to receive the package.

Order Tracking
• Track your order via the link in your shipping confirmation, or from your account.

Returns & Exchanges
• If your product is damaged, you can return or exchange within 7 days of receipt. See our Returns Policy for details.

Questions? Contact us at {email} or {phone}.`,

  returns: `Refund and Returns Policy for {store}.

Return Eligibility
• Items must be unused, unworn, and in their original condition and packaging.

Return Period
• You may request a return within 7 days of receiving your order.

Exchange
• If you received a damaged or defective product, you can opt for an exchange. Our team will guide you through the process and get a replacement to you as soon as possible.

Refunds
• Approved refunds are issued to the original payment method. Please allow a few business days for the amount to reflect.

For assistance, reach us at {email} or {phone}.`,

  privacy: `At {store}, we are committed to protecting your privacy and handling your personal information safely and responsibly. This policy outlines how we collect, use, and protect your data.

1. Information We Collect
• Personal Information: name, email, phone number, billing and shipping address.
• Order Information: products purchased, order history, preferences.
• Technical Data: IP address, browser type, and how you interact with our website.

2. How We Use Your Information
• To process and deliver your orders.
• To provide customer support.
• With your consent, to send updates about new products and offers.
• To analyse and improve our website and service.

3. Sharing Your Information
We do not sell, trade, or rent your personal information. We may share it with service providers who help us fulfil orders, or where required by law.

4. Cookies
We use cookies to improve your browsing experience and analyse traffic. You can control cookies through your browser settings.

5. Security
We take appropriate measures to protect your data. No method of transmission over the internet is 100% secure, so we cannot guarantee absolute security.

6. Your Rights
You may access, update, or delete your personal information, and opt out of marketing. To exercise these rights, contact us at {email}.

7. Changes
We may update this policy from time to time; changes are posted on this page.

8. Contact
Questions? Email {email} or call {phone}.`,

  terms: `Welcome to {store}. By using our website, you agree to the following terms. Please read them carefully.

1. Acceptance of Terms
By accessing or using our website, you agree to these Terms of Service and our Privacy Policy. If you do not agree, please do not use our website.

2. Eligibility
You must be at least 18 years old (or the age of majority in your jurisdiction) to make purchases.

3. Product Availability and Accuracy
We make every effort to keep inventory, descriptions, images, and pricing accurate, but availability may change without notice and we reserve the right to correct any inaccuracies.

4. Pricing and Payments
Prices are in Indian Rupees (INR). Orders are confirmed over WhatsApp. We reserve the right to cancel any order in case of pricing errors, availability issues, or suspected fraud.

5. Shipping and Delivery
See our Shipping Policy for delivery times and details.

6. Returns and Refunds
See our Returns Policy.

7. Intellectual Property
All content, including logos, images, and text, is the property of {store} or its licensors and may not be reused without written consent.

8. User Conduct
You agree to use our website lawfully and not to engage in fraud, upload malicious content, or interfere with the site's security or functionality.

9. Limitation of Liability
To the fullest extent permitted by law, {store} will not be liable for any indirect or consequential damages arising from your use of our website or products.

10. Governing Law
These terms are governed by the laws of India.

11. Contact
Questions? Email {email} or call {phone}.`,
};

// FAQ ported + genericised (the original template FAQ was placeholder SaaS text;
// this is real commerce FAQ every store can use as-is or override later).
export const FAQ_DEFAULTS = [
  { q: "How do I place an order?", a: "Browse the store, add items to your cart, and check out. Your order is confirmed with us over WhatsApp — we'll reply with the next steps." },
  { q: "What payment methods do you accept?", a: "Orders are arranged over WhatsApp, where we'll share the available payment options for your order." },
  { q: "How long will delivery take?", a: "Orders are processed within 1–2 business days and typically delivered within 5–7 business days across India." },
  { q: "Can I return or exchange an item?", a: "Yes — unused items in original condition can be returned or exchanged within 7 days of receipt. Damaged or defective items are eligible for a replacement." },
  { q: "How do I track my order?", a: "You'll receive tracking details once your order ships, and you can also check your order status from your account." },
  { q: "How do I contact support?", a: "Use the WhatsApp button on the site, or reach us at the email or phone number in the footer." },
];
