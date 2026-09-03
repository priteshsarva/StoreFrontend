// "Atelier" — a premium, editorial, fashion-magazine storefront template.
// Monochrome (black / white / warm ivory), uppercase grotesk headings, huge
// whitespace, sharp corners, no shadows. Fully tenant-driven: every image, name,
// price and link comes from the vendor's own config + products, so it works for
// any store. Deliberately overrides the store's brand palette within its own
// scope — the look is intentionally black-and-white editorial.
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useStore } from "../../context/StoreContext";
import ReviewsSlider from "../../components/store/ReviewsSlider";
import { withStore } from "../../lib/tenant";
import { inr } from "../../lib/money";

const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "");
const newTab = { target: "_blank", rel: "noopener noreferrer" }; // product clicks open a new tab

// minimal left-aligned product tile — portrait crop, name in black, muted price.
function Tile({ p, ratio = "3/4" }) {
  return (
    <Link to={withStore(`/p/${p.dbName}/${p.productId}`)} {...newTab} className="group block">
      <div className="overflow-hidden bg-[#f4f2ee]" style={{ aspectRatio: ratio }}>
        {p.thumbnail
          ? <img src={p.thumbnail} alt={p.productName} loading="lazy" className="w-full h-full object-cover transition duration-[900ms] ease-out group-hover:scale-[1.04]" />
          : <div className="w-full h-full" />}
      </div>
      <div className="pt-3">
        {p.productBrand && <div className="text-[10px] uppercase tracking-[0.16em] text-[#6f6f6f] truncate">{p.productBrand}</div>}
        <div className="text-[12.5px] text-black leading-snug line-clamp-1 mt-1">{p.productName}</div>
        <div className="text-[12.5px] text-[#6f6f6f] mt-1 num">{inr(p.price)}</div>
      </div>
    </Link>
  );
}

function CircularText({ text }) {
  const t = (text + "  •  ").repeat(3);
  return (
    <svg viewBox="0 0 200 200" className="a-spin w-[128px] h-[128px]" aria-hidden="true">
      <defs><path id="a-circle" d="M100,100 m-74,0 a74,74 0 1,1 148,0 a74,74 0 1,1 -148,0" /></defs>
      {/* white halo (stroke painted under the fill) keeps it readable on photos */}
      <text style={{ fontSize: 12.5, letterSpacing: 2, fill: "#000", stroke: "#fff", strokeWidth: 2.6, paintOrder: "stroke", textTransform: "uppercase", fontWeight: 600 }}>
        <textPath href="#a-circle">{t}</textPath>
      </text>
    </svg>
  );
}

