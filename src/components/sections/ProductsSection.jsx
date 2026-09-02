// Flatsome [ux_products] equivalent — fetches products from the store API and
// renders them as either a rail (carousel) or a grid. Zero-config: works with
// no props (defaults to first category, 8 items, carousel).
// Props:
//   category (optional string) — restrict to one category
//   limit (default 8), style ('rail' | 'grid', default 'rail'),
//   view_all (bool, default true) — show "View all →" link
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useStore } from "../../context/StoreContext";
import { withStore } from "../../lib/tenant";
import ProductRail from "../store/ProductRail";
import ProductCard from "../store/ProductCard";

export default function ProductsSection({ category, limit = 8, style = "rail", view_all = true }) {
  const { api, config } = useStore();
  const [products, setProducts] = useState(null);
  const [resolvedCat, setResolvedCat] = useState(null); // the category the shown products actually came from

  // Category resolution:
  //   - explicit `category` prop → use exactly that.
  //   - otherwise → try every category the store sells, in config order, and
  //     show the FIRST one that returns products. So an empty or broken lead
  //     category (missing/corrupt data, out-of-stock only) never leaves the
  //     rail blank while another category has stock.
  const cats = category ? [category] : (config?.categories || []);

  useEffect(() => {
    let alive = true;
    if (!cats.length) { setProducts([]); setResolvedCat(null); return; }
    Promise.all(cats.map((c) =>
      api.products({ category: c, limit }).then((r) => r.results || []).catch(() => [])
    )).then((lists) => {
      if (!alive) return;
      const i = lists.findIndex((l) => l.length); // first category that has products
      if (i === -1) { setProducts([]); setResolvedCat(null); }
      else { setProducts(lists[i]); setResolvedCat(cats[i]); }
    });
    return () => { alive = false; };
  }, [cats.join("|"), limit]); // eslint-disable-line react-hooks/exhaustive-deps

  if (products === null) return <div className="text-center text-muted py-8 text-sm">Loading…</div>;
  if (!products.length) return null;

  return (
    <>
      {view_all && resolvedCat && (
        <div className="flex justify-end mb-5">
          <Link to={withStore(`/c/${encodeURIComponent(resolvedCat)}`)} className="link-quiet">
            View all <ArrowRight size={15} />
          </Link>
        </div>
      )}
      {style === "grid" ? (
        <div className="stagger grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-5 gap-y-9">
          {products.map((p) => <ProductCard key={`${p.dbName}-${p.productId}`} product={p} />)}
        </div>
      ) : (
        <ProductRail products={products} />
      )}
    </>
  );
}
