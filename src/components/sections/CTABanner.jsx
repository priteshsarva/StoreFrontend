// Flatsome-style CTA strip — bold single-color panel with title + button.
// Props: title, subtitle, cta_text, cta_link, bg_color (default primary)
import React from "react";
import { Link } from "react-router-dom";
import { withStore } from "../../lib/tenant";

export default function CTABanner({ title, subtitle, cta_text, cta_link, bg_color }) {
  if (!title && !cta_text) return null;
  const style = bg_color ? { background: bg_color } : { background: "var(--store-primary, #1a1512)" };
  return (
    <div className="relative overflow-hidden py-14 md:py-20 px-6 text-center text-white" style={style}>
      {/* soft radial highlight so the flat panel has depth */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(80% 120% at 50% -10%, rgba(255,255,255,0.12), transparent 60%)" }} />
      <div className="relative z-10">
        {title && <h3 className="text-3xl md:text-4xl mb-3 text-white" style={{ textWrap: "balance", fontWeight: 440 }}>{title}</h3>}
        {subtitle && <p className="text-sm md:text-base text-white/85 mb-7 max-w-xl mx-auto leading-relaxed">{subtitle}</p>}
        {cta_text && cta_link && (
          <Link to={withStore(cta_link)} className="btn btn-invert">
            {cta_text}
          </Link>
        )}
      </div>
    </div>
  );
}
