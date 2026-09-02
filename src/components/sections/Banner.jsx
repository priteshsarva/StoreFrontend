// Flatsome [ux_banner] equivalent — full-bleed banner with bg image/video,
// dark scrim, centered heading + subtitle + CTA button.
// Props:
//   bg (image url), video (mp4 url), overlay (0-100, default 30),
//   height ('sm' | 'md' | 'lg', default 'md'),
//   text_align ('left' | 'center' | 'right', default 'center'),
//   text_color ('light' | 'dark', default 'light'),
//   title, subtitle, cta_text, cta_link
import React from "react";
import { Link } from "react-router-dom";
import { useStore } from "../../context/StoreContext";
import { withStore } from "../../lib/tenant";

const HEIGHTS = { sm: "min-h-[320px]", md: "min-h-[460px] md:min-h-[560px]", lg: "min-h-[calc(100dvh-160px)] max-h-[760px] min-h-[520px]" };
const ALIGN_ITEMS = { left: "items-center justify-start text-left", center: "items-center justify-center text-center", right: "items-center justify-end text-right" };

export default function Banner({
  bg, video, overlay = 30, height = "md",
  text_align = "center", text_color = "light",
  title, subtitle, cta_text, cta_link,
}) {
  // fall back to site_settings.hero when any content field is blank — this is
  // what lets a preset ship with an empty banner and still show the vendor's own hero
  const { config } = useStore();
  const hero = config?.hero || {};
  bg       = bg       || hero.image_url || "";
  video    = video    || hero.video_url || "";
  title    = title    || hero.title || config?.store_name || "";
  subtitle = subtitle || hero.subtitle || "";
  cta_text = cta_text || hero.cta_text || (config?.categories?.[0] ? "Shop the collection" : "");
  cta_link = withStore(cta_link || hero.cta_link || (config?.categories?.[0] ? `/c/${encodeURIComponent(config.categories[0])}` : "/"));
  const isLight = text_color === "light";
  const media = !!(bg || video);

  return (
    <section
      className={`relative flex ${HEIGHTS[height] || HEIGHTS.md} ${ALIGN_ITEMS[text_align] || ALIGN_ITEMS.center} overflow-hidden`}
      style={{ background: "var(--store-primary, #1a1512)" }}
    >
      {/* image is the base layer; the video (when present + reachable) plays over
          it. If the video fails to load, the photo shows through — no blank panel. */}
      {bg && (
        <div className="absolute inset-0 bg-cover bg-center scale-105" style={{ backgroundImage: `url(${bg})` }} />
      )}
      {video && (
        <video autoPlay loop muted playsInline poster={bg || undefined}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}>
          <source src={video} type="video/mp4" />
        </video>
      )}
      {media && (
        <div
          className="absolute inset-0"
          style={{
            background: isLight
              ? `radial-gradient(120% 90% at 50% 20%, rgba(0,0,0,${overlay / 250}), rgba(0,0,0,${overlay / 130}) 55%, rgba(0,0,0,${Math.min(0.72, overlay / 90)}) 100%)`
              : "linear-gradient(to bottom, rgba(255,255,255,0.1), rgba(255,255,255,0.5))",
          }}
        />
      )}

      {/* graceful dissolve into the page below */}
      <div className="absolute inset-x-0 bottom-0 h-24 pointer-events-none z-[1]" style={{ background: "linear-gradient(to bottom, transparent, var(--color-paper))" }} />

      <div className={`relative z-10 max-w-3xl px-6 py-16 reveal ${isLight ? "text-white" : "text-ink"}`}>
        {config?.store_name && (
          <div className={`mb-5 text-[11px] uppercase tracking-[0.28em] font-semibold ${isLight ? "text-white/75" : "text-muted"}`}>
            {config.store_name}
          </div>
        )}
        {title && (
          <h1 className={`text-4xl md:text-6xl leading-[1.03] mb-4 ${isLight ? "text-white" : "text-ink"}`} style={{ textWrap: "balance", fontWeight: 420 }}>
            {title}
          </h1>
        )}
        {subtitle && (
          <p className={`text-base md:text-lg font-light mb-8 max-w-xl ${text_align === "center" ? "mx-auto" : ""} ${isLight ? "text-white/85" : "text-ink-soft"}`} style={{ textWrap: "pretty" }}>
            {subtitle}
          </p>
        )}
        {cta_text && cta_link && (
          <Link to={cta_link} className={`btn ${isLight ? "btn-invert" : "btn-primary"}`}>
            {cta_text}
          </Link>
        )}
      </div>
    </section>
  );
}
