import React from "react";
import { useStore } from "../../context/StoreContext";

export default function StoreAnnouncementBar() {
  const { config } = useStore();
  if (!config?.announcement) return null;
  // repeat so the marquee fills any width and loops seamlessly (translate -50%)
  const items = Array.from({ length: 8 }, () => config.announcement);
  return (
    <div className="text-white overflow-hidden py-2 announce-bar" style={{ background: "var(--store-primary, #1a1512)" }}>
      <div className="flex w-max whitespace-nowrap announce-track" style={{ animation: "announce-scroll 30s linear infinite" }}>
        {items.map((t, i) => (
          <span key={i} className="text-[11px] sm:text-xs tracking-[0.1em] uppercase font-medium px-8">{t}</span>
        ))}
      </div>
      <style>{`
        @keyframes announce-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .announce-bar:hover .announce-track { animation-play-state: paused !important; }
      `}</style>
    </div>
  );
}
