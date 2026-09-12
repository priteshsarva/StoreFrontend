// Storefront hero. Two layouts, picked by the vendor (hero.layout):
//   "split"    — modern landing split: text + dual CTA on the left, a framed
//                media panel on the right, on a light (paper) background.
//   default    — the original full-bleed overlay hero (video/image + centered
//                text), the site's signature.
// Media priority in both: hero video → hero image → solid brand-colour panel.
import React from "react";
import { Link } from "react-router-dom";
import { useStore } from "../../context/StoreContext";
import { withStore } from "../../lib/tenant";
import { videoEmbed } from "../../lib/videoEmbed";

export default function StoreHero() {
  const { config } = useStore();
  const hero = config?.hero || {};
  const video = videoEmbed(hero.video_url);
  const hasVideo = !!video;
  const hasImage = !!hero.image_url;
  const firstCat = config?.categories?.[0];
  const media = hasVideo || hasImage;

  const cta = hero.cta_text || (firstCat ? "Shop the collection" : "");
  const ctaLink = withStore(hero.cta_link || (firstCat ? `/c/${encodeURIComponent(firstCat)}` : "/"));

  if (hero.layout === "split") {
    return <SplitHero config={config} hero={hero} video={video} hasVideo={hasVideo} hasImage={hasImage} media={media} cta={cta} ctaLink={ctaLink} />;
  }

  // heights mirror the original's calc(100vh - header) full-bleed feel
  const heightCls = "h-[calc(100dvh-160px)] min-h-[420px] max-h-[760px]";

  return (
    <section className={`relative w-full overflow-hidden ${heightCls}`} style={{ background: "var(--store-primary, #1a1512)" }}>
      {/* image is the base layer; video plays over it when reachable, else the
          photo shows through instead of a blank brand panel */}
      {hasImage && (
        <div className="absolute inset-0 bg-cover bg-center scale-105" style={{ backgroundImage: `url(${hero.image_url})` }} />
      )}
      {hasVideo && video.kind === "file" && (
        // inline cover as well as the utilities — guarantees a full-bleed fill on
        // both axes even if a production CSS purge drops object-cover on <video>.
        <video autoPlay loop muted playsInline poster={hero.image_url || undefined}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}>
          <source src={video.src} />
        </video>
      )}
      {hasVideo && video.kind === "embed" && (
        // YouTube/Vimeo background: an oversized iframe centred so a 16:9 video
        // covers the hero box without letterboxing; no controls, no interaction.
        // Overscanned to ~1.4x cover so the YouTube title/channel bar (top) and
        // any caption/branding (bottom) spill outside the visible box.
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <iframe
            src={video.src}
            title=""
            aria-hidden="true"
            tabIndex={-1}
            allow="autoplay; encrypted-media; picture-in-picture"
            frameBorder="0"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[max(140%,249vh)] h-[max(140%,78.75vw)]"
          />
        </div>
      )}

      {/* Directional scrim — heavier at the base where the text sits, with a
          soft vignette. Reads far cleaner over video/photo than a flat wash. */}
      {media && (
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(120% 90% at 50% 15%, rgba(0,0,0,0.05), rgba(0,0,0,0.35) 55%, rgba(0,0,0,0.68) 100%)" }}
        />
      )}
      {/* graceful dissolve into the page below */}
      <div className="absolute inset-x-0 bottom-0 h-28 pointer-events-none" style={{ background: "linear-gradient(to bottom, transparent, var(--color-paper))" }} />

      {(hero.title || hero.subtitle || cta) && (
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white px-6">
          <div className="reveal max-w-3xl">
            {hero.subtitle && (
              <div className="mb-5 text-[11px] uppercase tracking-[0.28em] font-semibold text-white/75">
                {config?.store_name}
              </div>
            )}
            {hero.title && (
              <h1 className="text-4xl md:text-6xl lg:text-7xl leading-[1.02] mb-5 text-white" style={{ textWrap: "balance", fontWeight: 420 }}>
                {hero.title}
              </h1>
            )}
            {hero.subtitle && (
              <p className="text-base md:text-lg font-light text-white/85 mb-9 max-w-xl mx-auto leading-relaxed" style={{ textWrap: "pretty" }}>
                {hero.subtitle}
              </p>
            )}
            {cta && (
              <Link to={ctaLink} className="btn btn-invert">
                {cta}
              </Link>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

// Split landing hero: copy + dual CTA on the left, a framed media panel on the
// right. Light background, reads as a modern product-landing header.
function SplitHero({ config, hero, video, hasVideo, hasImage, media, cta, ctaLink }) {
  const title = hero.title || config?.store_name || "Welcome";
  const firstCat = config?.categories?.[0];
  const browseLink = withStore(firstCat ? `/c/all` : "/");

  return (
    <section className="relative w-full overflow-hidden" style={{ background: "var(--color-paper, #fff)" }}>
      <div className="container mx-auto px-4 lg:px-6 py-14 md:py-20">
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-10 xl:gap-16 items-center">
          {/* copy */}
          <div className="reveal xl:col-span-2">
            <div className="eyebrow mb-4" style={{ color: "var(--store-primary, #1a1512)", opacity: 0.85 }}>
              {config?.store_name || "Collection"}
            </div>
            <h1 className="text-4xl md:text-5xl leading-[1.05] mb-5 text-ink" style={{ textWrap: "balance", fontWeight: 440 }}>
              {title}
            </h1>
            {hero.subtitle && (
              <p className="text-base md:text-lg text-ink-soft font-light leading-relaxed mb-8 max-w-xl" style={{ textWrap: "pretty" }}>
                {hero.subtitle}
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-3">
              {cta && <Link to={ctaLink} className="btn btn-primary">{cta}</Link>}
              <Link to={browseLink} className="btn btn-outline">Browse catalogue</Link>
            </div>
          </div>

          {/* framed media */}
          <div className="reveal xl:col-span-3">
            <div className="w-full aspect-video rounded-xl overflow-hidden border border-line bg-panel" style={{ background: media ? undefined : "var(--store-primary, #1a1512)" }}>
              {hasVideo && video.kind === "file" && (
                <video autoPlay loop muted playsInline poster={hero.image_url || undefined} className="w-full h-full object-cover">
                  <source src={video.src} />
                </video>
              )}
              {hasVideo && video.kind === "embed" && (
                <iframe src={video.src} title="" aria-hidden="true" tabIndex={-1} allow="autoplay; encrypted-media; picture-in-picture" frameBorder="0"
                  className="w-full h-full pointer-events-none" style={{ border: "none" }} />
              )}
              {!hasVideo && hasImage && (
                <img src={hero.image_url} alt={config?.store_name || ""} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
