// Dual-handle price range: two overlaid range sliders + two typable number
// inputs, kept in sync. Sharp-edged to match the storefront. Commits on release
// (slider) or Enter/blur (inputs) so we don't refetch on every pixel.
import React, { useEffect, useState } from "react";

export default function PriceRange({ min, max, value, onChange }) {
  const [lo, setLo] = useState(value?.[0] ?? min);
  const [hi, setHi] = useState(value?.[1] ?? max);

  // resync when the category (and thus bounds) changes under us
  useEffect(() => { setLo(value?.[0] ?? min); setHi(value?.[1] ?? max); }, [min, max, value?.[0], value?.[1]]);

  if (!(max > min)) return null;

  const clampLo = (v) => Math.min(Math.max(min, v), hi);
  const clampHi = (v) => Math.max(Math.min(max, v), lo);
  const pct = (v) => ((v - min) / (max - min)) * 100;

  const commit = (l, h) => onChange([l <= min ? null : l, h >= max ? null : h]);

  return (
    <div>
      <div className="relative h-6 flex items-center">
        {/* track */}
        <div className="absolute left-0 right-0 h-1 bg-gray-200" />
        <div className="absolute h-1" style={{ left: `${pct(lo)}%`, right: `${100 - pct(hi)}%`, background: "var(--store-primary, #111827)" }} />
        {/* two range inputs stacked; pointer-events only on thumbs */}
        <input
          type="range" min={min} max={max} value={lo}
          onChange={(e) => setLo(clampLo(Number(e.target.value)))}
          onMouseUp={() => commit(lo, hi)} onTouchEnd={() => commit(lo, hi)}
          className="pr-thumb" aria-label="Minimum price"
        />
        <input
          type="range" min={min} max={max} value={hi}
          onChange={(e) => setHi(clampHi(Number(e.target.value)))}
          onMouseUp={() => commit(lo, hi)} onTouchEnd={() => commit(lo, hi)}
          className="pr-thumb" aria-label="Maximum price"
        />
      </div>
      <div className="flex items-center gap-2 mt-3">
        <NumBox value={lo} onCommit={(v) => { const l = clampLo(v); setLo(l); commit(l, hi); }} />
        <span className="text-gray-400">–</span>
        <NumBox value={hi} onCommit={(v) => { const h = clampHi(v); setHi(h); commit(lo, h); }} />
      </div>
    </div>
  );
}

function NumBox({ value, onCommit }) {
  const [v, setV] = useState(value);
  useEffect(() => setV(value), [value]);
  return (
    <div className="flex items-center border border-gray-300 px-2 flex-1">
      <span className="text-gray-400 text-sm">₹</span>
      <input
        type="number"
        value={v}
        onChange={(e) => setV(e.target.value)}
        onBlur={() => onCommit(Number(v) || 0)}
        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); onCommit(Number(v) || 0); e.target.blur(); } }}
        className="w-full py-1.5 text-sm outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
    </div>
  );
}
