// "Drip" — a premium minimalist sneaker / streetwear template (strict monochrome
// UI: jet-black type, white canvas, a single restrained orange rating star, bold
// condensed Anton headlines, floating product shots). Generic: hero, brands,
// categories, products, prices and links all come from the vendor's own config +
// products. A sequential allocator gives each section a fresh slice, so NO
// product repeats anywhere on the landing page.
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ArrowRight, ArrowLeft, Star, Truck, ShieldCheck, RotateCcw, Headphones } from "lucide-react";
import { useStore } from "../../context/StoreContext";
import { useWishlist } from "../../context/WishlistContext";
import { withStore, homeCategories } from "../../lib/tenant";
import { inr } from "../../lib/money";
import { useAutoRefresh } from "../../lib/useAutoRefresh";

const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "");
const newTab = { target: "_blank", rel: "noopener noreferrer" };
const keyOf = (p) => `${p.dbName}-${p.productId}`;

// Monochrome palette. "brand" → the vendor's own colours (StoreContext put
// --store-*/--color-* on the root). "default" → the reference's strict B/W/grey,
// pinned literally (the site's :root defaults are warm, so a var() fallback
// would never fire).
function paletteVars(brand) {
  return brand ? {
    "--d-ink": "var(--color-ink)", "--d-paper": "var(--color-paper)", "--d-grey": "var(--color-panel)",
    "--d-muted": "var(--color-muted)", "--d-line": "var(--color-line)",
    "--d-accent": "var(--store-primary)", "--d-on-accent": "var(--store-on-primary, #fff)",
  } : {
    "--d-ink": "#080808", "--d-paper": "#ffffff", "--d-grey": "#f5f5f5",
    "--d-muted": "#8a8a8a", "--d-line": "#eeeeee",
    "--d-accent": "#080808", "--d-on-accent": "#ffffff",
  };
}

function SectionHead({ title, centered }) {
  return (
    <div className={centered ? "text-center mb-8 md:mb-12" : "mb-6"}>
      <h2 className="d-h2">{title}</h2>
      {centered && <span className="inline-block w-10 h-[3px] mt-3" style={{ background: "var(--d-ink)" }} />}
    </div>
  );
}

function Card({ p }) {
  const wl = useWishlist();
  const wished = wl?.has(p.dbName, p.productId);
  const off = p.mrp > p.price;
  return (
    <Link to={withStore(`/p/${p.dbName}/${p.productId}`)} {...newTab} className="group block border d-card" style={{ borderColor: "var(--d-line)" }}>
      <div className="relative" style={{ aspectRatio: "1/1", background: "var(--d-paper)" }}>
        {p.thumbnail
          ? <img src={p.thumbnail} alt={p.productName} loading="lazy" className="w-full h-full object-contain p-3 transition duration-500 ease-out group-hover:scale-[1.05]" />
          : <div className="w-full h-full" />}
        {p.savings_pct > 0 && <span className="d-badge">-{p.savings_pct}%</span>}
        {!p.inStock && <span className="d-sold">Sold out</span>}
        <button type="button" aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); wl?.toggle(p); }} className="d-heart">
          <Heart size={14} strokeWidth={1.7} fill={wished ? "var(--d-accent)" : "none"} color={wished ? "var(--d-accent)" : "var(--d-ink)"} />
        </button>
      </div>
      <div className="px-3 pb-3 pt-2.5">
        {p.productBrand && <div className="text-[10px] uppercase tracking-[0.14em] truncate" style={{ color: "var(--d-muted)" }}>{p.productBrand}</div>}
        <div className="d-title text-[12px] uppercase leading-tight line-clamp-2 mt-1" style={{ color: "var(--d-ink)" }}>{p.productName}</div>
        <div className="flex items-baseline gap-2 mt-2">
          {off && <span className="text-[11px] line-through num" style={{ color: "var(--d-muted)" }}>{inr(p.mrp)}</span>}
          <span className="text-[13px] font-bold num" style={{ color: "var(--d-ink)" }}>{inr(p.price)}</span>
        </div>
      </div>
    </Link>
  );
}

