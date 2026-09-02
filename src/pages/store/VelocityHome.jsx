// "Velocity" — a high-energy, shoe-first storefront template (neon-lime + crimson,
// heavy slanted display type, floating angled product shots). Fully tenant-driven:
// every image, price and link comes from the vendor's own config + products, so
// it works for any footwear store, not one brand. Shoes are the hero; other
// categories drop to a secondary rail. Falls back gracefully when a store sells
// no shoes (uses its first category instead).
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useStore } from "../../context/StoreContext";
import WhatsAppPromoBar from "../../components/store/WhatsAppPromoBar";
import ProductCard from "../../components/store/ProductCard";
import ReviewsSlider from "../../components/store/ReviewsSlider";
import { withStore } from "../../lib/tenant";

const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "");
const isShoeCat = (c) => /shoe|footwear|sneaker|trainer/i.test(c || "");

// Category-aware upgrade blurbs — generic, true of the whole category, so the
// section reads right whether the store's primary category is shoes, watches, etc.
function upgradesFor(cat) {
  if (isShoeCat(cat)) return [
    { title: "Protective Material", body: "Reinforced high-wear zones stand up to hard play, session after session." },
    { title: "Multilayer Cushioning", body: "A stacked foam system keeps every step comfortable from warm-up to match point." },
    { title: "Upgraded Rubber", body: "A denser, abrasion-resistant outsole compound built to grip and to last." },
  ];
  if (/watch|horolog/i.test(cat || "")) return [
    { title: "Precision Movement", body: "Accurate, reliable timekeeping engineered to hold its beat for years." },
    { title: "Scratch-Tough Crystal", body: "A hardened glass face that keeps the dial crisp through daily wear." },
    { title: "Refined Materials", body: "Premium cases and straps finished to look as good as they feel." },
  ];
  if (/bag|hand|wallet|purse|luggage/i.test(cat || "")) return [
    { title: "Full-Grain Leather", body: "Rich, durable material that only looks better with age." },
    { title: "Reinforced Stitching", body: "Built to carry the load, day in and day out." },
    { title: "Smart Storage", body: "Thoughtful compartments that keep your essentials in order." },
  ];
  return [
    { title: "Premium Materials", body: "Made from carefully selected materials built to last." },
    { title: "Crafted Comfort", body: "Designed around real-world use for everyday quality." },
    { title: "Built to Last", body: "Durable construction that stands up to daily wear." },
  ];
}
const TECH_BY_CAT = {
  shoes: ["Protective Material", "Multilayer Cushioning System", "High-Rebound Midsole", "Upgraded Abrasion-Resistant Rubber"],
  watches: ["Precision Movement", "Sapphire-Coated Crystal", "Water-Resistant Case", "Premium Strap & Clasp"],
  default: ["Premium Materials", "Precision Craftsmanship", "Everyday Durability", "Signature Finish"],
};

// Two palettes sharing one layout. Velocity = shoes (neon-lime + crimson);
// Chrono = watches (gold + deep-blue). Colours are just CSS-var overrides on the
// root, so the whole template recolours without touching the markup. Both keep
// dark text on a bright ground, so nothing needs re-contrasting.
const VARIANTS = {
  velocity: {
    css: { "--v-lime": "#d8ff53", "--v-lime-soft": "#e9ff8a", "--v-red": "#d90429", "--v-ink": "#0d0d0d" },
    isPrimary: isShoeCat, heroFallback: "Move Faster",
  },
  chrono: {
    css: { "--v-lime": "#f2c94c", "--v-lime-soft": "#f7dd8f", "--v-red": "#1e3a8a", "--v-ink": "#141414" },
    isPrimary: (c) => /watch|horolog|time|chrono/i.test(c || ""), heroFallback: "Time to Move",
  },
};

