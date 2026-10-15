import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "../lib/track";

// Fires a first-party page_view (with path + time-on-page) on every SPA
// navigation. Rendered inside the store router, so it only runs once the store
// is resolved and viewable (live, or a demo unlocked via preview password).
export default function RouteTracker() {
  const { pathname, search } = useLocation();
  useEffect(() => { trackPageView(pathname + search); }, [pathname, search]);
  return null;
}
