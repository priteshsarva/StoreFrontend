// "Redline" — an aggressive automotive-performance storefront template (red /
// black / white, technical, motorsport). Fully tenant-driven: hero, categories,
// products, prices and links come from the vendor's own config + products, so it
// works for any store. A single dedup allocator hands each section a fresh slice
// of products, so NO product repeats anywhere on the landing page.
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Wrench, Truck, ShieldCheck, Car } from "lucide-react";
import { useStore } from "../../context/StoreContext";
import ReviewsSlider from "../../components/store/ReviewsSlider";
import { withStore, homeCategories } from "../../lib/tenant";
import { inr } from "../../lib/money";
import { useAutoRefresh } from "../../lib/useAutoRefresh";

const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "");
const newTab = { target: "_blank", rel: "noopener noreferrer" };
const keyOf = (p) => `${p.dbName}-${p.productId}`;

function Tile({ p }) {
  return (
    <Link to={withStore(`/p/${p.dbName}/${p.productId}`)} {...newTab} className="group block">
      <div className="relative overflow-hidden bg-[var(--color-panel)] border border-[var(--color-line)]" style={{ aspectRatio: "4/5" }}>
        {p.thumbnail
          ? <img src={p.thumbnail} alt={p.productName} loading="lazy" className="w-full h-full object-cover transition duration-500 ease-out group-hover:scale-[1.05]" />
          : <div className="w-full h-full" />}
        {p.savings_pct > 0 && (
          <span className="absolute top-2 left-2 text-[10px] font-bold tracking-wide px-2 py-0.5 text-white" style={{ background: "var(--store-primary)" }}>-{p.savings_pct}%</span>
        )}
        {!p.inStock && <span className="absolute top-2 right-2 bg-[var(--store-secondary)]/75 text-white text-[9px] uppercase tracking-[0.1em] px-2 py-0.5">Sold out</span>}
      </div>
      <div className="pt-2.5">
        {p.productBrand && <div className="text-[10px] uppercase tracking-[0.14em] text-[var(--color-muted)] truncate">{p.productBrand}</div>}
        <div className="text-[12.5px] text-[var(--color-ink)] leading-snug line-clamp-1 mt-0.5 font-medium">{p.productName}</div>
        <div className="flex items-baseline gap-2 mt-1">
          {p.mrp > p.price && <span className="text-[11px] text-[var(--color-muted)] line-through num">{inr(p.mrp)}</span>}
          <span className="text-[13.5px] font-bold num" style={{ color: p.mrp > p.price ? "var(--store-primary)" : "var(--color-ink)" }}>{inr(p.price)}</span>
        </div>
      </div>
    </Link>
  );
}

const BENEFITS = [
  { Icon: Wrench, label: "Easy Installation" },
  { Icon: Truck, label: "Fast Shipping" },
  { Icon: Car, label: "Vehicle Compatibility" },
  { Icon: ShieldCheck, label: "Secure Payment" },
];

