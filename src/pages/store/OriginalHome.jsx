// The original Aqua Watch home layout, rebuilt tenant-driven:
//   hero → browse categories → per-category ("Our Best … Collection" carousel
//   + "New Arrivals …" grid + View All). Everything reads the vendor's own
//   config + products; nothing is hardcoded to one store.
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../../context/StoreContext";
import StoreHero from "../../components/store/StoreHero";
import SectionHeading from "../../components/store/SectionHeading";
import WhatsAppPromoBar from "../../components/store/WhatsAppPromoBar";
import ProductRail from "../../components/store/ProductRail";
import ProductCard from "../../components/store/ProductCard";
import ReviewsSlider from "../../components/store/ReviewsSlider";
import { withStore } from "../../lib/tenant";
import { watchBrandImg } from "../../lib/watchBrandImg";

const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "");

export default function OriginalHome() {
  const { config, api } = useStore();
  // Front-page categories: the vendor's curated on_home selection (portal
  // "Navigation & front page" panel), else every category the store sells.
  const navItems = config?.nav?.items;
  const homeItems = Array.isArray(navItems) && navItems.length
    ? navItems.filter((i) => i && i.category && i.on_home !== false)
    : (config?.categories || []).map((c) => ({ category: c, label: cap(c) }));
  const categories = homeItems.map((i) => i.category);
  const labelOf = (c) => homeItems.find((i) => i.category === c)?.label || cap(c);
  // Featured brands the vendor put on the home page (portal "Navigation" panel).
  const navBrands = config?.nav?.brands;
  const brandItems = Array.isArray(navBrands) ? navBrands.filter((b) => b && b.brand && b.on_home !== false) : [];
  const subcatItems = Array.isArray(config?.nav?.subcats) ? config.nav.subcats.filter((s) => s && s.subcat && s.on_home !== false) : [];
  const subbrandItems = Array.isArray(config?.nav?.subbrands) ? config.nav.subbrands.filter((s) => s && s.sub_brand && s.on_home !== false) : [];
  const [byCat, setByCat] = useState(null); // { [category]: product[] }
  const [allProducts, setAllProducts] = useState(null); // mixed rail across every category
  const multiCat = categories.length > 1;

  useEffect(() => {
    if (!categories.length) { setByCat({}); return; }
    // one in-stock fetch per category; feeds both the carousel and the grid
    Promise.all(categories.map((c) => api.products({ category: c, limit: 16 }).catch(() => ({ results: [] }))))
      .then((rs) => setByCat(Object.fromEntries(categories.map((c, i) => [c, rs[i].results]))));
  }, [categories.join("|")]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    // a mixed "All products" rail — only meaningful when the store sells >1 category
    if (!multiCat) { setAllProducts([]); return; }
    api.products({ category: "all", limit: 14 }).then((r) => setAllProducts(r.results || [])).catch(() => setAllProducts([]));
  }, [multiCat]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <StoreHero />
      <WhatsAppPromoBar />

      {/* Browse categories — only when the vendor sells more than one, else it's noise */}
      {categories.length > 1 && (
        <section>
          <SectionHeading eyebrow="Explore">Browse the collection</SectionHeading>
          <div className="container mx-auto px-4 pb-6">
            <div className="stagger grid grid-cols-3 gap-5 md:gap-8 max-w-3xl mx-auto">
              {homeItems.map((it) => (
                // thumbnail fallback chain: vendor-set thumbnail → first product image → empty tile
                <CategoryTile key={it.category} category={it.category} label={it.label || cap(it.category)}
                  thumb={it.thumbnail || byCat?.[it.category]?.[0]?.thumbnail} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Per-category collections */}
      {byCat === null ? (
        <div className="text-center py-20 text-muted">Loading products…</div>
      ) : (
        categories.map((c) => {
          const products = byCat[c] || [];
          if (!products.length) return null;
          return (
            <section key={c}>
              <SectionHeading eyebrow="Curated">Best of {labelOf(c)}</SectionHeading>
              <div className="max-w-screen-xl mx-auto px-4 lg:px-6 pb-10">
                <ProductRail products={products} />
              </div>

              <SectionHeading eyebrow="Just in">New arrivals</SectionHeading>
              <div className="max-w-screen-xl mx-auto px-4 lg:px-6 pb-12">
                <div className="stagger grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-5 gap-y-9">
                  {products.slice(0, 12).map((p) => (
                    <ProductCard key={`${p.dbName}-${p.productId}`} product={p} />
                  ))}
                </div>
                <div className="flex justify-center mt-10">
                  <Link to={withStore(`/c/${encodeURIComponent(c)}`)} className="btn btn-outline">
                    View all {labelOf(c)}
                  </Link>
                </div>
              </div>
            </section>
          );
        })
      )}

      {/* All Products — a mixed rail across every category, with a "shop all" that
          opens the full mixed listing. Only for multi-category stores. */}
      {multiCat && allProducts && allProducts.length > 0 && (
        <section>
          <SectionHeading eyebrow="Everything">All products</SectionHeading>
          <div className="max-w-screen-xl mx-auto px-4 lg:px-6 pb-10">
            <ProductRail products={allProducts} />
            <div className="flex justify-center mt-10">
              <Link to={withStore("/c/all")} className="btn btn-outline">Shop all products</Link>
            </div>
          </div>
        </section>
      )}

      {/* Shop by Sub-category — the vendor's curated, home-flagged sub-categories */}
      {subcatItems.length > 0 && (
        <section>
          <SectionHeading eyebrow="Shop by">Category</SectionHeading>
          <div className="container mx-auto px-4 pb-8">
            <div className="stagger grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-5 md:gap-7 max-w-4xl mx-auto">
              {subcatItems.map((s) => (
                <Link key={`${s.category}-${s.subcat}`} to={withStore(`/c/${encodeURIComponent(s.category)}?cat=${encodeURIComponent(s.subcat)}`)} className="flex flex-col items-center text-center group">
                  <div className="w-full aspect-square overflow-hidden mb-3 bg-panel flex items-center justify-center capitalize text-sm text-ink-soft group-hover:bg-[color-mix(in_srgb,var(--store-primary,#1a1512)_10%,transparent)] transition-colors px-2">{s.label || s.subcat}</div>
                  <h5 className="text-sm text-ink-soft group-hover:text-ink transition-colors capitalize" style={{ fontWeight: 500 }}>{s.label || s.subcat}</h5>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Shop by Brand — the vendor's curated, home-flagged brands + sub-brands */}
      {(brandItems.length > 0 || subbrandItems.length > 0) && (
        <section>
          <SectionHeading eyebrow="Shop by">Brands</SectionHeading>
          <div className="container mx-auto px-4 pb-14">
            <div className="stagger grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-5 md:gap-7 max-w-4xl mx-auto">
              {brandItems.map((b) => <BrandTile key={`${b.category}-${b.brand}`} item={b} />)}
              {subbrandItems.map((s) => <BrandTile key={`${s.category}-${s.brand}-${s.sub_brand}`} item={s} />)}
            </div>
          </div>
        </section>
      )}

      {/* Customer reviews — vendor-added images, auto-sliding */}
      <ReviewsSlider images={config?.reviews} />

      {config?.about && (
        <section className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="eyebrow mb-4">Our story</div>
          <p className="text-ink-soft text-lg leading-relaxed font-light" style={{ textWrap: "pretty" }}>{config.about}</p>
        </section>
      )}
    </>
  );
}

function CategoryTile({ category, label, thumb }) {
  return (
    <Link to={withStore(`/c/${encodeURIComponent(category)}`)} className="flex flex-col items-center text-center group">
      <div className="w-full aspect-square overflow-hidden mb-3.5 bg-panel">
        {thumb
          ? <img src={thumb} alt={label || category} loading="lazy" referrerPolicy="no-referrer" className="object-cover w-full h-full transition duration-700 ease-out group-hover:scale-[1.06]" />
          : null}
      </div>
      <h5 className="text-sm capitalize text-ink-soft group-hover:text-ink transition-colors" style={{ fontWeight: 500 }}>{label || category}</h5>
    </Link>
  );
}

// A featured brand → the category listing pre-filtered to that brand. Thumbnail
// falls back to the brand name on a plain tile when no image is set.
function BrandTile({ item }) {
  const label = item.label || item.sub_brand || item.brand;
  // a sub-brand tile deep-links to the brand + sub-brand filter (Primary::Secondary)
  const to = withStore(item.sub_brand
    ? `/c/${encodeURIComponent(item.category)}?brand=${encodeURIComponent(item.brand)}&sub_brand=${encodeURIComponent(`${item.brand}::${item.sub_brand}`)}`
    : `/c/${encodeURIComponent(item.category)}?brand=${encodeURIComponent(item.brand)}`);
  // vendor thumbnail → bundled watch-brand image (watches only) → text tile
  const img = item.thumbnail || (item.category === "watches" && watchBrandImg(item.brand));
  return (
    <Link to={to} className="flex flex-col items-center text-center group">
      <div className="w-full aspect-square overflow-hidden mb-3.5 bg-panel flex items-center justify-center">
        {img
          ? <img src={img} alt={label} loading="lazy" referrerPolicy="no-referrer" className="object-cover w-full h-full transition duration-700 ease-out group-hover:scale-[1.06]" />
          : <span className="text-ink-soft text-sm font-medium px-2 leading-tight">{label}</span>}
      </div>
      <h5 className="text-sm text-ink-soft group-hover:text-ink transition-colors" style={{ fontWeight: 500 }}>{label}</h5>
    </Link>
  );
}