// A horizontal, swipeable product rail with prev/next controls.
function Rail({ title, items, pdp }) {
  const ref = useRef(null);
  const scroll = (dir) => { const el = ref.current; if (el) el.scrollBy({ left: dir * Math.round(el.clientWidth * 0.8), behavior: "smooth" }); };
  if (!items.length) return null;
  return (
    <section className="max-w-[1280px] mx-auto px-5 md:px-8 pt-10 md:pt-20">
      <div className="flex items-center justify-between">
        <h2 className="d-h2">{title}</h2>
        <div className="flex gap-2">
          <button type="button" aria-label="Previous" onClick={() => scroll(-1)} className="d-arrow"><ArrowLeft size={15} /></button>
          <button type="button" aria-label="Next" onClick={() => scroll(1)} className="d-arrow"><ArrowRight size={15} /></button>
        </div>
      </div>
      <div ref={ref} className="d-scroll flex gap-5 md:gap-8 overflow-x-auto mt-6 pb-2" style={{ scrollSnapType: "x mandatory" }}>
        {items.map((p) => (
          <Link key={keyOf(p)} to={pdp(p)} {...newTab} className="group shrink-0 w-[44%] sm:w-[31%] md:w-[18.5%]" style={{ scrollSnapAlign: "start" }}>
            <div className="relative overflow-hidden flex items-center justify-center" style={{ aspectRatio: "1/1", background: "var(--d-grey)" }}>
              {p.thumbnail
                ? <img src={p.thumbnail} alt={p.productName} loading="lazy" className="w-full h-full object-contain p-3 transition duration-500 group-hover:scale-[1.05]" />
                : <div className="w-full h-full" />}
            </div>
            {p.rating > 0 && (
              <div className="flex items-center gap-1 mt-2.5 text-[11px] num" style={{ color: "var(--d-ink)" }}>
                {Number(p.rating).toFixed(1)} <Star size={11} fill="#F47A38" color="#F47A38" />
              </div>
            )}
            <div className="d-title text-[11px] uppercase leading-tight line-clamp-1 mt-1.5" style={{ color: "var(--d-ink)" }}>{p.productName}</div>
            <div className="text-[13px] font-bold num mt-1" style={{ color: "var(--d-ink)" }}>{inr(p.price)}</div>
          </Link>
        ))}
      </div>
    </section>
  );
}

const FEATURES = [
  { Icon: Truck, label: "Fast Shipping" },
  { Icon: ShieldCheck, label: "Secure Checkout" },
  { Icon: RotateCcw, label: "Easy Returns" },
  { Icon: Headphones, label: "Support" },
];

