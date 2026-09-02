// Editorial section title — a centered serif headline over a short accent rule.
// Replaces the old hairline-flanked uppercase label with something that reads
// like a luxury catalogue spread. Optional `eyebrow` sets a small-caps kicker.
import React from "react";

export default function SectionHeading({ children, eyebrow }) {
  return (
    <div className="container mx-auto px-4 pt-14 pb-6 text-center reveal">
      {eyebrow && <div className="eyebrow mb-3">{eyebrow}</div>}
      <h2 className="text-2xl md:text-[2rem] font-normal text-ink leading-tight">{children}</h2>
      <span
        className="mt-4 inline-block h-px w-12"
        style={{ background: "var(--store-primary, #1a1512)" }}
      />
    </div>
  );
}
