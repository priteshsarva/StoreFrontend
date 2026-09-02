import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Cross-browser scroll-reveal engine (a lightweight stand-in for GSAP/ScrollTrigger
// that works in every browser — the site's CSS `animation-timeline` reveal only
// runs in Chromium). `.reveal` elements fade + rise as they enter the viewport;
// `.stagger` grids cascade their children (delay is pure CSS nth-child).
//
// It uses a throttled scroll/resize check over a `pending` set rather than an
// IntersectionObserver: IO silently misses elements that are added to the DOM at
// 0-height and grow later (async product grids swapped in after a "Loading…"
// placeholder), which left content stuck invisible. A MutationObserver enrolls
// late-added nodes; the hidden initial state is gated behind html.reveal-on, so
// with no JS / reduced-motion everything just shows.
export function useScrollReveal() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    document.documentElement.classList.add("reveal-on");

    const pending = new Set();
    const seen = new WeakSet();

    const check = () => {
      const vh = window.innerHeight;
      for (const el of pending) {
        const r = el.getBoundingClientRect();
        // reveal once its top crosses ~92% of the viewport (and it isn't above it)
        if (r.top < vh * 0.92 && r.bottom > 0) { el.classList.add("in-view"); pending.delete(el); }
      }
    };
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => { ticking = false; check(); });
    };

    const register = (el) => {
      if (seen.has(el)) return;
      seen.add(el);
      pending.add(el);
    };
    const scan = (node) => {
      if (node.nodeType !== 1) return;
      if (node.matches?.(".reveal, .stagger")) register(node);
      node.querySelectorAll?.(".reveal, .stagger").forEach(register);
    };

    scan(document.body);
    check(); // reveal whatever is already in view (no flash for above-the-fold)

    const mo = new MutationObserver((muts) => {
      for (const m of muts) for (const n of m.addedNodes) scan(n);
      check();
    });
    mo.observe(document.body, { childList: true, subtree: true });

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    // Failsafe re-scans: a MutationObserver can miss a subtree that's swapped in
    // wholesale (e.g. a "Loading…" placeholder replaced by an async product grid),
    // which would leave that grid stuck invisible. Re-scanning the DOM a few times
    // as content settles guarantees every .reveal/.stagger gets enrolled; `seen`
    // makes re-scans cheap and idempotent.
    const timers = [400, 1200, 2500].map((ms) => setTimeout(() => { scan(document.body); check(); }, ms));

    return () => {
      mo.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      timers.forEach(clearTimeout);
    };
  }, [pathname]);
}
