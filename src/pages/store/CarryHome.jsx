// "Carry" — a clean modern ecommerce template for bags, travel & everyday carry
// (charcoal + white + a single red accent, sharp corners, dense product grid,
// editorial lifestyle collage). Generic: hero, categories, products, prices and
// links all come from the vendor's own config + products. A sequential allocator
// gives each section a fresh slice, so NO product repeats on the landing page.
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Eye, Star } from "lucide-react";
import { useStore } from "../../context/StoreContext";
import { useWishlist } from "../../context/WishlistContext";
import ReviewsSlider from "../../components/store/ReviewsSlider";
import FeaturedBrands from "../../components/store/FeaturedBrands";
import { withStore, homeCategories } from "../../lib/tenant";
import { inr } from "../../lib/money";
import { useAutoRefresh } from "../../lib/useAutoRefresh";

const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "");
const newTab = { target: "_blank", rel: "noopener noreferrer" };
const keyOf = (p) => `${p.dbName}-${p.productId}`;

// Colour source. "brand" → the vendor's palette (StoreContext already put
// --store-*/--color-* on the root with contrast pairs). "default" → this
// template's own cool neutral palette; pinned literally because :root always
// defines the site's warm defaults, so a var() fallback would never fire.
function paletteVars(brand) {
  return brand ? {
    "--k-paper": "var(--color-paper)", "--k-ink": "var(--color-ink)", "--k-ink-soft": "var(--color-ink-soft)",
    "--k-gray": "var(--color-panel)", "--k-line": "var(--color-line)",
    "--k-red": "var(--store-primary)", "--k-on-red": "var(--store-on-primary, #ffffff)",
  } : {
    "--k-paper": "#ffffff", "--k-ink": "#1F1F1F", "--k-ink-soft": "#5a6069",
    "--k-gray": "#F4F5F6", "--k-line": "#e4e6ea",
    "--k-red": "#D7193F", "--k-on-red": "#ffffff",
  };
}

function SectionHead({ title, sub }) {
  return (
    <div className="text-center mb-7 md:mb-10">
      <h2 className="k-h2">{title}</h2>
      {sub && <div className="k-sub mt-2">{sub}</div>}
    </div>
  );
}

function Tile({ p }) {
  const wl = useWishlist();
  const wished = wl?.has(p.dbName, p.productId);
  const off = p.mrp > p.price;
  return (
    <Link to={withStore(`/p/${p.dbName}/${p.productId}`)} {...newTab} className="group block">
      <div className="relative overflow-hidden" style={{ aspectRatio: "1/1", background: "var(--k-gray)" }}>
        {p.thumbnail
          ? <img src={p.thumbnail} alt={p.productName} loading="lazy" className="w-full h-full object-cover transition duration-500 ease-out group-hover:scale-[1.03]" />
          : <div className="w-full h-full" />}
        {p.savings_pct > 0 && <span className="k-badge">-{p.savings_pct}%</span>}
        {!p.inStock && <span className="k-sold">Sold out</span>}
        <button type="button" aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); wl?.toggle(p); }} className="k-heart">
          <Heart size={14} strokeWidth={1.6} fill={wished ? "var(--k-red)" : "none"} color={wished ? "var(--k-red)" : "var(--k-ink)"} />
        </button>
        <span className="k-eye" aria-hidden="true"><Eye size={14} strokeWidth={1.6} /></span>
      </div>
      <div className="pt-2.5">
        {p.productBrand && <div className="text-[10px] uppercase tracking-[0.12em] truncate" style={{ color: "var(--k-ink-soft)" }}>{p.productBrand}</div>}
        <div className="text-[12.5px] leading-snug line-clamp-2 mt-0.5" style={{ color: "var(--k-ink)" }}>{p.productName}</div>
        <div className="flex items-baseline gap-2 mt-1">
          {off && <span className="text-[11px] line-through num" style={{ color: "var(--k-ink-soft)" }}>{inr(p.mrp)}</span>}
          <span className="text-[13px] font-semibold num" style={{ color: off ? "var(--k-red)" : "var(--k-ink)" }}>{inr(p.price)}</span>
        </div>
      </div>
    </Link>
  );
}