export default function AtelierHome() {
  const { config, api } = useStore();
  const cats = config?.categories || [];

  const [groups, setGroups] = useState(null); // [{ cat, items }]
  useEffect(() => {
    if (!cats.length) { setGroups([]); return; }
    Promise.all(
      cats.slice(0, 4).map((c) =>
        api.products({ category: c, limit: 10 }).then((r) => ({ cat: c, items: r.results || [] })).catch(() => ({ cat: c, items: [] }))
      )
    ).then(setGroups).catch(() => setGroups([]));
  }, [cats.join("|")]); // eslint-disable-line react-hooks/exhaustive-deps

  const pool = useMemo(() => (groups || []).flatMap((g) => g.items).filter((p) => p.thumbnail), [groups]);
  const catCards = useMemo(() => (groups || []).filter((g) => g.items.some((i) => i.thumbnail)).slice(0, 3), [groups]);

  const hero = config?.hero || {};
  const storeName = config?.store_name || "";
  const shopAll = withStore("/c/all");
  const pdp = (p) => withStore(`/p/${p.dbName}/${p.productId}`);

  // Each full-bleed banner sits on a real product's photo — so it links straight
  // to that product ("Buy this now"). The hero is the exception when the vendor
  // set their OWN campaign image (then it's not a product, so it shops the store).
  const heroProduct = hero.image_url ? null : pool[0];
  const heroImg = hero.image_url || pool[0]?.thumbnail;
  const heroTitle = hero.title || "Timeless style for modern lives";
  const editorialProduct = pool[4] || pool[0];
  const editorialImg = editorialProduct?.thumbnail || heroImg;
  const bannerProduct = pool[5] || pool[1] || pool[0];
  const bannerImg = bannerProduct?.thumbnail || heroImg;

  const bestsellers = pool.slice(0, 12);
  const collage = pool.slice(0, 5);
  const arrivals = pool.slice(0, 15);

  // Best-seller rail: arrow controls that actually slide the row.
  const railRef = useRef(null);
  const slide = (dir) => { const el = railRef.current; if (el) el.scrollBy({ left: dir * Math.round(el.clientWidth * 0.85), behavior: "smooth" }); };

  const review = (Array.isArray(config?.reviews) && config.reviews.length)
    ? null // if the vendor added review images, show the image slider instead of the canned quote
    : {
        quote: "Effortless style, timeless appeal. Every garment is designed with precision to bring confidence, comfort, and contemporary elegance to your wardrobe.",
        by: storeName || "A happy customer",
      };

  return (
    <div className="atelier bg-white text-black">
      {/* ---------------- HERO ---------------- */}
      <section className="relative w-full overflow-hidden" style={{ minHeight: "88vh", background: "#f4f2ee" }}>
        {heroImg && (
          <img src={heroImg} alt="" className="absolute inset-0 w-full h-full object-cover" />
        )}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.42), rgba(0,0,0,0.05) 45%, transparent)" }} />
        <div className="relative z-10 flex flex-col justify-end min-h-[88vh] px-6 md:px-14 pb-14 md:pb-20 max-w-[1440px] mx-auto">
          <h1 className="a-display text-white uppercase leading-[0.95] text-[40px] md:text-[76px] max-w-[16ch]">{heroTitle}</h1>
          {hero.subtitle && <p className="text-white/85 mt-4 max-w-[42ch] text-sm md:text-base">{hero.subtitle}</p>}
          <div className="mt-8 flex items-center gap-5">
            {heroProduct
              ? <Link to={pdp(heroProduct)} {...newTab} className="a-btn">Buy this now</Link>
              : <Link to={shopAll} className="a-btn">Shop all products</Link>}
            {heroProduct && <Link to={shopAll} className="text-[11px] uppercase tracking-[0.16em] text-white border-b border-white/70 pb-0.5 hover:opacity-70 transition-opacity">Shop all</Link>}
          </div>
        </div>
      </section>

      {/* ---------------- CATEGORY CARDS ----------------
          Columns follow the category count so a single-category store gets one
          full-width landscape banner instead of one skinny card + empty gaps. */}
      {catCards.length > 0 && (() => {
        const n = Math.min(catCards.length, 3);
        const solo = n === 1;
        return (
          <section className="grid gap-[2px] bg-white" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
            {catCards.slice(0, 3).map((g) => {
              const img = g.items.find((i) => i.thumbnail)?.thumbnail;
              return (
                <Link key={g.cat} to={withStore(`/c/${encodeURIComponent(g.cat)}`)} className="group relative block overflow-hidden" style={{ aspectRatio: solo ? "21/9" : "3/4.2", background: "#f4f2ee" }}>
                  {img && <img src={img} alt={g.cat} className="absolute inset-0 w-full h-full object-cover transition duration-[900ms] ease-out group-hover:scale-[1.04]" />}
                  <div className="absolute inset-0" style={{ background: solo ? "linear-gradient(to top, rgba(0,0,0,0.3), transparent 55%)" : "transparent" }} />
                  <div className={`absolute inset-x-0 bottom-0 flex ${solo ? "justify-start px-6 md:px-14" : "justify-center"} pb-7`}>
                    <span className="a-btn">Shop {cap(g.cat)}</span>
                  </div>
                </Link>
              );
            })}
          </section>
        );
      })()}

      {/* ---------------- BEST SELLER ---------------- */}
      {bestsellers.length > 0 && (
        <section className="max-w-[1440px] mx-auto px-6 md:px-14 pt-[70px] md:pt-[110px]">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="a-display uppercase text-[22px] md:text-[34px] leading-none">Best Seller</h2>
              <div className="text-[11px] uppercase tracking-[0.18em] text-[#6f6f6f] mt-2">Top picks{cats[0] ? ` · ${cap(cats[0])}` : ""}</div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => slide(-1)} aria-label="Previous" className="w-9 h-9 border border-[#e6e6e6] flex items-center justify-center hover:bg-black hover:text-white transition-colors"><ArrowLeft size={16} /></button>
              <button onClick={() => slide(1)} aria-label="Next" className="w-9 h-9 border border-[#e6e6e6] flex items-center justify-center hover:bg-black hover:text-white transition-colors"><ArrowRight size={16} /></button>
              <Link to={shopAll} className="hidden sm:inline-block text-[11px] uppercase tracking-[0.14em] border-b border-black pb-0.5 hover:opacity-60 transition-opacity ml-2">View all</Link>
            </div>
          </div>
          <div ref={railRef} className="flex gap-5 md:gap-7 overflow-x-auto a-scroll pb-3 -mx-6 px-6 md:mx-0 md:px-0" style={{ scrollSnapType: "x mandatory" }}>
            {bestsellers.map((p) => (
              <div key={`${p.dbName}-${p.productId}`} className="flex-none w-[62vw] sm:w-[38vw] md:w-[300px]" style={{ scrollSnapAlign: "start" }}><Tile p={p} /></div>
            ))}
          </div>
        </section>
      )}

      {/* ---------------- EDITORIAL CAMPAIGN ---------------- */}
      {editorialImg && (
        <section className="relative w-full mt-[70px] md:mt-[120px]" style={{ height: "72vh", background: "#f4f2ee" }}>
          <img src={editorialImg} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(0,0,0,0.35), transparent 55%)" }} />
          <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-14 max-w-[1440px] mx-auto">
            <h2 className="a-display uppercase text-white leading-[0.98] text-[30px] md:text-[54px] max-w-[14ch]">Minimalist designs crafted for you</h2>
            <div className="mt-6 flex items-center gap-5">
              {editorialProduct && <Link to={pdp(editorialProduct)} {...newTab} className="a-btn">Buy this now</Link>}
              <Link to={shopAll} className="text-[11px] uppercase tracking-[0.16em] text-white border-b border-white pb-0.5 hover:opacity-70 transition-opacity">Discover</Link>
            </div>
          </div>
        </section>
      )}

      {/* ---------------- ASYMMETRIC COLLAGE ---------------- */}
      {collage.length >= 4 && (
        <section className="relative max-w-[1440px] mx-auto px-6 md:px-14 pt-[70px] md:pt-[120px] overflow-visible">
          {/* circular text — deliberately OFFSET to the top-right and allowed to
              bleed off the page edge, so it reads as an editorial mark rather than
              a label pinned to the middle of a product. */}
          <div className="pointer-events-none absolute z-30 top-[46px] right-[-26px] md:top-[92px] md:right-[-46px]">
            <CircularText text="Light layers for everyday" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-12 gap-3 md:gap-5">
            <Link to={pdp(collage[0])} {...newTab} className="md:col-span-7 group block overflow-hidden" style={{ aspectRatio: "4/5" }}>
              <img src={collage[0].thumbnail} alt="" className="w-full h-full object-cover transition duration-[900ms] group-hover:scale-[1.03]" />
            </Link>
            <div className="md:col-span-5 flex flex-col gap-3 md:gap-5">
              <Link to={pdp(collage[1])} {...newTab} className="group block overflow-hidden flex-1" style={{ aspectRatio: "3/2" }}>
                <img src={collage[1].thumbnail} alt="" className="w-full h-full object-cover transition duration-[900ms] group-hover:scale-[1.03]" />
              </Link>
              {collage[4]
                ? <Link to={pdp(collage[4])} {...newTab} className="group block overflow-hidden flex-1" style={{ aspectRatio: "3/2" }}>
                    <img src={collage[4].thumbnail} alt="" className="w-full h-full object-cover transition duration-[900ms] group-hover:scale-[1.03]" />
                  </Link>
                : <div className="flex-1 bg-[#f4f2ee] min-h-[160px]" />}
            </div>
            <Link to={pdp(collage[2])} {...newTab} className="md:col-span-5 group block overflow-hidden" style={{ aspectRatio: "4/5" }}>
              <img src={collage[2].thumbnail} alt="" className="w-full h-full object-cover transition duration-[900ms] group-hover:scale-[1.03]" />
            </Link>
            <Link to={pdp(collage[3])} {...newTab} className="md:col-span-7 group block overflow-hidden" style={{ aspectRatio: "16/10" }}>
              <img src={collage[3].thumbnail} alt="" className="w-full h-full object-cover transition duration-[900ms] group-hover:scale-[1.03]" />
            </Link>
          </div>
        </section>
      )}

      {/* ---------------- TESTIMONIAL ---------------- */}
      <section className="mt-[70px] md:mt-[120px] py-[70px] md:py-[110px] px-6" style={{ background: "#f4f2ee" }}>
        {review ? (
          <div className="max-w-[820px] mx-auto text-center">
            <p className="a-quote text-[19px] md:text-[27px] leading-[1.5] text-black">“{review.quote}”</p>
            <div className="mt-8 text-[13px] uppercase tracking-[0.16em]">{review.by}</div>
            <div className="mt-3 tracking-[0.3em] text-black">★★★★★</div>
          </div>
        ) : (
          <div className="max-w-[1100px] mx-auto"><ReviewsSlider images={config.reviews} /></div>
        )}
      </section>

      {/* ---------------- CAMPAIGN BANNER ---------------- */}
      {bannerImg && (
        <section className="relative w-full" style={{ height: "78vh", background: "#f4f2ee" }}>
          <img src={bannerImg} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.4), transparent 60%)" }} />
          <div className="relative z-10 h-full flex flex-col justify-end px-6 md:px-14 pb-14 md:pb-20 max-w-[1440px] mx-auto">
            <h2 className="a-display uppercase text-white leading-[0.95] text-[32px] md:text-[60px] max-w-[12ch]">The art of everyday elegance</h2>
            <div className="mt-6 flex items-center gap-5">
              {bannerProduct && <Link to={pdp(bannerProduct)} {...newTab} className="a-btn">Buy this now</Link>}
              <Link to={shopAll} className="text-[11px] uppercase tracking-[0.16em] text-white border-b border-white pb-0.5 hover:opacity-70 transition-opacity">Read the story</Link>
            </div>
          </div>
        </section>
      )}

      {/* ---------------- NEW ARRIVALS MARQUEE ---------------- */}
      <section className="overflow-hidden border-y border-[#e6e6e6] py-5 mt-[70px] md:mt-[120px]">
        <div className="a-marquee">
          {[0, 1].map((k) => (
            <div key={k} className="flex items-center shrink-0">
              {Array.from({ length: 6 }).map((_, i) => (
                <span key={i} className="flex items-center a-display uppercase text-[20px] md:text-[30px] px-6">
                  New Arrivals <span className="inline-block w-2 h-2 rounded-full bg-black mx-6" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- NEW ARRIVALS GRID ---------------- */}
      {arrivals.length > 0 && (
        <section className="max-w-[1440px] mx-auto px-6 md:px-14 pt-[40px] md:pt-[70px] pb-[70px] md:pb-[120px]">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-3 gap-y-8 md:gap-x-5 md:gap-y-12">
            {arrivals.map((p) => <Tile key={`${p.dbName}-${p.productId}`} p={p} />)}
          </div>
          <div className="text-center mt-12 md:mt-16">
            <Link to={shopAll} className="a-btn-dark">Shop the collection</Link>
          </div>
        </section>
      )}

      {!groups && <div className="min-h-[40vh]" />}

      <style>{`
        .atelier { font-family: "Helvetica Neue", Helvetica, Arial, "Inter", system-ui, sans-serif; }
        /* force the grotesk over any global display-serif heading rule */
        .atelier .a-display, .atelier .a-quote {
          font-family: "Helvetica Neue", Helvetica, Arial, "Inter", system-ui, sans-serif;
        }
        .atelier .a-display { font-weight: 700; letter-spacing: -0.01em; }
        .atelier .a-quote { font-weight: 400; }
        .atelier .num { font-variant-numeric: tabular-nums; }
        .atelier .a-btn {
          display:inline-block; background:#fff; color:#000; text-transform:uppercase;
          font-size:11px; letter-spacing:0.14em; font-weight:600; padding:12px 22px; border-radius:0;
          transition:background .3s,color .3s;
        }
        .atelier .a-btn:hover { background:#000; color:#fff; }
        .atelier .a-btn-dark {
          display:inline-block; background:#000; color:#fff; text-transform:uppercase;
          font-size:11px; letter-spacing:0.14em; font-weight:600; padding:14px 30px; border-radius:0;
          transition:opacity .3s;
        }
        .atelier .a-btn-dark:hover { opacity:.78; }
        .atelier .a-scroll { scrollbar-width:none; }
        .atelier .a-scroll::-webkit-scrollbar { display:none; }
        .atelier .a-marquee { display:flex; width:max-content; animation: a-marquee 32s linear infinite; }
        @keyframes a-marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        .atelier .a-spin { animation: a-spin 20s linear infinite; transform-origin:center; }
        @keyframes a-spin { to { transform: rotate(360deg); } }
        @media (prefers-reduced-motion: reduce) {
          .atelier .a-marquee, .atelier .a-spin { animation: none; }
        }
      `}</style>
    </div>
  );
}