export default function RedlineHome() {
  const { config, api } = useStore();
  const cats = homeCategories(config);
  const refresh = useAutoRefresh();

  const [groups, setGroups] = useState(null); // [{ cat, items }]
  useEffect(() => {
    if (!cats.length) { setGroups([]); return; }
    Promise.all(cats.slice(0, 6).map((c) =>
      api.products({ category: c, limit: 14 }).then((r) => ({ cat: c, items: (r.results || []).filter((p) => p.thumbnail) })).catch(() => ({ cat: c, items: [] }))
    )).then(setGroups).catch(() => setGroups([]));
  }, [cats.join("|"), refresh]); // eslint-disable-line react-hooks/exhaustive-deps

  const hero = config?.hero || {};
  const storeName = config?.store_name || "";
  const shopAll = withStore("/c/all");
  const pdp = (p) => withStore(`/p/${p.dbName}/${p.productId}`);

  // ---- dedup allocator: every section pulls fresh, never-seen products ----
  const alloc = useMemo(() => {
    const gs = groups || [];
    const used = new Set();
    const flat = gs.flatMap((g) => g.items);
    // one representative image per category first (marks them used)
    const catTiles = gs.map((g) => {
      const pick = g.items.find((p) => !used.has(keyOf(p)));
      if (pick) used.add(keyOf(pick));
      return { cat: g.cat, img: pick?.thumbnail, product: pick };
    }).filter((t) => t.img);
    const take = (n) => {
      const out = [];
      for (const p of flat) { if (out.length >= n) break; if (!used.has(keyOf(p))) { used.add(keyOf(p)); out.push(p); } }
      return out;
    };
    const heroProduct = hero.image_url ? null : take(1)[0];
    const flash = take(5);
    const popular = take(10);
    const interior = take(6);
    const bannerA = take(1)[0];
    const bannerB = take(1)[0];
    return { catTiles, heroProduct, flash, popular, interior, bannerA, bannerB };
  }, [groups, hero.image_url]);

  const { catTiles, heroProduct, flash, popular, interior, bannerA, bannerB } = alloc;
  const heroImg = hero.image_url || heroProduct?.thumbnail || bannerA?.thumbnail;
  const featured = catTiles.slice(0, 3);
  const topCats = catTiles.slice(0, 6);

  const railRef = useRef(null);
  const slide = (dir) => { const el = railRef.current; if (el) el.scrollBy({ left: dir * Math.round(el.clientWidth * 0.85), behavior: "smooth" }); };

  return (
    <div className="redline bg-[var(--store-bg)] text-[var(--color-ink)]">
      {/* ---------------- HERO ---------------- */}
      <section className="relative w-full overflow-hidden bg-[var(--store-secondary)]" style={{ minHeight: "82vh" }}>
        {heroImg && <img src={heroImg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-90" />}
        <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(8,8,8,0.85), rgba(8,8,8,0.35) 55%, rgba(8,8,8,0.15))" }} />
        <div className="relative z-10 flex flex-col justify-center min-h-[82vh] px-6 md:px-14 max-w-[1440px] mx-auto">
          <div className="r-eyebrow text-[var(--store-primary)]">Built for the bold</div>
          <h1 className="r-display text-white text-[42px] md:text-[80px] leading-[0.92] max-w-[16ch] mt-3">{hero.title || storeName || "Custom Wide Body"}</h1>
          <p className="text-[var(--color-muted)] mt-4 max-w-[46ch] text-sm md:text-base">{hero.subtitle || "Designed to dominate. Standout pieces for people who want more."}</p>
          <div className="mt-8 flex items-center gap-4 flex-wrap">
            {heroProduct
              ? <Link to={pdp(heroProduct)} {...newTab} className="r-btn">Buy this now</Link>
              : <Link to={shopAll} className="r-btn">Shop now</Link>}
            <Link to={shopAll} className="r-btn-ghost">View collection</Link>
          </div>
        </div>
      </section>

      {/* ---------------- CATEGORY STRIP ---------------- */}
      {cats.length > 0 && (
        <section className="border-b border-[var(--color-line)] bg-[var(--store-bg)]">
          <div className="max-w-[1440px] mx-auto px-4 md:px-10 flex gap-2 overflow-x-auto r-scroll py-4">
            {cats.map((c) => (
              <Link key={c} to={withStore(`/c/${encodeURIComponent(c)}`)}
                className="flex-none uppercase text-[11px] tracking-[0.12em] font-semibold px-4 py-2 border border-[var(--color-line)] hover:border-[var(--color-ink)] hover:bg-[var(--store-secondary)] hover:text-white transition-colors">
                {cap(c)}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ---------------- FEATURED CATEGORY TILES ---------------- */}
      {featured.length > 0 && (
        <section className={`grid gap-[2px] bg-[var(--store-bg)] ${featured.length === 1 ? "grid-cols-1" : "grid-cols-1 md:grid-cols-3"}`}>
          {featured.map((t) => (
            <Link key={t.cat} to={withStore(`/c/${encodeURIComponent(t.cat)}`)} className="group relative block overflow-hidden bg-[var(--store-secondary)]" style={{ aspectRatio: "1/1" }}>
              <img src={t.img} alt={t.cat} className="absolute inset-0 w-full h-full object-cover opacity-80 transition duration-500 group-hover:scale-105 group-hover:opacity-95" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(8,8,8,0.8), transparent 55%)" }} />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <div className="r-display text-white text-2xl md:text-3xl uppercase">{cap(t.cat)}</div>
                <span className="inline-block mt-3 text-[11px] uppercase tracking-[0.14em] text-white border border-white/70 px-4 py-1.5">Shop now</span>
              </div>
            </Link>
          ))}
        </section>
      )}

      {/* ---------------- FLASH SALE ---------------- */}
      {flash.length > 0 && (
        <section className="max-w-[1440px] mx-auto px-6 md:px-14 pt-[50px] md:pt-[70px]">
          <div className="text-center mb-8">
            <h2 className="r-display text-[26px] md:text-[38px] uppercase" style={{ color: "var(--store-primary)" }}>Flash Sale</h2>
            <div className="text-[12px] uppercase tracking-[0.18em] text-[var(--color-muted)] mt-1">Save big on this season's picks</div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-x-3 gap-y-8 md:gap-x-5">
            {flash.map((p) => <Tile key={keyOf(p)} p={p} />)}
          </div>
        </section>
      )}

      {/* ---------------- TOP CATEGORIES ---------------- */}
      {topCats.length > 0 && (
        <section className="max-w-[1440px] mx-auto px-6 md:px-14 pt-[50px] md:pt-[80px]">
          <h2 className="r-display text-[22px] md:text-[32px] uppercase text-center mb-8">Top Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {topCats.map((t) => (
              <Link key={t.cat} to={withStore(`/c/${encodeURIComponent(t.cat)}`)} className="group relative block overflow-hidden bg-[var(--store-secondary)]" style={{ aspectRatio: "16/10" }}>
                <img src={t.img} alt={t.cat} className="absolute inset-0 w-full h-full object-cover opacity-80 transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(8,8,8,0.35)" }}>
                  <span className="r-display text-white text-lg md:text-2xl uppercase">{cap(t.cat)}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ---------------- BENEFITS STRIP ---------------- */}
      <section className="mt-[50px] md:mt-[70px] bg-[var(--color-panel)] border-y border-[var(--color-line)]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-14 py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {BENEFITS.map(({ Icon, label }) => (
            <div key={label} className="flex items-center gap-3">
              <Icon size={22} className="shrink-0" style={{ color: "var(--color-ink)" }} strokeWidth={1.6} />
              <span className="text-[12px] md:text-[13px] uppercase tracking-[0.08em] font-semibold">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- MOST POPULAR ---------------- */}
      {popular.length > 0 && (
        <section className="max-w-[1440px] mx-auto px-6 md:px-14 pt-[50px] md:pt-[80px]">
          <div className="text-center mb-8">
            <h2 className="r-display text-[22px] md:text-[32px] uppercase">Most Popular</h2>
            <div className="text-[12px] uppercase tracking-[0.16em] text-[var(--color-muted)] mt-1">Shop our best sellers</div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-x-3 gap-y-8 md:gap-x-5">
            {popular.map((p) => <Tile key={keyOf(p)} p={p} />)}
          </div>
        </section>
      )}

      {/* ---------------- RED PERFORMANCE BANNER ---------------- */}
      {bannerA && (
        <section className="relative w-full mt-[50px] md:mt-[80px] overflow-hidden" style={{ height: "56vh", minHeight: 320, background: "var(--store-primary)" }}>
          <img src={bannerA.thumbnail} alt="" className="absolute inset-0 w-full h-full object-cover opacity-45" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(240,68,46,0.92), rgba(8,8,8,0.4))" }} />
          <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-14 max-w-[1440px] mx-auto">
            <h2 className="r-display text-white text-[30px] md:text-[56px] uppercase leading-[0.95] max-w-[14ch]">Built to stand out.</h2>
            <div className="mt-6 flex items-center gap-4 flex-wrap">
              <Link to={pdp(bannerA)} {...newTab} className="r-btn-dark">Buy this now</Link>
              <Link to={shopAll} className="r-btn-ghost-light">Shop now</Link>
            </div>
          </div>
        </section>
      )}

      {/* ---------------- INTERIOR / FEATURE + RAIL ---------------- */}
      {interior.length > 0 && (
        <section className="max-w-[1440px] mx-auto px-6 md:px-14 pt-[50px] md:pt-[80px]">
          <div className="flex items-end justify-between mb-8">
            <h2 className="r-display text-[22px] md:text-[32px] uppercase">Featured</h2>
            <div className="flex items-center gap-3">
              <button onClick={() => slide(-1)} aria-label="Previous" className="w-9 h-9 border border-[var(--color-line)] flex items-center justify-center hover:bg-[var(--store-secondary)] hover:text-white transition-colors">‹</button>
              <button onClick={() => slide(1)} aria-label="Next" className="w-9 h-9 border border-[var(--color-line)] flex items-center justify-center hover:bg-[var(--store-secondary)] hover:text-white transition-colors">›</button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-[minmax(0,300px)_1fr] gap-6">
            {bannerB && (
              <Link to={pdp(bannerB)} {...newTab} className="group relative block overflow-hidden bg-[var(--store-secondary)]" style={{ aspectRatio: "3/4" }}>
                <img src={bannerB.thumbnail} alt="" className="absolute inset-0 w-full h-full object-cover opacity-90 transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-x-0 bottom-0 p-5" style={{ background: "linear-gradient(to top, rgba(8,8,8,0.85), transparent)" }}>
                  <div className="r-display text-white text-xl uppercase">Shop now</div>
                  <span className="inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.12em] text-white mt-2">Explore <ArrowRight size={13} /></span>
                </div>
              </Link>
            )}
            <div ref={railRef} className="flex gap-4 overflow-x-auto r-scroll pb-2">
              {interior.map((p) => (
                <div key={keyOf(p)} className="flex-none w-[60vw] sm:w-[38vw] md:w-[230px]"><Tile p={p} /></div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------------- REVIEWS ---------------- */}
      <section className="mt-[50px] md:mt-[80px] py-[50px] md:py-[70px] bg-[var(--color-panel)] border-t border-[var(--color-line)]">
        <h2 className="r-display text-[22px] md:text-[32px] uppercase text-center mb-8">Top Reviews</h2>
        {Array.isArray(config?.reviews) && config.reviews.length
          ? <div className="max-w-[1100px] mx-auto px-4"><ReviewsSlider images={config.reviews} /></div>
          : (
            <div className="max-w-[760px] mx-auto text-center px-6">
              <div className="tracking-[0.3em]" style={{ color: "var(--store-primary)" }}>★★★★★</div>
              <p className="text-[18px] md:text-[22px] leading-relaxed mt-4">“Perfect fit and finish. The upgrade looks incredible — quality is obvious. Highly recommend.”</p>
              <div className="mt-5 text-[13px] uppercase tracking-[0.16em] font-semibold">{storeName || "A happy customer"}</div>
            </div>
          )}
      </section>

      {!groups && <div className="min-h-[40vh]" />}

      <style>{`
        .redline { font-family: "Helvetica Neue", Helvetica, Arial, "Inter", system-ui, sans-serif; overflow-x: clip; }
        .redline .r-display { font-weight: 800; font-style: italic; letter-spacing: -0.01em; }
        .redline .r-eyebrow { text-transform: uppercase; letter-spacing: 0.22em; font-size: 11px; font-weight: 700; }
        .redline .num { font-variant-numeric: tabular-nums; }
        .redline .r-scroll { scrollbar-width: none; }
        .redline .r-scroll::-webkit-scrollbar { display: none; }
        .redline .r-btn { display:inline-block; background:var(--store-primary); color:var(--store-on-primary); text-transform:uppercase; font-size:12px; letter-spacing:0.1em; font-weight:700; padding:13px 26px; border-radius:2px; transition:filter .15s, transform .15s; }
        .redline .r-btn:hover { filter:brightness(1.08); transform:translateY(-1px); }
        .redline .r-btn-dark { display:inline-block; background:var(--store-secondary); color:var(--store-on-secondary); text-transform:uppercase; font-size:12px; letter-spacing:0.1em; font-weight:700; padding:13px 26px; border-radius:2px; }
        .redline .r-btn-ghost { display:inline-block; color:#fff; text-transform:uppercase; font-size:12px; letter-spacing:0.1em; font-weight:700; padding:12px 24px; border:1px solid rgba(255,255,255,0.6); border-radius:2px; }
        .redline .r-btn-ghost-light { display:inline-block; color:#fff; text-transform:uppercase; font-size:12px; letter-spacing:0.1em; font-weight:700; padding:12px 24px; border:1px solid #fff; border-radius:2px; }
      `}</style>
    </div>
  );
}
