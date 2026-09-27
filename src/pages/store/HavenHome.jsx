// "Haven" — a warm, editorial storefront template (cream + espresso, serif
// headings, natural light, magazine whitespace). Generic, works for any catalogue. Fully
// tenant-driven: hero, categories, products, prices and links come from the
// vendor's own config + products. A sequential allocator gives each section a
// fresh slice, so NO product repeats anywhere on the landing page.
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
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
    <Link to={withStore(`/p/${p.dbName}/${p.productId}`)} {...newTab} className="group block text-center">
      <div className="overflow-hidden" style={{ aspectRatio: "1/1", background: "var(--color-panel)" }}>
        {p.thumbnail
          ? <img src={p.thumbnail} alt={p.productName} loading="lazy" className="w-full h-full object-cover transition duration-[900ms] ease-out group-hover:scale-[1.03]" />
          : <div className="w-full h-full" />}
      </div>
      <div className="pt-3 px-1">
        <div className="text-[12.5px] leading-snug line-clamp-1" style={{ color: "var(--color-ink)" }}>{p.productName}</div>
        <div className="text-[12px] mt-1 num" style={{ color: "var(--store-primary)" }}>{inr(p.price)}</div>
        <span className="inline-block mt-2 text-[10px] uppercase tracking-[0.14em] border px-3 py-1 h-add" style={{ borderColor: "var(--color-line)", color: "var(--color-ink)" }}>Add to cart</span>
      </div>
    </Link>
  );
}

