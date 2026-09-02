// FAQ page — accordion of common questions. Uses the vendor's own FAQ from
// site_settings.faq (array of {q,a}) when set, otherwise the sensible defaults.
import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useStore } from "../../context/StoreContext";
import { FAQ_DEFAULTS } from "./legalDefaults";

export default function FaqPage() {
  const { config } = useStore();
  const items = Array.isArray(config?.faq) && config.faq.length ? config.faq : FAQ_DEFAULTS;
  const [open, setOpen] = useState(0);

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="eyebrow mb-3 text-center">Help</div>
      <h1 className="text-3xl md:text-5xl text-ink mb-10 text-center">Frequently asked questions</h1>
      <div className="divide-y divide-line border-y border-line">
        {items.map((it, i) => (
          <div key={i}>
            <button
              onClick={() => setOpen(open === i ? -1 : i)}
              className="w-full flex items-center justify-between text-left gap-4 py-5 group"
              aria-expanded={open === i}
            >
              <span className="text-ink text-[15px] group-hover:text-ink" style={{ fontWeight: 500 }}>{it.q}</span>
              <ChevronDown size={18} className={`shrink-0 text-muted transition-transform duration-300 ${open === i ? "rotate-180" : ""}`} />
            </button>
            {open === i && <p className="pb-5 -mt-1 text-[15px] text-ink-soft leading-relaxed" style={{ textWrap: "pretty" }}>{it.a}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
