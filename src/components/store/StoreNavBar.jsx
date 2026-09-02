// Storefront header — announcement bar on top, main row (logo · nav · search ·
// account · cart) below, on a warm glass surface. All content is vendor-driven
// from StoreContext.
//
// Nav categories come from the vendor's curated `config.nav.items` (set in the
// portal's "Navigation & front page" panel); with none configured it falls back
// to every category the store sells. The account area shows Login when logged
// out, and the customer's name → Dashboard / Logout when logged in.
import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingBag, Menu, X, Search, User, Heart, ArrowRight, ChevronDown, LogOut } from "lucide-react";
import { useStore } from "../../context/StoreContext";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useCustomerAuth } from "../../context/CustomerAuthContext";
import { withStore } from "../../lib/tenant";
import StoreAnnouncementBar from "./StoreAnnouncementBar";
import ProductCard from "./ProductCard";

const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "");

// Curated nav items → [{ category, label }]; falls back to raw categories.
function navItemsFrom(config) {
  const items = config?.nav?.items;
  if (Array.isArray(items) && items.length) {
    return items.filter((i) => i && i.category).map((i) => ({ category: i.category, label: i.label || cap(i.category) }));
  }
  return (config?.categories || []).map((c) => ({ category: c, label: cap(c) }));
}

// Small count badge (cart / wishlist) — one accent, one shape, everywhere.
function CountBadge({ n }) {
  if (!n) return null;
  return (
    <span
      className="absolute -top-2 -right-2 text-[10px] font-bold min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center num"
      style={{ background: "var(--store-primary, #1a1512)", color: "var(--store-on-primary, #fff)" }}
    >
      {n}
    </span>
  );
}

