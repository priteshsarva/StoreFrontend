// Flatsome [ux_countdown] equivalent — days/hours/minutes/seconds to a target date.
// Props: until (ISO date string), title, subtitle
import React, { useEffect, useState } from "react";

function diff(target) {
  const ms = new Date(target).getTime() - Date.now();
  if (isNaN(ms) || ms <= 0) return null;
  const d = Math.floor(ms / 86400000);
  const h = Math.floor((ms % 86400000) / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return { d, h, m, s };
}

function Cell({ value, label }) {
  return (
    <div className="flex flex-col items-center min-w-[64px]">
      <div className="price text-3xl md:text-5xl" style={{ color: "var(--store-primary, #1a1512)" }}>
        {String(value).padStart(2, "0")}
      </div>
      <div className="text-[10px] uppercase tracking-[0.2em] text-muted mt-2">{label}</div>
    </div>
  );
}

export default function Countdown({ until, title, subtitle }) {
  const [t, setT] = useState(() => diff(until));
  useEffect(() => {
    if (!until) return;
    const id = setInterval(() => setT(diff(until)), 1000);
    return () => clearInterval(id);
  }, [until]);
  if (!until || !t) return null;
  return (
    <div className="text-center">
      {title && <div className="text-xl md:text-2xl mb-1 text-ink">{title}</div>}
      {subtitle && <div className="text-sm text-muted mb-6">{subtitle}</div>}
      <div className="inline-flex gap-4 md:gap-8 items-baseline">
        <Cell value={t.d} label="days" />
        <Cell value={t.h} label="hrs" />
        <Cell value={t.m} label="min" />
        <Cell value={t.s} label="sec" />
      </div>
    </div>
  );
}
