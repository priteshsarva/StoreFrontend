// Auto-sliding customer-reviews strip. Vendor pastes image URLs (screenshots of
// reviews / testimonials) in the portal; they scroll continuously here. Pauses
// on hover, loops seamlessly by duplicating the track.
import React from "react";
import SectionHeading from "./SectionHeading";

export default function ReviewsSlider({ images }) {
  const imgs = (Array.isArray(images) ? images : []).map((s) => String(s || "").trim()).filter(Boolean);
  if (!imgs.length) return null;

  // duplicate so the marquee wraps without a visible jump
  const loop = imgs.length > 1 ? [...imgs, ...imgs] : imgs;

  return (
    <section className="py-4">
      <SectionHeading eyebrow="Loved by">What our customers say</SectionHeading>
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
