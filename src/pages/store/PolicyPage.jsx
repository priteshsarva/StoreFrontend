import React from "react";
import { useParams } from "react-router-dom";
import { useStore } from "../../context/StoreContext";
import { LEGAL_DEFAULTS, fill } from "./legalDefaults";

const TITLES = { shipping: "Shipping Policy", returns: "Returns Policy", privacy: "Privacy Policy", terms: "Terms of Service" };

export default function PolicyPage() {
  const { kind } = useParams();
  const { config } = useStore();
  // vendor's own text wins; otherwise a real, store-branded default so no
  // storefront ever ships with an empty legal page.
  const vendorText = config?.policies?.[kind];
  const text = (vendorText && String(vendorText).trim()) ? vendorText : fill(LEGAL_DEFAULTS[kind] || "", config);

  return (
    <div className="max-w-[680px] mx-auto px-4 py-16">
      <div className="eyebrow mb-3">Legal</div>
      <h1 className="text-3xl md:text-4xl text-ink mb-8">{TITLES[kind] || "Policy"}</h1>
      {text ? (
        <div className="text-[15px] text-ink-soft whitespace-pre-line leading-[1.8]" style={{ textWrap: "pretty" }}>{text}</div>
      ) : (
        <p className="text-muted">This information isn’t available yet.</p>
      )}
    </div>
  );
}