function LookTile({ t, ratio }) {
  return (
    <Link to={withStore(`/c/${encodeURIComponent(t.cat)}`)} className="group relative block overflow-hidden" style={{ aspectRatio: ratio, background: "var(--k-gray)" }}>
      <img src={t.img} alt={t.cat} loading="lazy" className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-[1.04]" />
      <div className="absolute inset-0 transition-colors duration-300 group-hover:bg-black/10" />
      <span className="k-look-label">{cap(t.cat)}</span>
    </Link>
  );
}

export default function CarryHome() {
  const { config, api } = useStore();
  const cats = config?.categories || [];      // fetch products from EVERY category
  const homeCats = homeCategories(config);    // which categories show as tiles ("on home")
  const refresh = useAutoRefresh();

  const theme = config?.theme || {};
  const useBrand = theme.palette_mode !== "default" && !!(theme.primary || theme.secondary || theme.complementary);
  const css = useMemo(() => paletteVars(useBrand), [useBrand]);

  const [groups, setGroups] = useState(null);
  useEffect(() => {
    if (!cats.length) { setGroups([]); return; }
    // Keep ALL products (image or not) so the product grid is never empty — the
    // Tile renders a blank panel when a product has no image, matching the
    // default layout. Only the pure-image tiles (category/campaign) require one.
    Promise.all(cats.slice(0, 6).map((c) =>
      api.products({ category: c, limit: 40 }).then((r) => ({ cat: c, items: r.results || [] })).catch(() => ({ cat: c, items: [] }))
    )).then(setGroups).catch(() => setGroups([]));
  }, [cats.join("|"), refresh]); // eslint-disable-line react-hooks/exhaustive-deps

  const hero = config?.hero || {};
  const storeName = config?.store_name || "";
  const pdp = (p) => withStore(`/p/${p.dbName}/${p.productId}`);

  // One sequential allocator, so every section gets its own products, no repeats.
  const alloc = useMemo(() => {
    const gs = groups || [];
    const used = new Set();
    // interleave the categories so the first grid is not all one category
    const flat = [];
    for (let i = 0; ; i++) { const row = gs.map((g) => g.items[i]).filter(Boolean); if (!row.length) break; flat.push(...row); }
    const catTiles = gs.map((g) => {
      const pick = g.items.find((p) => !used.has(keyOf(p)));
      if (pick) used.add(keyOf(pick));
      return { cat: g.cat, img: pick?.thumbnail };
    }).filter((t) => t.img);
    const take = (n) => { const out = []; for (const p of flat) { if (out.length >= n) break; if (!used.has(keyOf(p))) { used.add(keyOf(p)); out.push(p); } } return out; };
    // takeImg: products that actually have an image — for the hero/campaign shots,
    // where an empty panel would look broken (the grid tiles tolerate no image).
    const takeImg = (n) => { const out = []; for (const p of flat) { if (out.length >= n) break; if (p.thumbnail && !used.has(keyOf(p))) { used.add(keyOf(p)); out.push(p); } } return out; };
    const campaign = takeImg(1)[0];  // the big campaign shot beside bestsellers
    const heroShot = hero.image_url ? null : takeImg(1)[0];
    const collection = take(24);     // first grid + "load more"
    const best = take(4);            // 2x2 bestseller grid
    return { catTiles, heroShot, collection, best, campaign };
  }, [groups, hero.image_url]);

  const { catTiles, heroShot, collection, best, campaign } = alloc;
  const lookbook = catTiles.filter((t) => homeCats.includes(t.cat)).slice(0, 4);

  // Hero slides: the vendor's hero image first, then category shots, so the
  // crossfade still has something to show on a store with no hero uploaded.
  const slides = useMemo(() => {
    const imgs = [hero.image_url, heroShot?.thumbnail, ...catTiles.map((t) => t.img)].filter(Boolean);
    return [...new Set(imgs)].slice(0, 3);
  }, [hero.image_url, heroShot, catTiles]);
  const [slide, setSlide] = useState(0);
  useEffect(() => {
    if (slides.length < 2) return;
    const t = setInterval(() => setSlide((i) => (i + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, [slides.length]);
  const active = slides.length ? slide % slides.length : 0;

  const [shown, setShown] = useState(8);

  return (
    <div className="carry" style={{ ...css, background: "var(--k-paper)", color: "var(--k-ink)" }}>
      {/* ---------------- HERO ---------------- */}
      <section className="relative overflow-hidden k-hero" style={{ background: "var(--k-gray)" }}>
        {slides.map((src, i) => (
          <img key={src} src={src} alt="" className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
            style={{ opacity: i === active ? 1 : 0 }} />
        ))}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to left, rgba(20,20,20,0.55), rgba(20,20,20,0.05) 65%)" }} />
        <div className="absolute inset-0 flex items-center justify-end">
          <div className="text-right text-white px-6 md:px-16 max-w-[560px]">
            <div className="text-[11px] md:text-[13px] uppercase tracking-[0.22em]">{storeName || "New season"}</div>
            <h1 className="k-hero-title mt-2">{hero.title || "Built for the journey"}</h1>
            {hero.subtitle && <p className="text-[13px] md:text-[15px] mt-3 opacity-90">{hero.subtitle}</p>}
            <Link to={withStore(hero.cta_link || `/c/${encodeURIComponent(cats[0] || "all")}`)} className="k-btn-ghost mt-6">
              {hero.cta_text || "Shop now"} →
            </Link>
          </div>
        </div>
        {slides.length > 1 && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {slides.map((s, i) => (
              <button key={s} type="button" aria-label={`Go to slide ${i + 1}`} onClick={() => setSlide(i)}
                className="k-dot" style={{ background: i === active ? "#fff" : "rgba(255,255,255,0.45)" }} />
            ))}
          </div>
        )}
      </section>

      {/* ---------------- THE COLLECTION ---------------- */}
      {collection.length > 0 && (
        <section className="max-w-[1280px] mx-auto px-4 md:px-8 pt-10 md:pt-16">
          <SectionHead title="The Collection" sub="Discover our best products" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
            {collection.slice(0, shown).map((p) => <Tile key={keyOf(p)} p={p} />)}
          </div>
          {shown < collection.length && (
            <div className="text-center mt-8 md:mt-10">
              <button type="button" className="k-btn" onClick={() => setShown((n) => n + 8)}>Load more →</button>
            </div>
          )}
        </section>
      )}

      {/* ---------------- LOOKBOOK COLLAGE ---------------- */}
      {lookbook.length > 0 && (
        <section className="max-w-[1280px] mx-auto px-4 md:px-8 pt-12 md:pt-20">
          <div className="grid gap-3 md:gap-4" style={{ gridTemplateColumns: `repeat(${Math.min(lookbook.length, 3)}, minmax(0,1fr))` }}>
            {lookbook.slice(0, 3).map((t) => <LookTile key={t.cat} t={t} ratio="3/4" />)}
          </div>
          {lookbook[3] && <div className="mt-3 md:mt-4"><LookTile t={lookbook[3]} ratio="21/9" /></div>}
        </section>
      )}

      {/* ---------------- BEST SELLERS + CAMPAIGN ---------------- */}
      {best.length > 0 && (
        <section className="max-w-[1280px] mx-auto px-4 md:px-8 pt-12 md:pt-20">
          <SectionHead title="Best seller products" sub="Best selling products this season" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8 items-start">
            <div className="grid grid-cols-2 gap-3 md:gap-6">
              {best.map((p) => <Tile key={keyOf(p)} p={p} />)}
            </div>
            {campaign && (
              <Link to={pdp(campaign)} {...newTab} className="relative group block overflow-hidden" style={{ aspectRatio: "4/5", background: "var(--k-gray)" }}>
                <img src={campaign.thumbnail} alt={campaign.productName} className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-[1.03]" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(20,20,20,0.6), transparent 55%)" }} />
                <div className="absolute inset-x-0 bottom-0 p-5 md:p-8 text-white">
                  <div className="text-[10px] uppercase tracking-[0.2em] opacity-90">Featured</div>
                  <div className="k-h2 mt-1" style={{ color: "#fff", textTransform: "none" }}>{campaign.productName}</div>
                  <span className="k-btn-ghost mt-4">Shop now →</span>
                </div>
              </Link>
            )}
          </div>
        </section>
      )}

      {/* ---------------- PARTNERS / BRANDS ---------------- */}
      <div className="k-partners"><FeaturedBrands title="Our partners" /></div>

      {/* ---------------- HAPPY CUSTOMERS ---------------- */}
      <section className="mt-12 md:mt-20 py-12 md:py-16 px-4 md:px-8" style={{ background: "var(--k-gray)" }}>
        <SectionHead title="Happy customers" sub="What people are saying about us" />
        {Array.isArray(config?.reviews) && config.reviews.length
          ? <div className="max-w-[1100px] mx-auto"><ReviewsSlider images={config.reviews} /></div>
          : (
            <div className="max-w-[640px] mx-auto text-center">
              <div className="flex justify-center gap-1 mb-4">
                {[0, 1, 2, 3, 4].map((i) => <Star key={i} size={14} fill="#f5b50a" color="#f5b50a" />)}
              </div>
              <p className="text-[14px] md:text-[16px] leading-relaxed" style={{ color: "var(--k-ink)" }}>
                “Well made, roomy, and it has held up to daily use — exactly what I was looking for.”
              </p>
              <div className="mt-5 text-[11px] uppercase tracking-[0.18em]" style={{ color: "var(--k-ink-soft)" }}>{storeName || "A happy customer"}</div>
            </div>
          )}
      </section>

      {!groups && <div className="min-h-[40vh]" />}

      <style>{`
        .carry { overflow-x: clip; font-family: "Inter", "Helvetica Neue", Helvetica, Arial, system-ui, sans-serif; }
        .carry .num { font-variant-numeric: tabular-nums; }
        .carry .k-hero { height: clamp(260px, 52vw, 560px); }
        .carry .k-hero-title { font-size: clamp(2rem, 7vw, 4.25rem); font-weight: 800; line-height: 1.02; letter-spacing: -0.02em; text-transform: uppercase; }
        .carry .k-h2 { font-size: clamp(1.1rem, 3.2vw, 1.9rem); font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; color: var(--k-ink); }
        .carry .k-sub { font-size: 11px; text-transform: uppercase; letter-spacing: 0.16em; color: var(--k-ink-soft); }
        .carry .k-btn, .carry .k-btn-ghost {
          display: inline-block; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em;
          padding: 11px 26px; border-radius: 2px; cursor: pointer; transition: background .2s, color .2s;
        }
        .carry .k-btn { border: 1px solid var(--k-ink); color: var(--k-ink); background: transparent; }
        .carry .k-btn:hover { background: var(--k-ink); color: var(--k-paper); }
        .carry .k-btn-ghost { border: 1px solid #fff; color: #fff; background: transparent; }
        .carry .k-btn-ghost:hover, .carry .group:hover .k-btn-ghost { background: #fff; color: #1F1F1F; }
        .carry .k-dot { width: 7px; height: 7px; border-radius: 999px; border: none; cursor: pointer; padding: 0; }
        .carry .k-badge {
          position: absolute; top: 8px; left: 8px; z-index: 2; background: var(--k-red); color: var(--k-on-red);
          font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 2px;
        }
        .carry .k-sold {
          position: absolute; bottom: 8px; left: 8px; z-index: 2; background: rgba(31,31,31,0.78); color: #fff;
          font-size: 9px; text-transform: uppercase; letter-spacing: 0.1em; padding: 2px 7px;
        }
        .carry .k-heart {
          position: absolute; top: 7px; right: 7px; z-index: 2; width: 26px; height: 26px; border-radius: 999px;
          background: var(--k-paper); border: 1px solid var(--k-line); display: flex; align-items: center; justify-content: center; cursor: pointer;
        }
        .carry .k-eye {
          position: absolute; bottom: 8px; right: 8px; z-index: 2; width: 26px; height: 26px; border-radius: 999px;
          background: var(--k-paper); border: 1px solid var(--k-line); color: var(--k-ink);
          display: flex; align-items: center; justify-content: center;
          opacity: 0; transform: translateY(5px); transition: opacity .2s, transform .2s;
        }
        .carry .group:hover .k-eye { opacity: 1; transform: translateY(0); }
        .carry .k-look-label {
          position: absolute; left: 12px; bottom: 12px; background: var(--k-paper); color: var(--k-ink);
          font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; padding: 6px 12px;
        }
        /* partner/brand logos read as quiet trust signals, not brand art */
        .carry .k-partners img { filter: grayscale(1); opacity: 0.55; transition: filter .25s, opacity .25s; }
        .carry .k-partners a:hover img { filter: grayscale(0); opacity: 1; }
        @media (prefers-reduced-motion: reduce) {
          .carry img, .carry .k-eye, .carry .k-btn, .carry .k-btn-ghost { transition: none !important; }
        }
      `}</style>
    </div>
  );
}
