// Featured brands the vendor flagged "on home" in the portal Navigation panel.
// The default (Original) layout has its own richer brand section; the premium
// full-page templates (Redline/Atelier/Haven/Velocity) didn't render brands at
// all, so this shared, theme-neutral rail gives them one. Uses the store CSS
// vars so it inherits each theme's colours. Renders nothing when no brand is
// featured, so it never leaves an empty section.
import React from "react";
import { Link } from "react-router-dom";
import { useStore } from "../../context/StoreContext";
import { withStore } from "../../lib/tenant";

const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "");

export default function FeaturedBrands({ title = "Shop by brand" }) {
  const { config } = useStore();
  const brands = (config?.nav?.brands || []).filter((b) => b && b.brand && b.on_home !== false);
  const subbrands = (config?.nav?.subbrands || []).filter((s) => s && s.sub_brand && s.on_home !== false);
  const items = [...brands, ...subbrands];
  if (!items.length) return null;

  const to = (i) => withStore(i.sub_brand
    ? `/c/${encodeURIComponent(i.category)}?brand=${encodeURIComponent(i.brand)}&sub_brand=${encodeURIComponent(`${i.brand}::${i.sub_brand}`)}`
    : `/c/${encodeURIComponent(i.category)}?brand=${encodeURIComponent(i.brand)}`);

  return (
    <section className="max-w-[1200px] mx-auto px-4 md:px-8 py-12 md:py-16">
      <h2 className="text-center uppercase tracking-[0.14em] font-semibold mb-8"
        style={{ color: "var(--color-ink)", fontSize: "clamp(1.1rem, 3vw, 1.7rem)" }}>{title}</h2>
      <div className="grid gap-4 md:gap-6 justify-center" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(120px, 160px))" }}>
        {items.map((i, k) => {
          const label = i.label || i.sub_brand || i.brand;
          return (
            <Link key={`${i.category}-${i.brand}-${i.sub_brand || ""}-${k}`} to={to(i)} className="group block text-center">
              <div className="overflow-hidden mb-3" style={{ aspectRatio: "1/1", background: "var(--color-panel)", borderRadius: 8 }}>
                {i.thumbnail
                  ? <img src={i.thumbnail} alt={label} loading="lazy" referrerPolicy="no-referrer" className="w-full h-full object-cover transition duration-500 group-hover:scale-105" />
                  : <div className="w-full h-full flex items-center justify-center px-2">
                      <span className="uppercase tracking-wide font-semibold text-sm" style={{ color: "var(--color-ink)" }}>{label}</span>
                    </div>}
              </div>
              <div className="text-[13px]" style={{ color: "var(--color-ink-soft)" }}>{cap(label)}</div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
