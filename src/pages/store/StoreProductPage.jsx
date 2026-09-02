import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useStore } from "../../context/StoreContext";
import { Heart, Truck, RotateCcw, ShieldCheck, ChevronRight, Check } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { inr } from "../../lib/money";
import { useWishlist } from "../../context/WishlistContext";
import { withStore } from "../../lib/tenant";
import ProductRail from "../../components/store/ProductRail";
import SectionHeading from "../../components/store/SectionHeading";

export default function StoreProductPage() {
  const { dbName, id } = useParams();
  const { api, config } = useStore();
  const { add } = useCart();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [activeImg, setActiveImg] = useState(0);
  const [size, setSize] = useState("");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setData(null); setError(null); setActiveImg(0); setSize(""); setQty(1); setAdded(false);
    api.product(dbName, id).then((d) => {
      if (cancelled) return;
      setData(d);
      api.track("view_item", { product_id: d?.product?.productId, db_name: d?.product?.dbName, value: d?.product?.price });
    }).catch((e) => { if (!cancelled) setError(e); });

    // Trigger a live re-scrape of this product on the backend (like the original
    // site did). The endpoint returns only a status — never the raw supplier
    // row — and if it actually refreshed, re-read the (redacted) product so the
    // shopper sees the fresh stock/price without a manual reload.
    api.refreshProduct(dbName, id)
      .then((r) => {
        if (!cancelled && r && r.status === "refreshing") {
          setTimeout(() => { api.product(dbName, id).then((d) => { if (!cancelled) setData(d); }).catch(() => {}); }, 4000);
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [dbName, id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (error) return <div className="max-w-screen-xl mx-auto px-4 py-24 text-center text-muted">Product not found.</div>;
  if (!data) return <ProductSkeleton />;

  const { product, similar } = data;
  const images = product.images && product.images.length ? product.images : [product.thumbnail].filter(Boolean);

  const needsSize = product.sizes?.length > 0;
  const canOrder = product.inStock && (!needsSize || size);

  function handleAddToCart() {
    add(product, qty, size);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  function handleBuyNow() {
    navigate(withStore("/checkout"), {
      state: {
        quickItem: {
          product_id: product.productId, db_name: product.dbName, size,
          name: product.productName, image: product.thumbnail, price: product.price, qty,
        },
      },
    });
  }

  // Ask the vendor for a size over WhatsApp (same handoff the cards use).
  function requestSize() {
    const phone = String(config?.whatsapp || "").replace(/[^\d]/g, "");
    const link = `${window.location.origin}${withStore(`/p/${product.dbName}/${product.productId}`)}`;
    const text = `Hi ${config?.store_name || ""}, I'd like to request a size for "${product.productName}".\n${link}`;
    window.open(`https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(text)}`, "_blank", "noopener");
  }

  // Breadcrumb: link the PARENT category (product.dbName = shoes/watches — the
  // real /c/:category route). product.catName is a sub-category ("Men's Shoes",
  // set via the vendor's category map) and is NOT a valid category route on its
  // own, so it's shown as plain context, not a link (linking it 404'd → 0 products).
  const parentCat = product.dbName || config?.categories?.[0];
  const parentLabel = (config?.nav?.items || []).find((i) => i.category === parentCat)?.label
    || (parentCat ? parentCat.charAt(0).toUpperCase() + parentCat.slice(1) : "");
  const subCat = product.catName && product.catName.toLowerCase() !== String(parentCat).toLowerCase() ? product.catName : null;

  return (
    <div className="max-w-screen-xl mx-auto px-4 lg:px-6 py-6 pb-24 md:pb-6">
      {/* breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-muted mb-6" aria-label="Breadcrumb">
        <Link to={withStore("/")} className="hover:text-ink transition-colors">Home</Link>
        {parentCat && <><ChevronRight size={13} /><Link to={withStore(`/c/${encodeURIComponent(parentCat)}`)} className="hover:text-ink transition-colors capitalize">{parentLabel}</Link></>}
        {subCat && <><ChevronRight size={13} /><span className="text-muted">{subCat}</span></>}
        <ChevronRight size={13} />
        <span className="text-ink-soft truncate max-w-[200px]">{product.productName}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-14">
        {/* gallery */}
        <div className="md:sticky md:top-28 md:self-start">
          <div className="bg-panel overflow-hidden mb-3 relative" style={{ aspectRatio: "1/1" }}>
            {images[activeImg]
              ? <img src={images[activeImg]} alt={product.productName} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center text-muted">No image</div>}
            {product.savings_pct > 0 && (
              <span className="absolute top-4 left-4 text-white text-[11px] font-semibold tracking-wide px-2.5 py-1 num" style={{ background: "var(--store-primary, #1a1512)" }}>
                −{product.savings_pct}%
              </span>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2.5 flex-wrap">
              {images.map((img, i) => (
                <button key={img + i} onClick={() => setActiveImg(i)} className={`w-16 h-16 overflow-hidden border transition-colors ${i === activeImg ? "border-ink" : "border-line hover:border-line-strong"}`}>
                  <img src={img} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* detail */}
        <div className="md:pt-2 reveal">
          {product.productBrand && <div className="eyebrow mb-3">{product.productBrand}{product.subBrand ? ` · ${product.subBrand}` : ""}</div>}
          <h1 className="text-2xl md:text-[2rem] leading-tight text-ink mb-4">{product.productName}</h1>

          <div className="flex items-baseline gap-3 mb-5">
            <span className="price text-3xl text-ink">{inr(product.price)}</span>
            {product.mrp > product.price && <span className="text-muted line-through num">{inr(product.mrp)}</span>}
            {product.savings_pct > 0 && (
              <span className="text-sm font-semibold px-2 py-0.5" style={{ color: "var(--store-primary, #1a1512)", background: "color-mix(in srgb, var(--store-primary, #1a1512) 8%, transparent)" }}>
                Save {product.savings_pct}%
              </span>
            )}
          </div>

          <div className="mb-6 text-sm">
            {product.inStock
              ? <span className="inline-flex items-center gap-1.5 text-ink-soft"><span className="w-1.5 h-1.5 rounded-full bg-emerald-600" /> In stock, ready to dispatch</span>
              : <span className="inline-flex items-center gap-1.5 font-semibold text-rose-700"><span className="w-1.5 h-1.5 rounded-full bg-rose-600" /> Out of stock</span>}
          </div>

          {product.sizes?.length > 0 && (
            <div className="mb-6">
              <div className="text-xs uppercase tracking-[0.14em] text-muted mb-2.5">Size</div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`min-w-[44px] px-3 py-2 text-sm border transition-colors ${size === s ? "border-ink bg-ink text-paper" : "border-line-strong text-ink-soft hover:border-ink"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              {needsSize && !size && <div className="text-xs text-rose-700 mt-2">Please select a size.</div>}
            </div>
          )}

          {config?.whatsapp && (product.dbName === "shoes" || product.sizes?.length > 0) && (
            <button onClick={requestSize} className="block text-xs uppercase tracking-[0.12em] text-ink-soft underline underline-offset-2 hover:text-ink mb-6">
              {product.sizes?.length ? "Can't find your size? Request it on WhatsApp" : "Request a size on WhatsApp"}
            </button>
          )}

          <div className="flex items-stretch gap-3 mb-6">
            <div className="flex items-center border border-line-strong">
              <button onClick={() => setQty((n) => Math.max(1, n - 1))} className="w-11 h-12 text-lg text-ink-soft hover:text-ink" aria-label="Decrease quantity">−</button>
              <span className="w-10 text-center num text-ink">{qty}</span>
              <button onClick={() => setQty((n) => n + 1)} className="w-11 h-12 text-lg text-ink-soft hover:text-ink" aria-label="Increase quantity">+</button>
            </div>
            <WishlistToggle product={product} />
          </div>

          {/* desktop action buttons — on mobile these live in the sticky bar below */}
          <div className="hidden md:flex flex-col sm:flex-row gap-3">
            <button onClick={handleAddToCart} disabled={!canOrder} className="btn btn-outline flex-1">
              {added ? <><Check size={16} /> Added</> : "Add to cart"}
            </button>
            <button onClick={handleBuyNow} disabled={!canOrder} className="btn btn-primary flex-1">
              Buy now
            </button>
          </div>

          {/* assurance strip */}
          <div className="mt-7 grid grid-cols-3 gap-2 border-y border-line py-5">
            <Assurance Icon={Truck} title="Fast dispatch" sub="3–5 days, pan-India" />
            <Assurance Icon={RotateCcw} title="7-day returns" sub="On unused items" />
            <Assurance Icon={ShieldCheck} title="Quality-checked" sub="Every piece" />
          </div>

          {product.productShortDescription && (
            <div className="mt-7">
              <div className="text-xs uppercase tracking-[0.14em] text-muted mb-2">Details</div>
              <p className="text-[15px] text-ink-soft whitespace-pre-line leading-relaxed" style={{ textWrap: "pretty" }}>
                {product.productShortDescription.trim()}
              </p>
            </div>
          )}
        </div>
      </div>

      {similar?.length > 0 && (
        <section className="mt-20">
          <SectionHeading>{product.inStock ? "You may also like" : "In-stock alternatives"}</SectionHeading>
          <div className="mt-2">
            <ProductRail products={similar} />
          </div>
        </section>
      )}

      {/* mobile sticky action bar — sits just above the bottom tab bar */}
      <div className="md:hidden fixed inset-x-0 z-40 bg-paper border-t border-line px-4 py-3 flex items-center gap-3" style={{ bottom: "calc(var(--mnav-h) + env(safe-area-inset-bottom))" }}>
        <div className="shrink-0">
          <div className="price text-lg text-ink leading-none">{inr(product.price)}</div>
          {needsSize && !size && <div className="text-[11px] text-rose-700 mt-0.5">Select a size</div>}
        </div>
        <button onClick={handleAddToCart} disabled={!canOrder} className="btn btn-outline flex-1 px-2">
          {added ? <><Check size={16} /> Added</> : "Add"}
        </button>
        <button onClick={handleBuyNow} disabled={!canOrder} className="btn btn-primary flex-1 px-2">
          Buy now
        </button>
      </div>
    </div>
  );
}

function Assurance({ Icon, title, sub }) {
  return (
    <div className="flex flex-col items-center text-center gap-1.5">
      <Icon size={20} strokeWidth={1.6} style={{ color: "var(--store-primary, #1a1512)" }} />
      <div className="text-[12px] font-semibold text-ink leading-none">{title}</div>
      <div className="text-[11px] text-muted leading-none">{sub}</div>
    </div>
  );
}

function WishlistToggle({ product }) {
  const wl = useWishlist();
  if (!wl) return null;
  const on = wl.has(product.dbName, product.productId);
  return (
    <button
      onClick={() => wl.toggle(product)}
      aria-label={on ? "Remove from wishlist" : "Add to wishlist"}
      className="w-12 h-12 border border-line-strong flex items-center justify-center hover:border-ink transition-colors"
      title={on ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart size={18} fill={on ? "var(--store-primary, #1a1512)" : "none"} color={on ? "var(--store-primary, #1a1512)" : "#4a4038"} strokeWidth={1.9} />
    </button>
  );
}

function ProductSkeleton() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 lg:px-6 py-10">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-14 animate-pulse">
        <div className="bg-panel" style={{ aspectRatio: "1/1" }} />
        <div className="space-y-4 pt-2">
          <div className="h-3 w-24 bg-panel" />
          <div className="h-8 w-3/4 bg-panel" />
          <div className="h-6 w-32 bg-panel" />
          <div className="h-4 w-40 bg-panel" />
          <div className="h-12 w-full bg-panel mt-6" />
          <div className="h-12 w-full bg-panel" />
        </div>
      </div>
    </div>
  );
}
