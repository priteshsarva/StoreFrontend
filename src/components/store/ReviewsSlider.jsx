// Auto-sliding customer-reviews strip. Vendor pastes image URLs (screenshots of
// reviews / testimonials) in the portal; they scroll continuously here. Pauses
// on hover, loops seamlessly by duplicating the track.
import React from "react";

export default function ReviewsSlider({ images }) {
  const imgs = (Array.isArray(images) ? images : []).map((s) => String(s || "").trim()).filter(Boolean);
  if (!imgs.length) return null;

  // duplicate so the marquee wraps without a visible jump
  const loop = imgs.length > 1 ? [...imgs, ...imgs] : imgs;

  return (
    <section className="py-4">
      {/* explicit on-background colour so the heading always contrasts the
          store's chosen background (text-ink can wash out on some palettes) */}
      <div className="container mx-auto px-4 pt-14 pb-6 text-center reveal" style={{ color: "var(--store-on-bg, #1a1512)" }}>
        <div className="eyebrow mb-3" style={{ opacity: 0.7 }}>Loved by</div>
        <h2 className="text-2xl md:text-[2rem] font-normal leading-tight">What our customers say</h2>
        <span className="mt-4 inline-block h-px w-12" style={{ background: "var(--store-primary, #1a1512)" }} />
      </div>
      <div className="reviews-marquee group relative overflow-hidden mt-2">
        <div
          className="flex gap-5 w-max px-4 reviews-track"
          style={{ animation: imgs.length > 1 ? `reviews-scroll ${loop.length * 4}s linear infinite` : "none" }}
        >
          {loop.map((src, i) => (
            <div key={i} className="shrink-0 h-64 sm:h-72 bg-panel overflow-hidden border border-line">
              <img src={src} alt="Customer review" loading="lazy" referrerPolicy="no-referrer" className="h-full w-auto object-cover" />
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes reviews-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .reviews-marquee:hover .reviews-track { animation-play-state: paused !important; }
      `}</style>
    </section>
  );
}
