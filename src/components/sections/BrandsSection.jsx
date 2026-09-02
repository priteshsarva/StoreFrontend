// Preset equivalent of the home "Shop by Brand" rail. Renders the vendor's
// curated brands (config.nav.brands) as tiles linking to that brand's filtered
// category listing. Thumbnail falls back to the brand name on a plain tile.
// Renders nothing when the vendor hasn't featured any brands — safe in a preset.
import React from "react";
import { Link } from "react-router-dom";
import { useStore } from "../../context/StoreContext";
import { withStore } from "../../lib/tenant";

export default function BrandsSection({ brands }) {
  const { config } = useStore();
  const src = brands && brands.length ? brands : (config?.nav?.brands || []);
  const items = src.filter((b) => b && b.brand && b.on_home !== false);
  if (!items.length) return null;

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-6 max-w-4xl mx-auto">
      {items.map((b) => {
        const label = b.label || b.brand;
        const to = withStore(`/c/${encodeURIComponent(b.category)}?brand=${encodeURIComponent(b.brand)}`);
        return (
          <Link key={`${b.category}-${b.brand}`} to={to} className="group text-center reveal">
            <div className="aspect-square overflow-hidden mb-4 bg-panel flex items-center justify-center">
              {b.thumbnail
                ? <img src={b.thumbnail} alt={label} className="w-full h-full object-cover transition duration-700 ease-out group-hover:scale-[1.06]" />
                : <span className="text-muted text-sm font-medium px-2 leading-tight">{label}</span>}
            </div>
            <h3 className="text-[15px] text-ink-soft group-hover:text-ink transition-colors" style={{ fontWeight: 500 }}>{label}</h3>
          </Link>
        );
      })}
    </div>
  );
}
