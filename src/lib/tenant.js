import { resolveSlug } from "./storeApi";

// In local dev the tenant lives in ?store=<slug>; a bare href like /p/watches/1
// loses it, so a right-click "copy link address" would yield an unshareable URL.
// Append the param to link targets in dev so every copied href resolves. In
// production the subdomain carries the tenant — return the path untouched.
export function withStore(path) {
  const host = typeof window !== "undefined" ? window.location.hostname : "";
  const isLocal = host === "localhost" || host === "127.0.0.1" || /^\d+\.\d+\.\d+\.\d+$/.test(host);
  if (!isLocal) return path;
  const slug = resolveSlug();
  if (!slug) return path;
  return `${path}${path.includes("?") ? "&" : "?"}store=${encodeURIComponent(slug)}`;
}
