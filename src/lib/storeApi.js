// API client for the hosted, multi-tenant storefront — /store/:slug/* on the
// scraper backend. Tenant is resolved once per page load, never guessed per call.
const BASE = import.meta.env.VITE_BASE_URL;

// Production: subdomain (aquawatch.platform.com -> "aquawatch") — or a full
// custom_domain match handled server-side by resolveStore.
// Local dev (no wildcard DNS): ?store=slug, or VITE_DEV_STORE, and we cache
// the resolved slug in sessionStorage so an internal <Link to="/"> (which
// drops the query param under BrowserRouter) or a hard refresh keeps the
// tenant across the same tab.
const SESSION_KEY = "spp_resolved_slug";
const cacheGet = () => { try { return localStorage.getItem(SESSION_KEY) || ""; } catch { return ""; } };
const cacheSet = (s) => { try { localStorage.setItem(SESSION_KEY, s); } catch { /* private mode */ } };

// Hosts where the tenant is carried by ?store=<slug>, NOT by a per-store
// subdomain: local dev, and shared preview hosts (Netlify/Vercel/CF Pages temp
// domains) where every store shares one hostname. On a real per-store domain the
// subdomain IS the store, so this is false and we read the subdomain instead.
export function isQueryTenantHost(host) {
  const h = String(host ?? (typeof window !== "undefined" ? window.location.hostname : "")).toLowerCase();
  return h === "localhost" || h === "127.0.0.1" || /^\d+\.\d+\.\d+\.\d+$/.test(h)
    || /\.netlify\.app$/.test(h) || /\.vercel\.app$/.test(h) || /\.pages\.dev$/.test(h);
}

export function resolveSlug() {
  const fromQuery = new URLSearchParams(window.location.search).get("store");
  if (fromQuery) { const s = fromQuery.toLowerCase(); cacheSet(s); return s; }

  // Shared/preview host (or dev): the ?store= param may have been dropped by an
  // internal navigation or a hard refresh, so fall back to the cached slug
  // (persisted in localStorage → survives refresh AND new tabs), then the dev
  // default. withStore() keeps the param on links so this is only a safety net.
  if (isQueryTenantHost()) {
    return (cacheGet() || import.meta.env.VITE_DEV_STORE || "").toLowerCase();
  }

  // real per-store domain: the subdomain is the store.
  const sub = window.location.hostname.split(".")[0].toLowerCase();
  cacheSet(sub);
  return sub;
}

const tokenKey = (slug) => `spp_customer_token:${slug}`;
export const getCustomerToken = (slug) => localStorage.getItem(tokenKey(slug)) || "";
export const setCustomerToken = (slug, t) =>
  t ? localStorage.setItem(tokenKey(slug), t) : localStorage.removeItem(tokenKey(slug));

// Preview token — proves the visitor entered the store's preview password, so a
// not-yet-live store renders. Kept per-slug like the customer token.
// Anonymous per-tab id so analytics can count sessions and conversion without
// any cookie/tracker (survives navigations within the tab, resets on tab close).
function sessionId() {
  try {
    let id = sessionStorage.getItem("spp_sid");
    if (!id) { id = Math.random().toString(36).slice(2) + Date.now().toString(36); sessionStorage.setItem("spp_sid", id); }
    return id;
  } catch { return ""; }
}

const previewKey = (slug) => `spp_preview_token:${slug}`;
export const getPreviewToken = (slug) => localStorage.getItem(previewKey(slug)) || "";
export const setPreviewToken = (slug, t) =>
  t ? localStorage.setItem(previewKey(slug), t) : localStorage.removeItem(previewKey(slug));

// Sent on every /store/* call so the server can match a **custom domain**
// (e.g. aquawatch.com) against enrollments.custom_domain when the URL segment
// slug doesn't happen to match the hostname's first label. Cheap and always-on.
function currentHost() {
  return typeof window !== "undefined" ? window.location.hostname.toLowerCase() : "";
}

async function req(slug, path, { method = "GET", body, auth = false } = {}) {
  const headers = { "Content-Type": "application/json", "X-Store-Host": currentHost() };
  if (auth) {
    const t = getCustomerToken(slug);
    if (t) headers.Authorization = `Bearer ${t}`;
  }
  const pv = getPreviewToken(slug);
  if (pv) headers["X-Preview-Token"] = pv;
  const res = await fetch(`${BASE}/store/${slug}${path}`, {
    method, headers, body: body ? JSON.stringify(body) : undefined,
  });
  let data = null;
  try { data = await res.json(); } catch { /* empty body */ }
  if (!res.ok) {
    const err = new Error((data && data.error) || `HTTP ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return data;
}

export const storeApi = (slug) => ({
  config: () => req(slug, "/config"),
  // Hide OOS by default across every listing (home rails, category page, search,
  // similar items). A caller can override with { stock: "any" } to see everything,
  // or { stock: "out" } to see only OOS.
  products: (params = {}) => {
    const p = { stock: "in", ...params };
    if (p.stock === "any") delete p.stock;
    return req(slug, `/products?${new URLSearchParams(p)}`);
  },
  facets: (params = {}) => req(slug, `/facets?${new URLSearchParams(params)}`),
  // sub-categories (the vendor's canonical category-map names) for one parent category
  subcategories: (category) => req(slug, `/subcategories?category=${encodeURIComponent(category)}`),
  // full menu tree: primary → secondary categories → brands (one call)
  menu: () => req(slug, "/menu"),
  product: (dbName, id) => req(slug, `/products/${dbName}/${id}`),
  // triggers a background re-scrape server-side; returns only a status, never
  // product data (so supplier cost/URL never reach the browser).
  refreshProduct: (dbName, id) => req(slug, `/products/${dbName}/${id}/refresh`, { method: "POST" }),

  // First-party analytics beacon — fire-and-forget, never blocks or throws.
  track: (event, extra = {}) =>
    req(slug, "/track", { method: "POST", body: { event, session_id: sessionId(), ...extra } }).catch(() => {}),

  // preview gate: exchange the shareable password for a token that unlocks a
  // not-yet-live store. Persists the token so the unlock survives navigation.
  previewUnlock: async (password) => {
    const r = await req(slug, "/preview-unlock", { method: "POST", body: { password } });
    if (r.token) setPreviewToken(slug, r.token);
    return r;
  },

  signup: (body) => req(slug, "/auth/signup", { method: "POST", body }),
  login: (body) => req(slug, "/auth/login", { method: "POST", body }),
  me: () => req(slug, "/me", { auth: true }),
  addAddress: (body) => req(slug, "/me/addresses", { method: "POST", body, auth: true }),
  updateAddress: (id, body) => req(slug, `/me/addresses/${id}`, { method: "PUT", body, auth: true }),
  deleteAddress: (id) => req(slug, `/me/addresses/${id}`, { method: "DELETE", auth: true }),

  // auth:true attaches the customer token when logged in, but the backend allows
  // guest checkout too — omitting the header (not logged in) is not an error.
  createOrder: (body) => req(slug, "/orders", { method: "POST", body, auth: true }),
  myOrders: () => req(slug, "/me/orders", { auth: true }),
  myOrder: (orderNo) => req(slug, `/me/orders/${orderNo}`, { auth: true }),
});
