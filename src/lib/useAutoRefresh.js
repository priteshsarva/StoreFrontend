import { useEffect, useState } from "react";

// A counter that ticks whenever the storefront should re-pull fresh product data:
//   • the tab becomes visible again (user switches back to it)
//   • the window regains focus
//   • a slow interval, while the tab is visible
// Add the returned value to a data-fetch effect's dependency array and the effect
// re-runs — so prices, stock, images and names update automatically after the
// backend re-scrapes, with no manual reload. Pass intervalMs = 0 to disable the
// periodic tick (e.g. on paginated pages where a reset mid-scroll is unwelcome).
export function useAutoRefresh(intervalMs = 90000) {
  const [nonce, setNonce] = useState(0);
  useEffect(() => {
    const bump = () => setNonce((n) => n + 1);
    const onVisible = () => { if (document.visibilityState === "visible") bump(); };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", bump);
    let id;
    if (intervalMs > 0) id = setInterval(() => { if (document.visibilityState === "visible") bump(); }, intervalMs);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", bump);
      if (id) clearInterval(id);
    };
  }, [intervalMs]);
  return nonce;
}