export default function DripHome() {
  const { config, api } = useStore();
  const cats = config?.categories || [];
  const homeCats = homeCategories(config);
  const refresh = useAutoRefresh();

  const theme = config?.theme || {};
  const useBrand = theme.palette_mode !== "default" && !!(theme.primary || theme.secondary || theme.complementary);
  const css = useMemo(() => paletteVars(useBrand), [useBrand]);

  const [groups, setGroups] = useState(null);
  useEffect(() => {
    if (!cats.length) { setGroups([]); return; }
    // Keep ALL products (image or not) so grids are never empty; only the
    // image-led tiles (hero shots, category/brand tiles, banner) require an image.
    Promise.all(cats.slice(0, 6).map((c) =>
      api.products({ category: c, limit: 40 }).then((r) => ({ cat: c, items: r.results || [] })).catch(() => ({ cat: c, items: [] }))
    )).then(setGroups).catch(() => setGroups([]));
  }, [cats.join("|"), refresh]); // eslint-disable-line react-hooks/exhaustive-deps

  const hero = config?.hero || {};
  const storeName = config?.store_name || "";
  const shopAll = withStore(hero.cta_link || `/c/${encodeURIComponent(cats[0] || "all")}`);
  const pdp = (p) => withStore(`/p/${p.dbName}/${p.productId}`);

  // Featured brands the vendor flagged (brand + thumbnail).
  const brandItems = (config?.nav?.brands || []).filter((b) => b && b.brand && b.on_home !== false && b.thumbnail);

  const alloc = useMemo(() => {
    const gs = groups || [];
    const used = new Set();
    const flat = [];
    for (let i = 0; ; i++) { const row = gs.map((g) => g.items[i]).filter(Boolean); if (!row.length) break; flat.push(...row); }
    const take = (n) => { const out = []; for (const p of flat) { if (out.length >= n) break; if (!used.has(keyOf(p))) { used.add(keyOf(p)); out.push(p); } } return out; };
    const takeImg = (n) => { const out = []; for (const p of flat) { if (out.length >= n) break; if (p.thumbnail && !used.has(keyOf(p))) { used.add(keyOf(p)); out.push(p); } } return out; };
    // category tiles (image-led) for the "Shop by category" grid
    const catTiles = gs.map((g) => {
      const pick = g.items.find((p) => p.thumbnail && !used.has(keyOf(p)));
      if (pick) used.add(keyOf(pick));
      return { cat: g.cat, img: pick?.thumbnail };
    }).filter((t) => t.img);
    const heroShots = hero.image_url ? takeImg(1) : takeImg(2);
    const best = take(10);
    const banner = takeImg(1)[0];     // the big campaign shot
    const arrivals = take(8);         // "New Arrivals" rail
    const products = take(15);        // main grid
    return { catTiles, heroShots, best, banner, arrivals, products };
  }, [groups, hero.image_url]);

  const { catTiles, heroShots, best, banner, arrivals, products } = alloc;
  const brandStrip = brandItems.slice(0, 8).map((b) => ({ label: b.label || b.brand, img: b.thumbnail, to: withStore(`/c/${encodeURIComponent(b.category)}?brand=${encodeURIComponent(b.brand)}`) }));
  const categoryTiles = (homeCats.length ? catTiles.filter((t) => homeCats.includes(t.cat)) : catTiles).slice(0, 6);
  const heroImg = hero.image_url || heroShots[0]?.thumbnail;
  const heroFloat = hero.image_url ? heroShots[0] : heroShots[1];
  const featuredBrands = brandItems.length
    ? brandItems.slice(0, 4).map((b) => b.label || b.brand)
    : homeCats.slice(0, 4).map(cap);
  const aboutText = config?.about || "We hand-pick every pair — authentic sneakers and streetwear built for the culture. Fresh drops, honest prices, and fast, reliable delivery so you can cop with confidence.";

  return (
    <div className="drip" style={{ ...css, background: "var(--d-paper)", color: "var(--d-ink)" }}>
      {/* ---------------- HERO ---------------- */}
      <section className="max-w-[1280px] mx-auto px-5 md:px-8 pt-8 md:pt-16 pb-6 md:pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-center">
          <div className="text-center md:text-left order-2 md:order-1">
            <span className="d-badge-pill"><span className="d-dot" />{hero.eyebrow || "NEW ARRIVALS 2026"}</span>
            <h1 className="d-display mt-4">{hero.title || "Premium sneakers for modern streetwear"}</h1>
            <div className="d-divider" />
            <p className="text-[13px] md:text-[14px] mx-auto md:mx-0 max-w-[40ch]" style={{ color: "var(--d-muted)" }}>
              {hero.subtitle || "Premium pairs. Unmatched drip. Built for the culture."}
            </p>
            <Link to={shopAll} className="d-btn mt-6">{hero.cta_text || "Shop collection"} <ArrowRight size={14} /></Link>
            {featuredBrands.length > 0 && (
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-2 mt-7">
                {featuredBrands.map((b, i) => (
                  <React.Fragment key={b + i}>
                    {i > 0 && <span className="d-brand-sep" />}
                    <span className="text-[12px] uppercase tracking-[0.12em] italic" style={{ color: "var(--d-muted)" }}>{b}</span>
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
          <div className="relative order-1 md:order-2 min-h-[220px] md:min-h-[360px] flex items-center justify-center">
            <div className="d-blob" />
            {heroImg && <img src={heroImg} alt="" className="relative z-10 w-[82%] max-w-[480px] object-contain d-float-a" />}
            {heroFloat?.thumbnail && heroFloat.thumbnail !== heroImg && (
              <img src={heroFloat.thumbnail} alt="" className="absolute z-20 w-[42%] max-w-[230px] object-contain d-float-b" />
            )}
          </div>
        </div>
      </section>

      {/* ---------------- TRUST STRIP ---------------- */}
      <section className="border-y" style={{ borderColor: "var(--d-line)", background: "var(--d-grey)" }}>
        <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-5 grid grid-cols-2 md:grid-cols-4 gap-4">
          {FEATURES.map(({ Icon, label }) => (
            <div key={label} className="flex items-center justify-center gap-2.5">
              <Icon size={18} strokeWidth={1.6} style={{ color: "var(--d-ink)" }} />
              <span className="text-[11px] md:text-[12px] uppercase tracking-[0.1em] font-semibold" style={{ color: "var(--d-ink)" }}>{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- SHOP BY CATEGORY ---------------- */}
      {categoryTiles.length > 0 && (
        <section className="max-w-[1280px] mx-auto px-5 md:px-8 pt-10 md:pt-20">
          <SectionHead title="Shop by Category" centered />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
            {categoryTiles.map((t) => (
              <Link key={t.cat} to={withStore(`/c/${encodeURIComponent(t.cat)}`)} className="group relative block overflow-hidden" style={{ aspectRatio: "16/10", background: "var(--d-grey)" }}>
                <img src={t.img} alt={t.cat} loading="lazy" className="absolute inset-0 w-full h-full object-cover transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(8,8,8,0.6), transparent 55%)" }} />
                <div className="absolute left-4 bottom-3 d-title text-white text-[15px] md:text-[18px] uppercase">{cap(t.cat)}</div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ---------------- SHOP BY BRAND ---------------- */}
      {brandStrip.length > 0 && (
        <section className="max-w-[1280px] mx-auto px-5 md:px-8 pt-10 md:pt-20">
          <SectionHead title="Shop by Brand" centered />
          <div className="d-scroll flex gap-6 md:gap-10 overflow-x-auto mt-2 pb-2">
            {brandStrip.map((b) => (
              <Link key={b.label} to={b.to} className="group shrink-0 w-[42%] sm:w-[30%] md:w-[22%] text-center">
                <div className="overflow-hidden flex items-center justify-center" style={{ aspectRatio: "4/3" }}>
                  <img src={b.img} alt={b.label} loading="lazy" className="max-h-full max-w-full object-contain transition duration-500 group-hover:scale-105" />
                </div>
                <div className="d-title text-[14px] md:text-[16px] uppercase mt-3">{b.label}</div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ---------------- BEST SELLERS ---------------- */}
      <Rail title="Best Sellers" items={best} pdp={pdp} />

      {/* ---------------- CAMPAIGN BANNER ---------------- */}
      {banner && (
        <section className="max-w-[1280px] mx-auto px-5 md:px-8 pt-10 md:pt-20">
          <Link to={pdp(banner)} {...newTab} className="relative block overflow-hidden group" style={{ aspectRatio: "21/9", background: "var(--d-grey)" }}>
            <img src={banner.thumbnail} alt={banner.productName} className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-[1.03]" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(8,8,8,0.72), rgba(8,8,8,0.15) 70%)" }} />
            <div className="absolute inset-0 flex items-center">
              <div className="px-7 md:px-14 max-w-[560px] text-white">
                <div className="text-[11px] uppercase tracking-[0.2em] opacity-90">Featured drop</div>
                <h3 className="d-display mt-2" style={{ color: "#fff", fontSize: "clamp(1.6rem, 4vw, 2.6rem)" }}>{banner.productName}</h3>
                <span className="d-btn mt-5" style={{ background: "#fff", color: "#080808" }}>Shop now <ArrowRight size={14} /></span>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* ---------------- NEW ARRIVALS ---------------- */}
      <Rail title="New Arrivals" items={arrivals} pdp={pdp} />

      {/* ---------------- PRODUCTS ---------------- */}
      {products.length > 0 && (
        <section className="max-w-[1280px] mx-auto px-5 md:px-8 pt-10 md:pt-20">
          <SectionHead title="Products" centered />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-5">
            {products.map((p) => <Card key={keyOf(p)} p={p} />)}
          </div>
          <div className="text-center mt-8 md:mt-10">
            <Link to={shopAll} className="d-btn-outline">View all products <ArrowRight size={14} /></Link>
          </div>
        </section>
      )}

      {/* ---------------- ABOUT / WELCOME ---------------- */}
      <section className="mt-12 md:mt-24 py-14 md:py-20 px-5" style={{ background: "var(--d-ink)", color: "var(--d-paper)" }}>
        <div className="max-w-[760px] mx-auto text-center">
          <div className="text-[11px] uppercase tracking-[0.22em] mb-4" style={{ color: "var(--d-muted)" }}>Welcome to {storeName || "the shop"}</div>
          <h2 className="d-display" style={{ color: "var(--d-paper)", fontSize: "clamp(1.7rem, 4.4vw, 2.8rem)" }}>Built for the culture</h2>
          <p className="text-[14px] md:text-[15px] leading-relaxed mt-5" style={{ color: "color-mix(in srgb, var(--d-paper) 72%, transparent)" }}>{aboutText}</p>
          <Link to={shopAll} className="d-btn mt-7" style={{ background: "var(--d-paper)", color: "var(--d-ink)" }}>Shop the collection <ArrowRight size={14} /></Link>
        </div>
      </section>

      {!groups && <div className="min-h-[40vh]" />}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&display=swap');
        .drip { overflow-x: clip; font-family: "Inter", "Helvetica Neue", Arial, system-ui, sans-serif; }
        .drip .num { font-variant-numeric: tabular-nums; }
        .drip .d-display, .drip .d-h2, .drip .d-title { font-family: "Anton", "Oswald", "Bebas Neue", Impact, sans-serif; font-weight: 400; }
        .drip .d-display { font-size: clamp(2rem, 5.2vw, 3.1rem); line-height: 0.98; text-transform: uppercase; letter-spacing: 0.005em; }
        .drip .d-h2 { font-size: clamp(1.5rem, 3.4vw, 1.9rem); text-transform: uppercase; letter-spacing: 0.01em; }
        .drip .d-title { letter-spacing: 0.02em; }
        .drip .d-divider { width: 46px; height: 2px; background: var(--d-ink); margin: 18px auto; }
        @media (min-width: 768px) { .drip .d-divider { margin: 18px 0; } }
        .drip .d-badge-pill {
          display: inline-flex; align-items: center; gap: 7px; font-size: 10.5px; font-weight: 600; text-transform: uppercase;
          letter-spacing: 0.12em; padding: 6px 13px; border-radius: 999px; background: var(--d-grey); color: var(--d-ink);
        }
        .drip .d-dot { width: 6px; height: 6px; border-radius: 999px; background: var(--d-accent); }
        .drip .d-btn, .drip .d-btn-outline {
          display: inline-flex; align-items: center; gap: 8px; font-size: 11px; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.1em; padding: 12px 22px; border-radius: 4px; transition: opacity .2s, transform .2s, background .2s, color .2s;
        }
        .drip .d-btn { background: var(--d-ink); color: var(--d-paper); }
        .drip .d-btn:hover { opacity: 0.86; transform: translateY(-1px); }
        .drip .d-btn-outline { background: transparent; color: var(--d-ink); border: 1px solid var(--d-ink); }
        .drip .d-btn-outline:hover { background: var(--d-ink); color: var(--d-paper); }
        .drip .d-brand-sep { width: 1px; height: 12px; background: var(--d-line); }
        .drip .d-blob { position: absolute; width: min(92%, 440px); aspect-ratio: 1/1; border-radius: 999px; background: var(--d-grey); right: 2%; bottom: -6%; z-index: 0; }
        .drip .d-float-a { filter: drop-shadow(0 18px 24px rgba(0,0,0,0.14)); transform: rotate(-6deg); transition: transform .4s ease; }
        .drip .d-float-b { left: 2%; bottom: 4%; filter: drop-shadow(0 12px 18px rgba(0,0,0,0.16)); transform: rotate(10deg); transition: transform .4s ease; }
        .drip .d-float-a:hover { transform: rotate(-6deg) translateY(-6px) scale(1.02); }
        .drip .d-scroll { scrollbar-width: none; scroll-behavior: smooth; }
        .drip .d-scroll::-webkit-scrollbar { display: none; }
        .drip .d-arrow {
          width: 34px; height: 34px; border-radius: 999px; border: 1px solid var(--d-line); background: var(--d-paper);
          display: flex; align-items: center; justify-content: center; color: var(--d-ink); cursor: pointer; transition: background .2s, color .2s;
        }
        .drip .d-arrow:hover { background: var(--d-ink); color: var(--d-paper); }
        .drip .d-card { border-radius: 6px; overflow: hidden; transition: border-color .2s; }
        .drip .d-card:hover { border-color: var(--d-muted); }
        .drip .d-badge { position: absolute; top: 8px; left: 8px; z-index: 2; background: var(--d-accent); color: var(--d-on-accent); font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 3px; }
        .drip .d-sold { position: absolute; bottom: 8px; left: 8px; z-index: 2; background: rgba(8,8,8,0.78); color: #fff; font-size: 9px; text-transform: uppercase; letter-spacing: 0.1em; padding: 2px 7px; }
        .drip .d-heart { position: absolute; top: 7px; right: 7px; z-index: 2; width: 26px; height: 26px; border-radius: 999px; background: var(--d-paper); border: 1px solid var(--d-line); display: flex; align-items: center; justify-content: center; cursor: pointer; }
        @media (prefers-reduced-motion: reduce) {
          .drip img, .drip .d-btn, .drip .d-btn-outline, .drip .d-arrow, .drip .d-float-a, .drip .d-float-b, .drip .d-scroll { transition: none !important; scroll-behavior: auto !important; }
        }
      `}</style>
    </div>
  );
}