export default function HavenHome() {
  const { config, api } = useStore();
  const cats = homeCategories(config);
  const refresh = useAutoRefresh();

  const [groups, setGroups] = useState(null);
  useEffect(() => {
    if (!cats.length) { setGroups([]); return; }
    Promise.all(cats.slice(0, 6).map((c) =>
      api.products({ category: c, limit: 12 }).then((r) => ({ cat: c, items: (r.results || []).filter((p) => p.thumbnail) })).catch(() => ({ cat: c, items: [] }))
    )).then(setGroups).catch(() => setGroups([]));
  }, [cats.join("|"), refresh]); // eslint-disable-line react-hooks/exhaustive-deps

  const hero = config?.hero || {};
  const storeName = config?.store_name || "";
  const shopAll = withStore("/c/all");
  const pdp = (p) => withStore(`/p/${p.dbName}/${p.productId}`);

  const alloc = useMemo(() => {
    const gs = groups || [];
    const used = new Set();
    const flat = gs.flatMap((g) => g.items);
    const catTiles = gs.map((g) => {
      const pick = g.items.find((p) => !used.has(keyOf(p)));
      if (pick) used.add(keyOf(pick));
      return { cat: g.cat, img: pick?.thumbnail };
    }).filter((t) => t.img);
    const take = (n) => { const out = []; for (const p of flat) { if (out.length >= n) break; if (!used.has(keyOf(p))) { used.add(keyOf(p)); out.push(p); } } return out; };
    const heroRight = hero.image_url ? null : take(1)[0];
    const finishingHero = take(1)[0];   // the big editorial image (its own product)
    const finishing = take(3);          // the 3 product tiles below (disjoint)
    const kitchenHero = take(1)[0];
    const kitchen = take(4);
    const feature = take(1)[0];
    const gallery = take(4);
    return { catTiles, heroRight, finishingHero, finishing, kitchenHero, kitchen, feature, gallery };
  }, [groups, hero.image_url]);

  const { catTiles, heroRight, finishingHero, finishing, kitchenHero, kitchen, feature, gallery } = alloc;
  const heroLeftImg = hero.image_url || catTiles[0]?.img || finishing[0]?.thumbnail;
  const heroRightImg = heroRight?.thumbnail || catTiles[1]?.img;
  const strip = catTiles.slice(0, 5);
  const rooms = catTiles.slice(0, 4);

  return (
    <div className="haven" style={{ background: "var(--store-bg)", color: "var(--color-ink)" }}>
      {/* ---------------- SPLIT HERO ---------------- */}
      <section className="grid grid-cols-1 md:grid-cols-2">
        <div className="relative overflow-hidden" style={{ minHeight: "58vh", background: "var(--color-panel)" }}>
          {heroLeftImg && <img src={heroLeftImg} alt="" className="absolute inset-0 w-full h-full object-cover" />}
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(46,33,26,0.42), transparent 55%)" }} />
          <div className="absolute inset-x-0 bottom-0 p-7 md:p-10">
            <h2 className="h-serif text-white text-[28px] md:text-[40px] leading-tight">{hero.title || "New arrivals"}</h2>
            <Link to={shopAll} className="h-btn-light mt-4">Shop now</Link>
          </div>
        </div>
        <div className="relative overflow-hidden" style={{ minHeight: "58vh", background: "var(--color-panel)" }}>
          {heroRightImg && <img src={heroRightImg} alt="" className="absolute inset-0 w-full h-full object-cover" />}
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(46,33,26,0.42), transparent 55%)" }} />
          <div className="absolute inset-x-0 bottom-0 p-7 md:p-10">
            <h2 className="h-serif text-white text-[28px] md:text-[40px] leading-tight">Bestsellers</h2>
            {heroRight
              ? <Link to={pdp(heroRight)} {...newTab} className="h-btn-light mt-4">Shop this</Link>
              : <Link to={shopAll} className="h-btn-light mt-4">Shop now</Link>}
          </div>
        </div>
      </section>

      {/* ---------------- CATEGORY STRIP ---------------- */}
      {strip.length > 0 && (
        <section className="max-w-[1440px] mx-auto px-4 md:px-10 pt-10 md:pt-16">
          <div className="grid gap-3 md:gap-4" style={{ gridTemplateColumns: `repeat(${Math.min(strip.length, 5)}, minmax(0,1fr))` }}>
            {strip.map((t) => (
              <Link key={t.cat} to={withStore(`/c/${encodeURIComponent(t.cat)}`)} className="group block">
                <div className="overflow-hidden" style={{ aspectRatio: "3/4", background: "var(--color-panel)" }}>
                  <img src={t.img} alt={t.cat} className="w-full h-full object-cover transition duration-[900ms] group-hover:scale-105" />
                </div>
                <div className="h-serif text-center text-[15px] md:text-[18px] mt-3">{cap(t.cat)}</div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ---------------- THE FINISHING TOUCHES (asymmetric) ---------------- */}
      {(finishingHero || finishing.length > 0) && (
        <section className="max-w-[1440px] mx-auto px-4 md:px-10 pt-14 md:pt-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <Link to={pdp(finishingHero || finishing[0])} {...newTab} className="block overflow-hidden" style={{ aspectRatio: "4/3", background: "var(--color-panel)" }}>
              <img src={(finishingHero || finishing[0]).thumbnail} alt="" className="w-full h-full object-cover transition duration-[900ms] hover:scale-[1.03]" />
            </Link>
            <div className="md:pl-8">
              <h2 className="h-serif text-[32px] md:text-[46px] leading-tight">Featured</h2>
              <Link to={shopAll} className="h-btn mt-6">Shop all</Link>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-8 mt-12">
            {finishing.map((p) => <Tile key={keyOf(p)} p={p} />)}
          </div>
        </section>
      )}

      {/* ---------------- THE KITCHEN (asymmetric, reversed) ---------------- */}
      {(kitchenHero || kitchen.length > 0) && (
        <section className="max-w-[1440px] mx-auto px-4 md:px-10 pt-14 md:pt-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="md:order-1 order-2 md:pr-8">
              <h2 className="h-serif text-[32px] md:text-[46px] leading-tight">New this week</h2>
              <Link to={shopAll} className="h-btn mt-6">Discover</Link>
            </div>
            <Link to={pdp(kitchenHero || kitchen[0])} {...newTab} className="md:order-2 order-1 block overflow-hidden" style={{ aspectRatio: "4/3", background: "var(--color-panel)" }}>
              <img src={(kitchenHero || kitchen[0]).thumbnail} alt="" className="w-full h-full object-cover transition duration-[900ms] hover:scale-[1.03]" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8 mt-12">
            {kitchen.map((p) => <Tile key={keyOf(p)} p={p} />)}
          </div>
        </section>
      )}

      {/* ---------------- FEATURE (design your own) ---------------- */}
      {feature && (
        <section className="max-w-[1440px] mx-auto px-4 md:px-10 pt-14 md:pt-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <Link to={pdp(feature)} {...newTab} className="block overflow-hidden" style={{ aspectRatio: "5/4", background: "var(--color-panel)" }}>
              <img src={feature.thumbnail} alt="" className="w-full h-full object-cover transition duration-[900ms] hover:scale-[1.03]" />
            </Link>
            <div className="md:pl-8">
              <h2 className="h-serif text-[34px] md:text-[52px] leading-[1.05]">Made for you</h2>
              <p className="text-[14px] mt-4 max-w-[42ch]" style={{ color: "var(--color-ink-soft)" }}>Considered pieces chosen to bring warmth, personality and quiet beauty to the everyday.</p>
              <Link to={shopAll} className="h-btn mt-6">Explore</Link>
            </div>
          </div>
        </section>
      )}

      {/* ---------------- ROOMS GRID ---------------- */}
      {rooms.length > 0 && (
        <section className="max-w-[1440px] mx-auto px-4 md:px-10 pt-14 md:pt-24">
          <div className={`grid gap-3 md:gap-4 ${rooms.length === 1 ? "grid-cols-1" : "grid-cols-2 md:grid-cols-4"}`}>
            {rooms.map((t) => (
              <Link key={t.cat} to={withStore(`/c/${encodeURIComponent(t.cat)}`)} className="group relative block overflow-hidden" style={{ aspectRatio: "3/4", background: "var(--color-panel)" }}>
                <img src={t.img} alt={t.cat} className="absolute inset-0 w-full h-full object-cover transition duration-[900ms] group-hover:scale-105" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(46,33,26,0.55), transparent 50%)" }} />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <div className="h-serif text-white text-[16px] md:text-[20px]">The {cap(t.cat)}</div>
                  <div className="text-white/80 text-[11px] mt-1">Shop the look →</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ---------------- BRAND STORY ---------------- */}
      <section className="max-w-[820px] mx-auto text-center px-6 pt-16 md:pt-28">
        <h2 className="h-serif text-[26px] md:text-[36px]">#{(storeName || "shop").toLowerCase().replace(/\s+/g, "")}</h2>
        <p className="text-[14px] md:text-[15px] leading-relaxed mt-4" style={{ color: "var(--color-ink-soft)" }}>
          {config?.about || "Objects chosen to bring warmth, personality and beauty to the everyday — curated for the way you really live."}
        </p>
      </section>

      {/* ---------------- LIFESTYLE GALLERY ---------------- */}
      {gallery.length > 0 && (
        <section className="max-w-[1440px] mx-auto px-4 md:px-10 pt-10 md:pt-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {gallery.map((p) => (
              <Link key={keyOf(p)} to={pdp(p)} {...newTab} className="group block overflow-hidden" style={{ aspectRatio: "3/4", background: "var(--color-panel)" }}>
                <img src={p.thumbnail} alt="" className="w-full h-full object-cover transition duration-[900ms] group-hover:scale-105" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ---------------- REVIEWS ---------------- */}
      <section className="mt-16 md:mt-24 py-14 md:py-20 px-6" style={{ background: "var(--color-panel)" }}>
        {Array.isArray(config?.reviews) && config.reviews.length
          ? <div className="max-w-[1100px] mx-auto"><ReviewsSlider images={config.reviews} /></div>
          : (
            <div className="max-w-[760px] mx-auto text-center">
              <p className="h-serif text-[22px] md:text-[30px] leading-snug">“Beautifully made and warm in every detail — exactly what I hoped for.”</p>
              <div className="mt-6 text-[12px] uppercase tracking-[0.18em]" style={{ color: "var(--color-ink-soft)" }}>{storeName || "A happy customer"}</div>
            </div>
          )}
      </section>

      {!groups && <div className="min-h-[40vh]" />}

      <style>{`
        .haven { overflow-x: clip; font-family: "Inter", "Helvetica Neue", Arial, system-ui, sans-serif; }
        .haven .h-serif { font-family: "Cormorant Garamond", "Playfair Display", Georgia, "Times New Roman", serif; font-weight: 600; letter-spacing: 0.01em; }
        .haven .num { font-variant-numeric: tabular-nums; }
        .haven .h-btn { display:inline-block; text-transform:uppercase; font-size:11px; letter-spacing:0.14em; font-weight:600; padding:11px 24px; border:1px solid var(--color-ink); color:var(--color-ink); background:transparent; border-radius:0; transition:background .25s,color .25s; }
        .haven .h-btn:hover { background:var(--store-secondary); color:var(--store-on-secondary); }
        .haven .h-btn-light { display:inline-block; text-transform:uppercase; font-size:11px; letter-spacing:0.14em; font-weight:600; padding:10px 22px; background:var(--store-bg); color:var(--color-ink); border-radius:0; }
        .haven .h-add { transition:background .2s,color .2s; }
        .haven .group:hover .h-add { background:var(--store-secondary); color:var(--store-on-secondary); border-color:var(--store-secondary); }
      `}</style>
    </div>
  );
}
