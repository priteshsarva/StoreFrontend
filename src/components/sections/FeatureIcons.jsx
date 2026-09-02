// Flatsome [featured_box] row — icon + title + text, N across.
// Perfect for the "Free shipping / Secure payments / 7-day returns / Support"
// strip that sits above the footer on nearly every commerce site.
// Props:
//   items: [{ icon (name string, whitelisted below), title, text }]
//   columns (2|3|4, default 4)
//
// ponytail: whitelisted icon map instead of `import * as Icons`. The star
// import blocks tree-shaking and pulled ~800KB of unused SVGs into the bundle.
// Add more icons by importing them into the whitelist below.
import React from "react";
import {
  Truck, ShieldCheck, RotateCcw, Headphones, Package, Award, Gift,
  Heart, Star, Clock, MessageCircle, Lock, ThumbsUp, Zap, Tag,
} from "lucide-react";

const ICONS = {
  Truck, ShieldCheck, RotateCcw, Headphones, Package, Award, Gift,
  Heart, Star, Clock, MessageCircle, Lock, ThumbsUp, Zap, Tag,
};

export default function FeatureIcons({ items = [], columns = 4 }) {
  const valid = items.filter((i) => i && i.title);
  if (!valid.length) return null;
  const colClass = columns === 2 ? "sm:grid-cols-2" : columns === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2 md:grid-cols-4";

  return (
    <div className={`grid grid-cols-1 ${colClass} gap-8`}>
      {valid.map((item, i) => {
        const Icon = ICONS[item.icon] || Package;
        return (
          <div key={i} className="flex flex-col items-center text-center px-2">
            <div
              className="mb-4 flex items-center justify-center w-14 h-14 rounded-full bg-paper border border-line-strong transition-colors duration-300"
              style={{ color: "var(--store-primary, #1a1512)" }}
            >
              <Icon size={22} strokeWidth={1.6} />
            </div>
            <h4 className="text-ink mb-1 text-[15px]" style={{ fontWeight: 500 }}>{item.title}</h4>
            {item.text && <p className="text-[13px] text-muted max-w-[220px] leading-relaxed">{item.text}</p>}
          </div>
        );
      })}
    </div>
  );
}
