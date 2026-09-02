// Flatsome [ux_product_categories] equivalent — grid of category tiles with
// thumbnails auto-sourced from each category's first product.
// Zero-config: uses config.categories with 1 API call per category.
// Props:
//   categories (optional string[]) — override which to show
//   thumbnail_from (default 'first_product') — 'first_product' (fetch) | 'placeholder'
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../../context/StoreContext";
import { withStore } from "../../lib/tenant";

const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "");

export default function CategoriesSection({ categories, thumbnail_from = "first_product" }) {
  const { api, config } = useStore();
  // Honor the vendor's nav curation (label + thumbnail + order) when set; else
  // fall back to the store's categories. config.categories is already ordered
  // by the vendor's nav, so tiles follow the vendor's priority automatically.
  const navItems = config?.nav?.items;
  const items = categories && categories.length
    ? categories.map((c) => ({ category: c, label: cap(c), thumbnail: "" }))
    : (Array.isArray(navItems) && navItems.length
        ? navItems.filter((i) => i && i.category).map((i) => ({ category: i.category, label: i.label || cap(i.category), thumbnail: i.thumbnail || "" }))
        : (config?.categories || []).map((c) => ({ category: c, label: cap(c), thumbnail: "" })));
  const cats = items.map((i) => i.category);
  const [thumbs, setThumbs] = useState({});

  useEffect(() => {
    if (thumbnail_from !== "first_product" || !cats.length) return;
    Promise.all(cats.map((c) => api.products({ category: c, limit: 1 }).catch(() => ({ results: [] }))))
      .then((rs) => setThumbs(Object.fromEntries(cats.map((c, i) => [c, rs[i].results[0]?.thumbnail]))));
  }, [cats.join("|")]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!items.length) return null;
  const cols = items.length === 1 ? "grid-cols-1" : items.length === 2 ? "grid-cols-2" : items.length === 3 ? "grid-cols-3" : "grid-cols-2 md:grid-cols-4";

  return (
    <div className={`grid ${cols} gap-6 max-w-4xl mx-auto`}>
      {items.map((it) => {
        // thumbnail fallback: vendor-set → first product image → placeholder
        const src = it.thumbnail || thumbs[it.category];
        return (
          <Link key={it.category} to={withStore(`/c/${encodeURIComponent(it.category)}`)} className="group text-center reveal">
            <div className="aspect-square overflow-hidden mb-4 bg-panel">
              {src
                ? <img src={src} alt={it.label} className="w-full h-full object-cover transition duration-700 ease-out group-hover:scale-[1.06]" />
                : <div className="w-full h-full flex items-center justify-center text-muted text-xs">—</div>}
            </div>
            <h3 className="capitalize text-[15px] text-ink-soft group-hover:text-ink transition-colors" style={{ fontWeight: 500 }}>{it.label}</h3>
          </Link>
        );
      })}
    </div>
  );
}
