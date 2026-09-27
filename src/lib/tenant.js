import { resolveSlug, isQueryTenantHost } from "./storeApi";

// Where the tenant lives in ?store=<slug> (local dev + shared preview hosts like
// *.netlify.app), a bare href like /p/watches/1 loses it — so a refresh, a
// "copy link address", or open-in-new-tab would land on "no store". Append the
// param to every link target on those hosts so the tenant always survives. On a
// real per-store domain the subdomain carries the tenant — return path untouched.
export function withStore(path) {
  if (typeof window === "undefined" || !isQueryTenantHost()) return path;
  const slug = resolveSlug();
  if (!slug) return path;
  return `${path}${path.includes("?") ? "&" : "?"}store=${encodeURIComponent(slug)}`;
}

// Categories a home layout should feature: the vendor's "on home" selection from
// the portal Navigation panel (config.nav.items, in their order), falling back to
// every category the store sells when they haven't curated any. Every home layout
// uses this so the "show on home" toggle works on all of them, not just the default.
export function homeCategories(config) {
  const items = config?.nav?.items;
  if (Array.isArray(items) && items.length) {
    const picked = items.filter((i) => i && i.category && i.on_home !== false).map((i) => i.category);
    if (picked.length) return picked;
  }
  return config?.categories || [];
}
