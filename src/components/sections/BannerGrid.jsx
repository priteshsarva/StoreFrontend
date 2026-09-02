// Flatsome [ux_banner_grid] equivalent — 2 or 3 promo tiles side by side.
// Props:
//   tiles: [{ image, title, subtitle, cta_text, cta_link, overlay }]
//   spacing ('collapse' | 'small' | 'normal', default 'small')
//
// A tile with no image is the common case (a vendor sets copy but no art). Those
// get an on-brand woven gradient built from the store accent + ink, so the grid
// never renders the flat gray boxes it used to — every tile has depth and its
// heading stays legible.
import React from "react";
import { Link } from "react-router-dom";
import { withStore } from "../../lib/tenant";

const GAPS = { collapse: "gap-0", small: "gap-3", normal: "gap-5" };

const brandFill = (i) => ({
  background: `
    radial-gradient(90% 120% at ${i % 2 ? "80%" : "20%"} 0%, color-mix(in srgb, var(--store-primary, #1a1512) 70%, #6b5b4a) 0%, transparent 60%),
    radial-gradient(120% 120% at 50% 120%, rgba(0,0,0,0.55), transparent 70%),
    var(--store-primary, #1a1512)`,
});

export default function BannerGrid({ tiles = [], spacing = "small" }) {
  const valid = tiles.filter((t) => t && (t.image || t.title));
  if (!valid.length) return null;
  const cols = valid.length >= 3 ? "md:grid-cols-3" : "md:grid-cols-2";

  return (
    <div className={`grid grid-cols-1 ${cols} ${GAPS[spacing] || GAPS.small}`}>
      {valid.map((t, i) => {
        const Wrap = t.cta_link ? Link : "div";
        const wrapProps = t.cta_link ? { to: withStore(t.cta_link) } : {};
        return (
          <Wrap
            key={i}
            {...wrapProps}
            className="reveal group relative overflow-hidden block"
            style={{ aspectRatio: "4/3", ...(t.image ? {} : brandFill(i)) }}
          >
            {t.image && (
              <>
                <img
                  src={t.image}
                  alt={t.title || ""}
                  className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0" style={{ background: `linear-gradient(to top, rgba(0,0,0,${(t.overlay ?? 25) / 100 + 0.15}), rgba(0,0,0,0.05))` }} />
              </>
            )}
            {/* hairline inset frame for the editorial-tile feel */}
            <div className="absolute inset-3 border border-white/20 pointer-events-none transition-colors duration-300 group-hover:border-white/40" />

            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white p-6">
              {t.subtitle && <div className="text-[11px] uppercase tracking-[0.24em] mb-3 text-white/80">{t.subtitle}</div>}
              {t.title && <h3 className="text-2xl md:text-3xl mb-4 text-white" style={{ textWrap: "balance", fontWeight: 440 }}>{t.title}</h3>}
              {t.cta_text && (
                <span className="inline-flex items-center gap-2 px-5 py-2 border border-white/70 text-[11px] uppercase tracking-[0.14em] transition-colors duration-300 group-hover:bg-white group-hover:text-ink">
                  {t.cta_text}
                </span>
              )}
            </div>
          </Wrap>
        );
      })}
    </div>
  );
}
