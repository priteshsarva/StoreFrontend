// Fixed bottom tab bar for mobile — quick reach to the store's key destinations.
// Hidden on md+ (the top nav covers desktop). Cart/wishlist show live count
// badges. The active tab is highlighted by the current route.
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, LayoutGrid, Heart, ShoppingBag, User } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { withStore } from "../../lib/tenant";

export default function MobileBottomNav() {
  const { pathname } = useLocation();
  const { count } = useCart();
  const wishlist = useWishlist();

  const items = [
    { to: "/", icon: Home, label: "Home", match: (p) => p === "/" },
    { to: "/c/all", icon: LayoutGrid, label: "Shop", match: (p) => p.startsWith("/c/") || p.startsWith("/p/") },
    { to: "/wishlist", icon: Heart, label: "Wishlist", match: (p) => p === "/wishlist", badge: wishlist?.count },
    { to: "/cart", icon: ShoppingBag, label: "Cart", match: (p) => p === "/cart", badge: count },
    { to: "/account", icon: User, label: "Account", match: (p) => p === "/account" },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-40 flex items-stretch border-t"
      style={{
        // an ELEVATED surface (page bg tinted toward its own contrast colour) so
        // the bar is always distinct from the page — critical on dark themes where
        // a plain --store-bg bar just vanished. Plus a soft lift shadow.
        background: "color-mix(in srgb, var(--store-on-bg, #1a1512) 6%, var(--store-bg, #faf8f5))",
        borderColor: "color-mix(in srgb, var(--store-on-bg, #1a1512) 14%, transparent)",
        boxShadow: "0 -6px 20px color-mix(in srgb, var(--store-on-bg, #000) 12%, transparent)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
      aria-label="Primary"
    >
      {items.map(({ to, icon: Icon, label, match, badge }) => {
        const active = match(pathname);
        return (
          <Link
            key={to}
            to={withStore(to)}
            className="flex-1 flex flex-col items-center justify-center gap-1 pt-1.5 pb-2 text-[10px] tracking-wide"
            aria-current={active ? "page" : undefined}
            style={{ color: "var(--store-on-bg, #1a1512)", opacity: active ? 1 : 0.6 }}
          >
            {/* active tab = a filled brand chip around the icon. --store-on-primary
                is contrast-computed, so the icon stays legible on ANY brand colour. */}
            <span
              className="relative flex items-center justify-center rounded-full transition-all"
              style={{
                width: 44, height: 30,
                background: active ? "var(--store-primary, #1a1512)" : "transparent",
                color: active ? "var(--store-on-primary, #fff)" : "inherit",
              }}
            >
              <Icon size={20} strokeWidth={active ? 2.3 : 1.8} />
              {badge > 0 && (
                <span
                  className="absolute -top-1 -right-0.5 min-w-[15px] h-[15px] px-1 rounded-full text-[9px] font-bold flex items-center justify-center num"
                  style={{
                    background: "var(--store-primary, #1a1512)",
                    color: "var(--store-on-primary, #fff)",
                    boxShadow: "0 0 0 2px color-mix(in srgb, var(--store-on-bg, #1a1512) 6%, var(--store-bg, #fff))",
                  }}
                >
                  {badge}
                </span>
              )}
            </span>
            <span style={{ fontWeight: active ? 700 : 500 }}>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