// A top-level (primary) category link with a hover dropdown of its SECONDARY
// categories, and under each secondary category, its brands. Clicking a brand
// filters by primary + secondary + brand. Data comes from the /menu tree.
function CategoryNav({ node }) {
  const [open, setOpen] = useState(false);
  const [openSub, setOpenSub] = useState(null); // which secondary category's brands are expanded
  const subs = node.subcategories || [];
  const hasMenu = subs.length > 0;
  const base = `/c/${encodeURIComponent(node.category)}`;
  const close = () => { setOpen(false); setOpenSub(null); };
  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={close}>
      <Link to={withStore(base)} className="flex items-center gap-1 uppercase tracking-[0.12em] capitalize hover:text-ink transition-colors">
        {node.label}{hasMenu && <ChevronDown size={13} className={`transition-transform ${open ? "rotate-180" : ""}`} />}
      </Link>
      {open && hasMenu && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 z-40">
          <div className="bg-paper border border-line shadow-[var(--shadow-md)] min-w-[240px] py-2 max-h-[76vh] overflow-y-auto">
            {subs.map((sub) => {
              const brands = sub.brands || [];
              const expanded = openSub === sub.name;
              return (
                <div key={sub.name} className="py-0.5">
                  {/* secondary category: label links to the filtered listing; the
                      chevron toggles the collapsible brand list beneath it */}
                  <div className="flex items-center">
                    <Link
                      to={withStore(`${base}?cat=${encodeURIComponent(sub.name)}`)}
                      onClick={close}
                      title={sub.mapped === false ? "Not in your category map" : undefined}
                      className={`flex-1 px-4 py-1.5 text-sm font-semibold capitalize hover:bg-panel transition-colors ${sub.mapped === false ? "text-amber-600" : "text-ink"}`}
                    >
                      {sub.name}
                    </Link>
                    {brands.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setOpenSub(expanded ? null : sub.name)}
                        aria-label={expanded ? "Collapse brands" : "Expand brands"}
                        className="px-3 py-1.5 text-muted hover:text-ink"
                      >
                        <ChevronDown size={14} className={`transition-transform ${expanded ? "rotate-180" : ""}`} />
                      </button>
                    )}
                  </div>
                  {expanded && brands.map((b) => (
                    <Link
                      key={b}
                      to={withStore(`${base}?cat=${encodeURIComponent(sub.name)}&brand=${encodeURIComponent(b)}`)}
                      onClick={close}
                      className="block px-4 py-1 pl-7 text-[13px] text-ink-soft hover:bg-panel hover:text-ink transition-colors"
                    >
                      {b}
                    </Link>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// Featured sub-categories grouped under their parent category, as a hover
// dropdown labelled by the category (the "under" style).
function SubcatGroupNav({ category, label, subcats }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      {/* the label links to the real category; the chevron opens its featured sub-cats */}
      <Link to={withStore(`/c/${encodeURIComponent(category)}`)} className="flex items-center gap-1 uppercase tracking-[0.12em] capitalize hover:text-ink transition-colors">
        {label}<ChevronDown size={13} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </Link>
      {open && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 z-40">
          <div className="bg-paper border border-line shadow-[var(--shadow-md)] min-w-[200px] py-2">
            {subcats.map((s) => (
              <Link key={s.subcat} to={withStore(`/c/${encodeURIComponent(s.category)}?cat=${encodeURIComponent(s.subcat)}`)} onClick={() => setOpen(false)}
                className="block px-4 py-1.5 text-sm text-ink-soft hover:bg-panel hover:text-ink transition-colors capitalize">{s.label || s.subcat}</Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Mobile menu row: primary category with collapsible secondary categories, each
// with its own collapsible brand list.
function MobileCategory({ node, onNavigate }) {
  const [open, setOpen] = useState(false);      // is this category's sub-list expanded
  const [openSub, setOpenSub] = useState(null);
  const base = `/c/${encodeURIComponent(node.category)}`;
  const subs = node.subcategories || [];
  return (
    <li className="pt-1">
      {/* primary: label links to the category; the chevron collapses its sub-list */}
      <div className="flex items-center">
        <Link to={withStore(base)} onClick={onNavigate} className="flex-1 block py-2 uppercase tracking-[0.1em] capitalize hover:text-ink">{node.label}</Link>
        {subs.length > 0 && (
          <button type="button" onClick={() => setOpen((o) => !o)} aria-label={open ? "Collapse" : "Expand"} className="px-3 py-2 text-muted hover:text-ink">
            <ChevronDown size={16} className={`transition-transform ${open ? "rotate-180" : ""}`} />
          </button>
        )}
      </div>
      {open && subs.map((sub) => {
        const brands = sub.brands || [];
        const expanded = openSub === sub.name;
        return (
          <div key={sub.name}>
            <div className="flex items-center">
              <Link to={withStore(`${base}?cat=${encodeURIComponent(sub.name)}`)} onClick={onNavigate} title={sub.mapped === false ? "Not in your category map" : undefined} className={`flex-1 py-1.5 pl-4 text-[13px] font-semibold capitalize ${sub.mapped === false ? "text-amber-600" : "text-ink"}`}>{sub.name}</Link>
              {brands.length > 0 && (
                <button type="button" onClick={() => setOpenSub(expanded ? null : sub.name)} aria-label={expanded ? "Collapse brands" : "Expand brands"} className="px-3 py-1.5 text-muted hover:text-ink">
                  <ChevronDown size={14} className={`transition-transform ${expanded ? "rotate-180" : ""}`} />
                </button>
              )}
            </div>
            {expanded && brands.map((b) => (
              <Link key={b} to={withStore(`${base}?cat=${encodeURIComponent(sub.name)}&brand=${encodeURIComponent(b)}`)} onClick={onNavigate} className="block py-1 pl-7 text-[12.5px] text-muted hover:text-ink">{b}</Link>
            ))}
          </div>
        );
      })}
    </li>
  );
}

export default function StoreNavBar() {
  const { config, api } = useStore();
  const { count } = useCart();
  const wishlist = useWishlist();
  const auth = useCustomerAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [acctOpen, setAcctOpen] = useState(false);
  const [q, setQ] = useState("");
  const [results, setResults] = useState(null); // null = idle, [] = no results
  const debounceRef = useRef(null);

  const navItems = navItemsFrom(config); // fallback (plain category links) + labels
  const [menu, setMenu] = useState([]);  // [{ category, label, subcategories:[{name, brands:[]}] }]
  const customer = auth?.customer;
  const onHome = location.pathname === "/";

  // the whole menu tree (primary → secondary → brands) in one call
  useEffect(() => {
    let alive = true;
    api.menu().then((r) => { if (alive) setMenu(r.menu || []); }).catch(() => {});
    return () => { alive = false; };
  }, [config?.slug]); // eslint-disable-line react-hooks/exhaustive-deps

  // menu when available; else plain category links (no dropdown) from config.
  // Only show categories the vendor kept "In menu" — navItems is the curated set
  // (or every category when nothing is configured), so filter the tree to it.
  const includedCats = new Set(navItems.map((it) => it.category));
  const menuNodes = (menu.length ? menu : navItems.map((it) => ({ category: it.category, label: it.label, subcategories: [] })))
    .filter((n) => includedCats.has(n.category));

  // live search: 3+ chars, debounced 250ms — same threshold the original had
  useEffect(() => {
    if (!searchOpen) return;
    const term = q.trim();
    if (term.length < 3) { setResults(null); return; }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      api.products({ q: term, limit: 6, category: "all" }).then((r) => setResults(r.results || [])).catch(() => setResults([]));
    }, 250);
    return () => clearTimeout(debounceRef.current);
  }, [q, searchOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // close the search overlay on Escape
  useEffect(() => {
    if (!searchOpen) return;
    const onKey = (e) => e.key === "Escape" && closeSearch();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [searchOpen]);

  function submitSearch(e) {
    e?.preventDefault?.();
    if (q.trim()) { navigate(`/search?q=${encodeURIComponent(q.trim())}`); closeSearch(); }
  }
  function closeSearch() { setSearchOpen(false); setQ(""); setResults(null); }
  function doLogout() { auth?.logout(); setAcctOpen(false); setMenuOpen(false); navigate("/"); }

  const iconBtn = "text-ink-soft hover:text-ink transition-colors";

  // Menu configuration (portal "Navigation" panel):
  //   nav.layout          "single" (default) | "double" (logo-centred top row + a
  //                       second row of nav links)
  //   nav.show_categories show category dropdowns in the nav (default true)
  //   nav.show_brands     show the vendor's featured brands in the nav (default false)
  const navCfg = config?.nav || {};
  const layout = navCfg.layout === "double" ? "double" : "single";
  const showCats = navCfg.show_categories !== false;
  const showBrands = !!navCfg.show_brands;
  const showSubcats = navCfg.show_subcats !== false; // featured sub-categories, independent of the category dropdowns
  const brandNodes = (Array.isArray(navCfg.brands) ? navCfg.brands : []).filter((b) => b && b.brand);
  const subbrandNodes = (Array.isArray(navCfg.subbrands) ? navCfg.subbrands : []).filter((s) => s && s.brand && s.sub_brand);
  const subcatNodes = (Array.isArray(navCfg.subcats) ? navCfg.subcats : []).filter((s) => s && s.subcat);
  const subcatStyle = navCfg.subcat_style === "under" ? "under" : "link"; // individual links vs grouped under their category
  const customLinks = (Array.isArray(navCfg.links) ? navCfg.links : []).filter((l) => l && l.label && l.url);
  const isExternal = (u) => /^https?:\/\//i.test(u);
  const subbrandTo = (s) => withStore(`/c/${encodeURIComponent(s.category)}?brand=${encodeURIComponent(s.brand)}&sub_brand=${encodeURIComponent(`${s.brand}::${s.sub_brand}`)}`);
  const subcatTo = (s) => withStore(`/c/${encodeURIComponent(s.category)}?cat=${encodeURIComponent(s.subcat)}`);
  // featured sub-categories grouped by their parent category (for the "under" style)
  const subcatGroups = subcatNodes.reduce((acc, s) => { (acc[s.category] ||= []).push(s); return acc; }, {});

  const logo = config?.logo_url
    ? <img src={config.logo_url} alt={config.store_name} className="h-10 md:h-12 w-auto" />
    : <span className="font-display text-xl md:text-2xl tracking-tight text-ink">{config?.store_name}</span>;

  const navLinks = (
    <>
      <Link to={withStore("/")} className={`uppercase tracking-[0.12em] hover:text-ink transition-colors ${onHome ? "text-ink" : ""}`}>Home</Link>
      {showCats && menuNodes.map((node) => <CategoryNav key={node.category} node={node} />)}
      {showSubcats && subcatStyle === "link" && subcatNodes.map((s) => (
        <Link key={`${s.category}-${s.subcat}`} to={subcatTo(s)}
          className="uppercase tracking-[0.12em] hover:text-ink transition-colors capitalize">{s.label || s.subcat}</Link>
      ))}
      {showSubcats && subcatStyle === "under" && Object.entries(subcatGroups).map(([cat, subs]) => (
        <SubcatGroupNav key={cat} category={cat} label={navItems.find((i) => i.category === cat)?.label || cat} subcats={subs} />
      ))}
      {showBrands && brandNodes.map((b) => (
        <Link key={`${b.category}-${b.brand}`} to={withStore(`/c/${encodeURIComponent(b.category)}?brand=${encodeURIComponent(b.brand)}`)}
          className="uppercase tracking-[0.12em] hover:text-ink transition-colors">{b.label || b.brand}</Link>
      ))}
      {showBrands && subbrandNodes.map((s) => (
        <Link key={`${s.category}-${s.brand}-${s.sub_brand}`} to={subbrandTo(s)}
          className="uppercase tracking-[0.12em] hover:text-ink transition-colors">{s.label || s.sub_brand}</Link>
      ))}
      <Link to={withStore("/c/all")} className="uppercase tracking-[0.12em] hover:text-ink transition-colors">Shop</Link>
      {customLinks.map((l, i) => (
        isExternal(l.url)
          ? <a key={`lnk${i}`} href={l.url} target="_blank" rel="noopener noreferrer" className="uppercase tracking-[0.12em] hover:text-ink transition-colors">{l.label}</a>
          : <Link key={`lnk${i}`} to={withStore(l.url)} className="uppercase tracking-[0.12em] hover:text-ink transition-colors">{l.label}</Link>
      ))}
    </>
  );

  const utils = (
    <>
      <button onClick={() => setSearchOpen(true)} className={iconBtn} aria-label="Search">
        <Search size={20} strokeWidth={1.75} />
      </button>
      {customer ? (
        <div className="relative hidden sm:block" onMouseLeave={() => setAcctOpen(false)}>
          <button onClick={() => setAcctOpen((o) => !o)} onMouseEnter={() => setAcctOpen(true)}
            className="flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink transition-colors">
            <User size={18} strokeWidth={1.75} /> <span className="max-w-[110px] truncate">{customer.name || "Account"}</span> <ChevronDown size={13} />
          </button>
          {acctOpen && (
            <div className="absolute right-0 top-full pt-3 z-40">
              <div className="bg-paper border border-line shadow-[var(--shadow-md)] min-w-[180px] py-1.5">
                <Link to={withStore("/account")} onClick={() => setAcctOpen(false)} className="block px-4 py-2.5 text-sm text-ink-soft hover:bg-panel hover:text-ink transition-colors">Dashboard</Link>
                <Link to={withStore("/wishlist")} onClick={() => setAcctOpen(false)} className="block px-4 py-2.5 text-sm text-ink-soft hover:bg-panel hover:text-ink transition-colors">Wishlist</Link>
                <button onClick={doLogout} className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-sm text-ink-soft hover:bg-panel hover:text-ink transition-colors">
                  <LogOut size={14} /> Logout
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <Link to={withStore("/account")} className="hidden sm:flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink transition-colors">
          <User size={18} strokeWidth={1.75} /> Login
        </Link>
      )}
      <Link to={withStore("/wishlist")} className={`relative hidden sm:inline-flex ${iconBtn}`} aria-label="Wishlist">
        <Heart size={20} strokeWidth={1.75} />
        <CountBadge n={wishlist?.count} />
      </Link>
      <Link to={withStore("/cart")} className={`relative ${iconBtn}`} aria-label="Cart">
        <ShoppingBag size={20} strokeWidth={1.75} />
        <CountBadge n={count} />
      </Link>
    </>
  );

  return (
    // NOTE: the search + mobile-menu overlays are rendered as SIBLINGS of
    // <header>, not children. The header uses backdrop-blur, and a
    // backdrop-filter establishes a containing block for position:fixed
    // descendants — nesting the overlays inside would size their `fixed
    // inset-0` to the 64px header instead of the viewport (drawer collapses to
    // a strip). Keeping them outside anchors `fixed` to the viewport.
    <>
    <header
      className="sticky top-0 z-30 backdrop-blur-md border-b"
      style={{
        background: "color-mix(in srgb, var(--store-bg, #faf8f5) 85%, transparent)",
        borderColor: "color-mix(in srgb, var(--store-on-bg, #1a1512) 12%, transparent)",
      }}
    >
      <StoreAnnouncementBar />

      {layout === "double" ? (
        <>
          {/* Row 1 — logo centred, utilities on the side */}
          <div className="store-nav max-w-screen-xl mx-auto px-4 lg:px-6 h-16 md:h-20 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
            <div className="flex items-center">
              <button className="md:hidden text-ink-soft hover:text-ink" onClick={() => setMenuOpen(true)} aria-label="Open menu">
                <Menu size={22} />
              </button>
            </div>
            <Link to={withStore("/")} className="flex items-center justify-center gap-2">{logo}</Link>
            <div className="flex items-center justify-end gap-4 md:gap-5">{utils}</div>
          </div>
          {/* Row 2 — nav links (categories and/or brands) */}
          <div className="hidden md:block border-t" style={{ borderColor: "color-mix(in srgb, var(--store-on-bg, #1a1512) 10%, transparent)" }}>
            <nav className="max-w-screen-xl mx-auto px-4 lg:px-6 h-12 flex items-center justify-center gap-8 text-[13px] font-medium text-ink-soft">
              {navLinks}
            </nav>
          </div>
        </>
      ) : (
        <div className="store-nav max-w-screen-xl mx-auto px-4 lg:px-6 h-16 md:h-20 flex items-center gap-4">
          <button className="md:hidden text-ink-soft hover:text-ink" onClick={() => setMenuOpen(true)} aria-label="Open menu">
            <Menu size={22} />
          </button>
          <Link to={withStore("/")} className="flex items-center gap-2 shrink-0">{logo}</Link>
          <nav className="hidden md:flex flex-1 items-center justify-center gap-8 text-[13px] font-medium text-ink-soft">
            {navLinks}
          </nav>
          <div className="ml-auto flex items-center gap-4 md:gap-5">{utils}</div>
        </div>
      )}
    </header>

      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-sm" onClick={closeSearch}>
          <div className="bg-paper shadow-[var(--shadow-lg)] max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="max-w-screen-md mx-auto px-4 py-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg text-ink">Search {config?.store_name}</h2>
                <button onClick={closeSearch} aria-label="Close search" className="text-ink-soft hover:text-ink"><X size={20} /></button>
              </div>
              <form onSubmit={submitSearch} className="relative mb-5">
                <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  autoFocus
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search products…"
                  className="w-full pl-11 pr-4 py-3 text-sm border border-line-strong bg-paper text-ink placeholder:text-muted focus:outline-none focus:border-ink transition-colors"
                />
              </form>

              {q.trim().length < 3 && (
                <p className="text-center text-sm text-muted mt-4">Type at least 3 characters to see results.</p>
              )}
              {q.trim().length >= 3 && results === null && (
                <p className="text-center text-sm text-muted mt-4">Searching…</p>
              )}
              {q.trim().length >= 3 && results && results.length === 0 && (
                <p className="text-center text-sm text-ink-soft mt-4">No products match “{q.trim()}”.</p>
              )}
              {results && results.length > 0 && (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                    {results.map((p) => (
                      <div key={`${p.dbName}-${p.productId}`} onClick={closeSearch}>
                        <ProductCard product={p} />
                      </div>
                    ))}
                  </div>
                  <button onClick={submitSearch} className="btn btn-primary w-full mt-6">
                    View all results <ArrowRight size={15} />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {menuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
          <div className="absolute top-0 left-0 h-full w-72 bg-paper p-5 overflow-y-auto shadow-[var(--shadow-lg)]">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-line">
              <span className="font-display text-lg text-ink">{config?.store_name}</span>
              <button onClick={() => setMenuOpen(false)} aria-label="Close menu" className="text-ink-soft hover:text-ink"><X size={20} /></button>
            </div>
            <ul className="flex flex-col gap-1 text-sm text-ink-soft">
              <li><Link to={withStore("/")} onClick={() => setMenuOpen(false)} className="block py-2.5 uppercase tracking-[0.1em] hover:text-ink">Home</Link></li>
              {/* Primary category → secondary categories → brands, collapsible */}
              {showCats && menuNodes.map((node) => (
                <MobileCategory key={node.category} node={node} onNavigate={() => setMenuOpen(false)} />
              ))}
              {showSubcats && subcatNodes.map((s) => (
                <li key={`${s.category}-${s.subcat}`}>
                  <Link to={subcatTo(s)} onClick={() => setMenuOpen(false)} className="block py-2 uppercase tracking-[0.1em] capitalize hover:text-ink">{s.label || s.subcat}</Link>
                </li>
              ))}
              {showBrands && brandNodes.map((b) => (
                <li key={`${b.category}-${b.brand}`}>
                  <Link to={withStore(`/c/${encodeURIComponent(b.category)}?brand=${encodeURIComponent(b.brand)}`)} onClick={() => setMenuOpen(false)} className="block py-2 uppercase tracking-[0.1em] hover:text-ink">{b.label || b.brand}</Link>
                </li>
              ))}
              {showBrands && subbrandNodes.map((s) => (
                <li key={`${s.category}-${s.brand}-${s.sub_brand}`}>
                  <Link to={subbrandTo(s)} onClick={() => setMenuOpen(false)} className="block py-2 uppercase tracking-[0.1em] hover:text-ink">{s.label || s.sub_brand}</Link>
                </li>
              ))}
              <li><Link to={withStore("/c/all")} onClick={() => setMenuOpen(false)} className="block py-2.5 uppercase tracking-[0.1em] hover:text-ink">Shop</Link></li>
              {customLinks.map((l, i) => (
                <li key={`mlnk${i}`}>
                  {isExternal(l.url)
                    ? <a href={l.url} target="_blank" rel="noopener noreferrer" onClick={() => setMenuOpen(false)} className="block py-2.5 uppercase tracking-[0.1em] hover:text-ink">{l.label}</a>
                    : <Link to={withStore(l.url)} onClick={() => setMenuOpen(false)} className="block py-2.5 uppercase tracking-[0.1em] hover:text-ink">{l.label}</Link>}
                </li>
              ))}
              <li className="border-t border-line mt-3 pt-3">
                {customer ? (
                  <>
                    <Link to={withStore("/account")} onClick={() => setMenuOpen(false)} className="block py-2.5 uppercase tracking-[0.1em] hover:text-ink">Dashboard</Link>
                    <Link to={withStore("/wishlist")} onClick={() => setMenuOpen(false)} className="block py-2.5 uppercase tracking-[0.1em] hover:text-ink">Wishlist</Link>
                    <Link to={withStore("/cart")} onClick={() => setMenuOpen(false)} className="block py-2.5 uppercase tracking-[0.1em] hover:text-ink">Cart</Link>
                    <button onClick={doLogout} className="block w-full text-left py-2.5 uppercase tracking-[0.1em] text-ink-soft hover:text-ink">Logout</button>
                  </>
                ) : (
                  <>
                    <Link to={withStore("/account")} onClick={() => setMenuOpen(false)} className="block py-2.5 uppercase tracking-[0.1em] hover:text-ink">Login</Link>
                    <Link to={withStore("/wishlist")} onClick={() => setMenuOpen(false)} className="block py-2.5 uppercase tracking-[0.1em] hover:text-ink">Wishlist</Link>
                    <Link to={withStore("/cart")} onClick={() => setMenuOpen(false)} className="block py-2.5 uppercase tracking-[0.1em] hover:text-ink">Cart</Link>
                  </>
                )}
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
