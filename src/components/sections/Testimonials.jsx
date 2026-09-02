// Flatsome [testimonials] equivalent — quote cards, 3-across on desktop.
// Props:
//   items: [{ quote, author, role, avatar (optional url), stars (1-5) }]
import React from "react";
import { Star } from "lucide-react";

export default function Testimonials({ items = [] }) {
  const valid = items.filter((t) => t && t.quote);
  if (!valid.length) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {valid.map((t, i) => (
        <figure key={i} className="reveal bg-paper border border-line p-7 flex flex-col shadow-[var(--shadow-sm)]">
          <div className="flex gap-0.5 mb-4" style={{ color: "#b8901f" }}>
            {Array.from({ length: Math.min(5, t.stars || 5) }).map((_, j) => (
              <Star key={j} size={15} fill="currentColor" strokeWidth={0} />
            ))}
          </div>
          <blockquote className="text-[15px] text-ink-soft leading-relaxed flex-1" style={{ textWrap: "pretty" }}>“{t.quote}”</blockquote>
          <figcaption className="mt-5 flex items-center gap-3">
            {t.avatar
              ? <img src={t.avatar} alt={t.author} className="w-10 h-10 rounded-full object-cover" />
              : <div className="w-10 h-10 rounded-full bg-panel flex items-center justify-center text-sm font-semibold text-muted">{(t.author || "?")[0]}</div>
            }
            <div>
              <div className="text-sm font-semibold text-ink">{t.author}</div>
              {t.role && <div className="text-xs text-muted">{t.role}</div>}
            </div>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
