import React from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useWishlist } from "../../context/WishlistContext";
import { useStore } from "../../context/StoreContext";
import { inr } from "../../lib/money";
import { withStore } from "../../lib/tenant";

export default function ProductCard({ product }) {
  const wl = useWishlist();
  const { config } = useStore();
  const wishlisted = wl?.has(product.dbName, product.productId);
  const isShoe = product.dbName === "shoes";
  const sizes = Array.isArray(product.sizes) ? product.sizes : [];

  function onHeartClick(e) {
    // don't navigate to the PDP when the buyer clicks the heart on a card
    e.preventDefault();
    e.stopPropagation();
    wl?.toggle(product);
  }

  // Ask the vendor for a size (or a size not listed) over WhatsApp — the same
  // WhatsApp-first flow the rest of the store uses. Includes a link to the PDP.
  function onRequestSize(e) {
    e.preventDefault();
    e.stopPropagation();
    const phone = String(config?.whatsapp || "").replace(/[^\d]/g, "");
    const link = `${window.location.origin}${withStore(`/p/${product.dbName}/${product.productId}`)}`;
    const text = `Hi ${config?.store_name || ""}, I'd like to request a size for "${product.productName}".\n${link}`;
    window.open(`https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(text)}`, "_blank", "noopener");
  }

  return (
    <Link to={withStore(`/p/${product.dbName}/${product.productId}`)} target="_blank" rel="noopener noreferrer" className="group block">
      <div className="relative overflow-hidden bg-panel" style={{ aspectRatio: "1/1" }}>
        {product.thumbnail
          ? <img src={product.thumbnail} alt={product.productName} loading="lazy" className={`w-full h-full object-cover transition duration-700 ease-out group-hover:scale-[1.06] ${!product.inStock ? "opacity-70" : ""}`} />
          : <div className="w-full h-full flex items-center justify-center text-muted text-xs">No image</div>}

        {product.savings_pct > 0 && (
          <span
            className="absolute top-3 left-3 text-[10px] font-semibold tracking-wide px-2 py-1 num"
            style={{ background: "var(--store-primary, #1a1512)", color: "var(--store-on-primary, #fff)" }}
          >
            −{product.savings_pct}%
          </span>
        )}
        {!product.inStock && (
          <span className="absolute top-3 right-3 bg-black/70 text-white text-[10px] uppercase tracking-[0.1em] px-2 py-1">Sold out</span>
        )}

        {/* soft reveal scrim so the heart is legible over any image */}
        {wl && (
          <>
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-ink/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <button
              onClick={onHeartClick}
              aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
              className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-paper/95 shadow-[var(--shadow-sm)] flex items-center justify-center opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all duration-300 hover:scale-105"
              style={wishlisted ? { opacity: 1 } : undefined}
            >
              <Heart
                size={16}
                fill={wishlisted ? "var(--store-primary, #1a1512)" : "none"}
                color={wishlisted ? "var(--store-primary, #1a1512)" : "var(--color-ink, #4a4038)"}
                strokeWidth={1.9}
              />
            </button>
          </>
        )}
      </div>

      <div className="pt-4 pb-1 text-center">
        {product.productBrand && (
          <div className="text-[10px] uppercase tracking-[0.16em] text-muted truncate px-2">{product.productBrand}</div>
        )}
        <h3 className="text-[13px] leading-snug text-ink-soft line-clamp-2 mt-1.5 min-h-[34px] px-1 group-hover:text-ink transition-colors">
          {product.productName}
        </h3>
        <div className="flex items-baseline justify-center gap-2 mt-2.5">
          {product.mrp > product.price && (
            <span className="text-xs text-muted line-through num">{inr(product.mrp)}</span>
          )}
          <span className="price text-[16px] text-ink">{inr(product.price)}</span>
        </div>

        {/* Shoes: show available sizes on the card + a WhatsApp "request size" */}
        {isShoe && (
          <div className="mt-2.5 px-1">
            {sizes.length > 0 && (
              <div className="flex flex-wrap justify-center gap-1 mb-1.5">
                {sizes.slice(0, 8).map((s) => (
                  <span key={s} className="text-[10px] leading-none border border-line px-1.5 py-1 text-ink-soft num">{s}</span>
                ))}
              </div>
            )}
            {config?.whatsapp && (
              <button
                onClick={onRequestSize}
                className="text-[11px] uppercase tracking-[0.1em] text-ink-soft underline underline-offset-2 hover:text-ink transition-colors"
              >
                {sizes.length ? "Request another size" : "Request size"}
              </button>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
