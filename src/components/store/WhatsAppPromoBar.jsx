// Dismissible WhatsApp promo strip — same visual pattern as the legacy
// PromoBar.jsx, but points at the vendor's own WhatsApp number instead of a
// single hardcoded community link.
import React, { useState } from "react";
import { useStore } from "../../context/StoreContext";

export default function WhatsAppPromoBar() {
  const { config } = useStore();
  const [visible, setVisible] = useState(true);
  if (!visible || !config?.whatsapp) return null;

  const phone = config.whatsapp.replace(/[^\d]/g, "");
  const text = encodeURIComponent(`Hi ${config.store_name}, I have a question about your products.`);

  return (
    <div className="flex items-center gap-2 text-white px-4 py-2 text-sm w-full" style={{ background: "linear-gradient(90deg,#25D366,#128C7E)" }}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="#fff" viewBox="0 0 24 24" width="16" height="16" className="shrink-0">
        <path d="M20.52 3.48a11.87 11.87 0 0 0-16.76 0A11.87 11.87 0 0 0 2 12.07c0 2.12.55 4.14 1.6 5.94L2 22l4.12-1.57a11.82 11.82 0 0 0 5.93 1.52h.05c6.55 0 11.87-5.32 11.87-11.87 0-3.17-1.23-6.14-3.45-8.35zM12.1 20.1h-.04a9.97 9.97 0 0 1-5.07-1.37l-.36-.21-2.44.93.87-2.38-.23-.37A9.94 9.94 0 0 1 4.1 12c0-5.47 4.45-9.92 9.92-9.92 2.65 0 5.14 1.04 7.01 2.92a9.89 9.89 0 0 1 2.91 7c0 5.47-4.45 9.92-9.92 9.92z" />
      </svg>
      <a
        href={`https://api.whatsapp.com/send?phone=${phone}&text=${text}`}
        target="_blank"
        rel="noreferrer"
        className="flex-1 truncate font-medium text-white no-underline"
      >
        Chat with {config.store_name} on WhatsApp
      </a>
      <button onClick={() => setVisible(false)} aria-label="Dismiss" className="shrink-0 w-6 h-6 rounded-full bg-white/25 hover:bg-white/40 text-white text-sm font-bold flex items-center justify-center transition-colors">
        ×
      </button>
    </div>
  );
}
