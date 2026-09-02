// Resolves which vendor this page load belongs to and loads their branding.
// Every other provider (cart, customer auth) and every page reads from here —
// this is what makes one deploy serve every vendor's storefront.
import React, { createContext, useContext, useEffect, useState } from "react";
import { resolveSlug, storeApi } from "../lib/storeApi";

const StoreCtx = createContext(null);

// --- palette helpers ----------------------------------------------------------
function hexToRgb(hex) {
  let h = String(hex || "").replace("#", "").trim();
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return null;
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}
// Item 4: text/foreground on a coloured surface is ONLY black or white, chosen
// for contrast by relative luminance (WCAG). Light surface → near-black; dark → white.
function contrastText(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) return "#ffffff";
  const [r, g, b] = rgb.map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
  const L = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return L > 0.55 ? "#111111" : "#ffffff";
}
function warm(hex) {
  const p = String(hex || "").trim().toLowerCase();
  return (p === "#000" || p === "#000000" || p === "black") ? "#1a1512" : hex;
}
// Set --store-{primary,secondary,complementary,bg} and their contrast --store-on-* vars.
function applyTheme(theme) {
  const root = document.documentElement.style;
  const set = (name, val, fallback) => {
    const v = val || fallback;
    if (!v) return;
    root.setProperty(`--store-${name}`, name === "primary" ? warm(v) : v);
    root.setProperty(`--store-on-${name}`, contrastText(name === "primary" ? warm(v) : v));
  };
  set("primary", theme?.primary);
  set("secondary", theme?.secondary);
  set("complementary", theme?.complementary);
  if (theme?.background) {
    const bg = theme.background;
    const onBg = contrastText(bg);
    root.setProperty("--store-bg", bg);
    root.setProperty("--store-on-bg", onBg);
    document.body.style.background = bg; // paint the page in the vendor's bg colour

    // Re-derive the design's text + surface tokens from the vendor's background
    // so EVERY surface (cards, panels, borders) and all body/muted text keep
    // readable contrast on that background — not just the accent elements.
    const mix = (pct) => `color-mix(in srgb, ${onBg} ${pct}%, ${bg})`;
    root.setProperty("--color-paper", bg);
    root.setProperty("--color-panel", mix(6));
    root.setProperty("--color-ink", onBg);
    root.setProperty("--color-ink-soft", mix(74));
    root.setProperty("--color-muted", mix(50));
    root.setProperty("--color-line", mix(14));
    root.setProperty("--color-line-strong", mix(26));
  }
}

export function StoreProvider({ children }) {
  const [slug] = useState(resolveSlug);
  const [config, setConfig] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | ready | not-found | error
  const api = storeApi(slug);

  function loadConfig() {
    if (!slug) { setStatus("not-found"); return; }
    api.config()
      .then((c) => { setConfig(c); setStatus("ready"); if (c.live) api.track("page_view"); })
      .catch((e) => setStatus(e.status === 404 ? "not-found" : "error"));
  }
  useEffect(loadConfig, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (config?.theme) applyTheme(config.theme);
    if (config?.store_name) {
      document.title = config.store_name;
    }
    // Analytics pixels — injected once per page load. React StrictMode
    // double-mounts everything in dev; guard with an id we can look up.
    const ga = config?.analytics?.ga4_id;
    if (ga && !document.getElementById("spp-ga4-loader")) {
      const s1 = document.createElement("script");
      s1.id = "spp-ga4-loader";
      s1.async = true;
      s1.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ga)}`;
      document.head.appendChild(s1);
      const s2 = document.createElement("script");
      s2.id = "spp-ga4-init";
      s2.text = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config',${JSON.stringify(ga)});`;
      document.head.appendChild(s2);
    }
    const meta = config?.analytics?.meta_pixel_id;
    if (meta && !document.getElementById("spp-meta-pixel")) {
      const s = document.createElement("script");
      s.id = "spp-meta-pixel";
      s.text = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init',${JSON.stringify(meta)});fbq('track','PageView');`;
      document.head.appendChild(s);
    }
  }, [config]);

  // Not-yet-live store, no valid preview token → the branded password gate
  // replaces the storefront (kept inside the provider so useStore() never nulls).
  const gated = status === "ready" && config?.preview_required;

  return (
    <StoreCtx.Provider value={{ slug, config, status, api }}>
      {gated
        ? <PreviewGate api={api} config={config} onUnlock={loadConfig} />
        : <>{config?.preview && <PreviewBanner />}{children}</>}
    </StoreCtx.Provider>
  );
}

// Persistent "not live yet" strip shown once a preview is unlocked, so nobody
// mistakes the preview copy for the live store.
function PreviewBanner() {
  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 9999,
      background: "#111", color: "#fff", textAlign: "center",
      fontSize: 13, padding: "7px 12px", letterSpacing: 0.3,
    }}>
      🔒 Preview — this store isn’t live yet. What you see is a preview copy.
    </div>
  );
}

// Shopify-style password wall for a store that isn't live yet.
function PreviewGate({ api, config, onUnlock }) {
  const [pw, setPw] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(false);
  async function submit(e) {
    e.preventDefault();
    setBusy(true); setErr(false);
    try { await api.previewUnlock(pw.trim()); onUnlock(); }
    catch { setErr(true); setBusy(false); }
  }
  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", padding: 24,
      background: "var(--store-bg, #1a1512)", color: "var(--store-on-bg, #fff)",
    }}>
      {config.logo_url
        ? <img src={config.logo_url} alt={config.store_name} style={{ height: 54, marginBottom: 18, objectFit: "contain" }} />
        : <div style={{ fontSize: 26, fontWeight: 800, marginBottom: 18 }}>{config.store_name}</div>}
      <div style={{ opacity: 0.8, marginBottom: 18, fontSize: 14 }}>This store isn’t live yet.</div>
      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 10, width: "min(320px,100%)" }}>
        <input
          type="password" value={pw} onChange={(e) => setPw(e.target.value)}
          placeholder="Enter password" autoFocus
          style={{ padding: "11px 14px", borderRadius: 10, border: err ? "1px solid #e05a5a" : "1px solid rgba(128,128,128,0.4)", fontSize: 15, background: "#fff", color: "#111" }}
        />
        {err && <div style={{ color: "#e05a5a", fontSize: 12.5 }}>Wrong password — try again.</div>}
        <button type="submit" disabled={busy || !pw.trim()} style={{
          padding: "11px 14px", borderRadius: 10, border: "none", cursor: "pointer",
          fontWeight: 700, fontSize: 15,
          background: "var(--store-primary, #111)", color: "var(--store-on-primary, #fff)",
          opacity: busy || !pw.trim() ? 0.6 : 1,
        }}>{busy ? "Checking…" : "Enter"}</button>
      </form>
    </div>
  );
}

export const useStore = () => useContext(StoreCtx);