export default function VelocityHome({ variant = "velocity" }) {
  const V = VARIANTS[variant] || VARIANTS.velocity;
  const { config, api } = useStore();
  const cats = config?.categories || [];
  const shoeCat = useMemo(() => cats.find(V.isPrimary) || cats[0], [cats.join("|")]); // eslint-disable-line react-hooks/exhaustive-deps

  const [products, setProducts] = useState(null); // shoe products
  const [gender, setGender] = useState("all");     // all | men | women

  useEffect(() => {
    if (!shoeCat) { setProducts([]); return; }
    api.products({ category: shoeCat, limit: 24 }).then((r) => setProducts(r.results || [])).catch(() => setProducts([]));
  }, [shoeCat]); // eslint-disable-line react-hooks/exhaustive-deps

  const list = products || [];
  const withImg = list.filter((p) => p.thumbnail);
  const pdp = (p) => withStore(`/p/${p.dbName}/${p.productId}`);
  const newTab = { target: "_blank", rel: "noopener noreferrer" }; // product clicks open in a new tab
  const hasGender = useMemo(() => list.some((p) => /women/i.test(p.catName || "")) || list.some((p) => /\bmen/i.test(p.catName || "")), [list]);
  const shown = useMemo(() => {
    if (gender === "all" || !hasGender) return list;
    if (gender === "women") return list.filter((p) => /women/i.test(p.catName || ""));
    return list.filter((p) => /\bmen/i.test(p.catName || "") && !/women/i.test(p.catName || ""));
  }, [list, gender, hasGender]);

  const hero = config?.hero || {};
  const storeName = config?.store_name || "";
  const upgrades = upgradesFor(shoeCat);
  const tech = isShoeCat(shoeCat) ? TECH_BY_CAT.shoes : /watch|horolog|time|chrono/i.test(shoeCat || "") ? TECH_BY_CAT.watches : TECH_BY_CAT.default;
  const floats = withImg.slice(0, 2);              // hero floating shoes (clickable)
  const marquee = withImg.slice(0, 10);            // "made for" scrolling strip
  const spotlights = withImg.slice(0, 2);
  const shopShoes = withStore(`/c/${encodeURIComponent(shoeCat || "all")}`);

  return (
    <div className="velocity" style={V.css}>
      {/* WhatsApp CTA sits between the header and the hero */}
      <WhatsAppPromoBar />

      {/* ---------------- HERO ---------------- */}
      <section className="v-hero">
        <div className="v-wrap text-center relative z-10">
          <h1 className="v-display v-hero-title">
            {hero.title || storeName || V.heroFallback}
          </h1>
          <Link to={shopShoes} className="v-btn-red mt-6">Explore the collection</Link>
        </div>
        {/* floating angled shoe shots — real products, each links to its page */}
        <div className="v-hero-floats">
          {floats[0] && (
            <Link to={pdp(floats[0])} {...newTab} className="v-float v-float-a" aria-label={floats[0].productName}>
              <img src={floats[0].thumbnail} alt={floats[0].productName} referrerPolicy="no-referrer" />
            </Link>
          )}
          {floats[1] && (
            <Link to={pdp(floats[1])} {...newTab} className="v-float v-float-b" aria-label={floats[1].productName}>
              <img src={floats[1].thumbnail} alt={floats[1].productName} referrerPolicy="no-referrer" />
            </Link>
          )}
        </div>
      </section>

      {/* ---------------- THE UPGRADES ---------------- */}
      <section className="v-lime py-16">
        <div className="v-wrap">
          <h2 className="v-display v-h2 text-center mb-10">The Upgrades</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {upgrades.map((u, i) => {
              const p = withImg[i];
              const Media = p ? Link : "div";
              return (
                <div key={u.title} className="reveal flex flex-col items-center text-center">
                  <Media {...(p ? { to: pdp(p), ...newTab } : {})} className="w-full aspect-[4/3] bg-white/50 mb-5 overflow-hidden flex items-center justify-center rounded-sm group">
                    {p
                      ? <img src={p.thumbnail} alt={p.productName} referrerPolicy="no-referrer" className="w-full h-full object-cover transition duration-500 group-hover:scale-105" />
                      : <span className="text-black/30 text-4xl v-display">{String(i + 1).padStart(2, "0")}</span>}
                  </Media>
                  <span className="v-tag-red">New</span>
                  <h3 className="v-display text-xl mt-2 mb-1.5">{u.title}</h3>
                  <p className="text-sm v-on-lime max-w-xs">{u.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------- GET THERE (product selector) ---------------- */}
      <section className="v-lime-soft py-16">
        <div className="v-wrap text-center">
          <h2 className="v-display v-h2 mb-2">Get There</h2>
          <p className="v-on-lime mb-8">The pieces designed to keep you a step ahead.</p>
          {hasGender && (
            <div className="flex items-center justify-center gap-7 mb-10">
              {["men", "women"].map((g) => (
                <button key={g} onClick={() => setGender(gender === g ? "all" : g)}
                  className={`v-display text-2xl md:text-3xl transition-colors border-b-4 pb-1 ${gender === g ? "text-black border-[var(--v-red)]" : "text-black/55 border-transparent hover:text-black"}`}>
                  {g === "men" ? "Men's" : "Women's"}
                </button>
              ))}
            </div>
          )}
          {/* products sit directly on the lime — v-cards recolours the card text
              and borders dark so they stay legible without a panel */}
          {products === null ? (
            <div className="py-16 v-on-lime">Loading…</div>
          ) : shown.length === 0 ? (
            <div className="py-16 v-on-lime">No products yet.</div>
          ) : (
            <div className="stagger v-cards grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-9 text-left">
              {shown.map((p) => <ProductCard key={`${p.dbName}-${p.productId}`} product={p} />)}
            </div>
          )}
          <div className="mt-10">
            <Link to={shopShoes} className="v-btn-black">Shop all {cap(shoeCat)}</Link>
          </div>
        </div>
      </section>

      {/* ---------------- ENDORSEMENT / QUOTE ---------------- */}
      {config?.about && (
        <section className="v-lime py-16">
          <div className="v-wrap text-center max-w-3xl">
            <h2 className="v-display v-h2 mb-2">Stamp of Approval</h2>
            <div className="eyebrow mb-6 !text-black/60">Straight from the {isShoeCat(shoeCat) ? "court" : "collection"}</div>
            <p className="text-xl md:text-2xl text-black leading-relaxed font-light" style={{ textWrap: "pretty" }}>
              “{config.about}”
            </p>
            <div className="v-display text-lg mt-6">— {storeName}</div>
          </div>
        </section>
      )}

      {/* ---------------- MADE FOR … (scrolling, clickable product strip) ---------------- */}
      {marquee.length >= 3 && (
        <section>
          <div className="v-banner v-display">MADE&nbsp;FOR&nbsp;{(cap(shoeCat) || "SPEED").toUpperCase()}</div>
          <div className="v-mosaic overflow-hidden">
            <div className="v-mosaic-track flex" style={{ animation: `v-mosaic-scroll ${marquee.length * 4}s linear infinite` }}>
              {[...marquee, ...marquee].map((p, i) => (
                <Link key={i} to={pdp(p)} {...newTab} className="v-mosaic-cell shrink-0 aspect-square bg-black block relative group" aria-label={p.productName}>
                  <img src={p.thumbnail} alt={p.productName} referrerPolicy="no-referrer" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </div>
          </div>
          <div className="v-banner v-display">{storeName ? storeName.toUpperCase() : "PLAY HARD"}</div>
        </section>
      )}

      {/* ---------------- PRODUCT SPOTLIGHTS ---------------- */}
      {spotlights.map((p, i) => (
        <section key={`${p.dbName}-${p.productId}`} className={i % 2 ? "v-lime-soft" : "bg-paper"}>
          <div className="v-wrap py-16 grid md:grid-cols-2 gap-10 items-center">
            <div className={`reveal ${i % 2 ? "md:order-2" : ""}`}>
              <div className="eyebrow mb-3 !text-[var(--v-red)]">{p.productBrand || cap(shoeCat)}</div>
              <h2 className="v-display text-3xl md:text-4xl mb-4">{p.productName}</h2>
              <p className={`leading-relaxed mb-6 ${i % 2 ? "v-on-lime" : "text-ink-soft"}`}>
                Built for people who want responsive feel, lockdown support and all-day comfort — engineered to elevate your everyday.
              </p>
              <Link to={pdp(p)} {...newTab} className="inline-flex items-center gap-1.5 v-display text-sm hover:gap-2.5 transition-all">
                Shop {p.productName.split(" ").slice(0, 3).join(" ")} <ArrowRight size={16} />
              </Link>
            </div>
            <Link to={pdp(p)} {...newTab} className={`reveal block ${i % 2 ? "md:order-1" : ""}`}>
              <div className="aspect-square bg-panel overflow-hidden">
                <img src={p.thumbnail} alt={p.productName} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
              </div>
            </Link>
          </div>
        </section>
      ))}

      {/* ---------------- EXPLODED TECH BREAKDOWN ---------------- */}
      <section className="v-ink text-white py-16">
        <div className="v-wrap grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="v-display v-h2 mb-8 text-[var(--v-lime)]">The Tech</h2>
            <ul className="space-y-5">
              {tech.map((t) => (
                <li key={t} className="reveal flex items-start gap-3">
                  <span className="v-tag-red shrink-0 mt-0.5">New</span>
                  <span className="v-display text-lg">{t}</span>
                </li>
              ))}
            </ul>
            <Link to={shopShoes} className="v-btn-red mt-9">Shop Now</Link>
          </div>
          {withImg[0] && (
            <Link to={pdp(withImg[0])} {...newTab} className="reveal block">
              <img src={withImg[0].thumbnail} alt={withImg[0].productName} referrerPolicy="no-referrer" className="w-full object-contain drop-shadow-2xl" />
            </Link>
          )}
        </div>
      </section>

      {/* ---------------- ACTION HERO ---------------- */}
      {(hero.image_url || marquee[0]) && (
        <section className="relative h-[52vh] min-h-[340px] overflow-hidden">
          <img src={hero.image_url || marquee[0]?.thumbnail} alt="" referrerPolicy="no-referrer" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative z-10 h-full flex items-center justify-center">
            <Link to={shopShoes} className="v-btn-red">Find your pair</Link>
          </div>
        </section>
      )}

      {/* reviews (vendor-added, reuses the shared auto-slider) */}
      <div className="v-lime-soft"><ReviewsSlider images={config?.reviews} /></div>

      {/* This template is single-category by design (Velocity = shoes, Chrono =
          watches): the home shows ONLY the primary category's products. Other
          categories the store sells stay reachable via the nav's "Shop" link and
          their own category pages — never mixed onto this home. */}

      <style>{`
        .velocity {
          --v-lime: #d8ff53; --v-lime-soft: #e9ff8a; --v-red: #d90429; --v-ink: #0d0d0d;
          overflow-x: clip;
        }
        .velocity .v-wrap { max-width: 72rem; margin: 0 auto; padding-left: 1rem; padding-right: 1rem; }
        .velocity .v-lime { background: var(--v-lime); color: var(--v-ink); }
        .velocity .v-lime-soft { background: var(--v-lime-soft); color: var(--v-ink); }
        .velocity .v-ink { background: var(--v-ink); }
        /* readable body text on the lime backgrounds */
        .velocity .v-on-lime { color: rgba(13,13,13,0.78); }
        /* recolour product-card text/borders dark so cards read on the lime bg
           (no white panel behind them) */
        .velocity .v-cards .text-ink-soft { color: rgba(13,13,13,0.82); }
        .velocity .v-cards .text-muted { color: rgba(13,13,13,0.60); }
        .velocity .v-cards .border-line { border-color: rgba(13,13,13,0.30); }
        .velocity .v-display {
          font-weight: 900; font-style: italic; text-transform: uppercase;
          letter-spacing: -0.01em; line-height: 0.95; transform: skewX(-6deg);
        }
        .velocity .v-h2 { font-size: clamp(2rem, 6vw, 3.75rem); }
        .velocity .v-hero {
          position: relative; overflow: hidden; padding: clamp(3.5rem, 9vw, 7rem) 0 clamp(9rem, 22vw, 14rem);
          background: radial-gradient(120% 120% at 50% 0%, var(--v-lime) 40%, var(--v-lime-soft) 100%);
          color: var(--v-ink);
        }
        .velocity .v-hero-title { font-size: clamp(2.75rem, 12vw, 8rem); margin-top: 1rem; overflow-wrap: anywhere; }
        .velocity .v-hero-floats { position: absolute; inset: 0; }
        .velocity .v-float {
          position: absolute; display: block; width: clamp(150px, 32vw, 400px);
          filter: drop-shadow(0 30px 40px rgba(0,0,0,0.35)); transition: transform 0.25s ease;
        }
        .velocity .v-float img { width: 100%; height: auto; object-fit: contain; }
        .velocity .v-float-a { right: 3%; bottom: -4%; transform: rotate(-14deg); }
        .velocity .v-float-b { left: 3%; bottom: 2%; transform: rotate(10deg); width: clamp(115px, 22vw, 290px); }
        .velocity .v-float-a:hover { transform: rotate(-14deg) translateY(-8px) scale(1.03); }
        .velocity .v-float-b:hover { transform: rotate(10deg) translateY(-8px) scale(1.03); }
        .velocity .v-pill-red, .velocity .v-tag-red {
          display: inline-block; background: var(--v-red); color: #fff; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.08em;
        }
        .velocity .v-tag-red { font-size: 10px; padding: 3px 8px; border-radius: 3px; }
        .velocity .v-btn-red, .velocity .v-btn-black {
          display: inline-flex; align-items: center; gap: 8px; font-weight: 800; text-transform: uppercase;
          letter-spacing: 0.04em; font-size: 14px; padding: 14px 30px; border-radius: 999px;
          transition: transform 0.15s ease, filter 0.15s ease;
        }
        .velocity .v-btn-red { background: var(--v-red); color: #fff; }
        .velocity .v-btn-black { background: var(--v-ink); color: #fff; }
        .velocity .v-btn-red:hover, .velocity .v-btn-black:hover { transform: translateY(-2px); filter: brightness(1.08); }
        .velocity .v-banner {
          background: var(--v-ink); color: #fff; text-align: center; padding: 14px 0;
          font-size: clamp(1.25rem, 4vw, 2.25rem); overflow: hidden; white-space: nowrap;
        }
        /* "made for" scrolling strip: cells sized so a few show at once; pause on hover */
        .velocity .v-mosaic-cell { width: clamp(150px, 30vw, 240px); }
        .velocity .v-mosaic:hover .v-mosaic-track { animation-play-state: paused !important; }
        @keyframes v-mosaic-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
      `}</style>
    </div>
  );
}
