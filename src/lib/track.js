// Behaviour analytics for the storefront — page views (with path), clicks
// (button/link labels), product impressions, and time-on-page. Everything is
// QUEUED in memory and flushed in batches via fetch(keepalive) so detailed
// tracking stays cheap on the server: ~1 request every few seconds (or on tab
// hide), one bulk insert. Safe to call anywhere; no-ops server-side when the
// store isn't viewable.
import { resolveSlug, getPreviewToken, getCustomerToken } from "./storeApi";

const BASE = import.meta.env.VITE_BASE_URL;
const FLUSH_MS = 4000;      // idle flush cadence
const MAX_QUEUE = 20;       // flush early once this many pile up

let queue = [];
let timer = null;
let listenersOn = false;
let currentPage = null;     // { path, t } for time-on-page
const seenImpressions = new Set(); // dedup: one impression per product per session/tab

function sid() {
  try {
    let id = sessionStorage.getItem("spp_sid");
    if (!id) { id = Math.random().toString(36).slice(2) + Date.now().toString(36); sessionStorage.setItem("spp_sid", id); }
    return id;
  } catch { return ""; }
}

function headers(slug) {
  const h = { "Content-Type": "application/json" };
  try { h["X-Store-Host"] = window.location.hostname.toLowerCase(); } catch { /* ssr */ }
  const pv = getPreviewToken(slug); if (pv) h["X-Preview-Token"] = pv;
  const ct = getCustomerToken(slug); if (ct) h.Authorization = `Bearer ${ct}`;
  return h;
}

export function flush() {
  if (typeof window === "undefined" || !queue.length) return;
  const slug = resolveSlug();
  if (!slug || !BASE) { queue = []; return; }
  const events = queue; queue = [];
  if (timer) { clearTimeout(timer); timer = null; }
  try {
    fetch(`${BASE}/store/${slug}/track-batch`, {
      method: "POST",
      keepalive: true,                 // survives navigation / tab close
      headers: headers(slug),
      body: JSON.stringify({ session_id: sid(), events }),
    }).catch(() => {});
  } catch { /* ignore */ }
}

function schedule() { if (!timer) timer = setTimeout(flush, FLUSH_MS); }

// Low-level: queue one event. props = { product_id, db_name, value, meta, path }
export function track(event, props = {}) {
  if (typeof window === "undefined") return;
  ensureListeners();
  let path = props.path;
  try { if (!path) path = window.location.pathname + window.location.search; } catch { /* ssr */ }
  queue.push({
    event,
    product_id: props.product_id ?? null,
    db_name: props.db_name ?? null,
    value: props.value ?? null,
    meta: props.meta || {},
    path: path || null,
    t: Date.now(),
  });
  if (queue.length >= MAX_QUEUE) flush(); else schedule();
}

// Page view + time-on-page: closes the previous page with a page_leave carrying
// how long it was open, then opens the new one.
export function trackPageView(path) {
  const now = Date.now();
  const p = path || (typeof window !== "undefined" ? window.location.pathname : "");
  if (currentPage && currentPage.path !== p) {
    track("page_leave", { path: currentPage.path, meta: { duration_ms: now - currentPage.t } });
  }
  currentPage = { path: p, t: now };
  track("page_view", { path: p });
}

// Fire the pending page_leave (on tab hide / unload) so the last page's time is
// never lost, then flush.
function closePageAndFlush() {
  if (currentPage) {
    track("page_leave", { path: currentPage.path, meta: { duration_ms: Date.now() - currentPage.t } });
    currentPage = { path: currentPage.path, t: Date.now() }; // reset so re-show doesn't double-count
  }
  flush();
}

// Shared IntersectionObserver for product impressions — "which products were
// shown". Counts a product once per session when ≥50% of its card is visible.
let io = null;
function impressionObserver() {
  if (io || typeof window === "undefined" || !("IntersectionObserver" in window)) return io;
  io = new IntersectionObserver((entries) => {
    for (const en of entries) {
      if (en.isIntersecting && en.intersectionRatio >= 0.5) {
        const el = en.target;
        const pid = el.getAttribute("data-imp-id");
        const dbn = el.getAttribute("data-imp-db");
        const key = `${dbn}:${pid}`;
        if (pid && !seenImpressions.has(key)) {
          seenImpressions.add(key);
          track("impression", { product_id: pid, db_name: dbn, meta: { name: el.getAttribute("data-imp-name") || undefined } });
        }
        io.unobserve(el);
      }
    }
  }, { threshold: [0.5] });
  return io;
}

// Call from a product card: observes the element and emits one impression when
// it's seen. Returns a cleanup fn.
export function observeImpression(el, { product_id, db_name, name } = {}) {
  if (!el || !product_id) return () => {};
  const obs = impressionObserver();
  if (!obs) return () => {};
  el.setAttribute("data-imp-id", String(product_id));
  if (db_name) el.setAttribute("data-imp-db", String(db_name));
  if (name) el.setAttribute("data-imp-name", String(name).slice(0, 120));
  obs.observe(el);
  return () => { try { obs.unobserve(el); } catch { /* gone */ } };
}

// Global click capture — records meaningful clicks (links, buttons, [data-track])
// with a human label so the admin sees "clicked Add to cart", "clicked Checkout".
function onClick(e) {
  try {
    const el = e.target && e.target.closest && e.target.closest("a, button, [role='button'], [data-track]");
    if (!el) return;
    const label =
      el.getAttribute("data-track") ||
      el.getAttribute("aria-label") ||
      (el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 80) ||
      el.tagName.toLowerCase();
    const meta = { label, tag: el.tagName.toLowerCase() };
    const href = el.getAttribute("href"); if (href) meta.href = String(href).slice(0, 300);
    track("click", { meta });
  } catch { /* never break a click */ }
}

function ensureListeners() {
  if (listenersOn || typeof window === "undefined") return;
  listenersOn = true;
  try {
    document.addEventListener("click", onClick, { capture: true, passive: true });
    document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") closePageAndFlush(); });
    window.addEventListener("pagehide", closePageAndFlush);
  } catch { /* ignore */ }
}
