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
