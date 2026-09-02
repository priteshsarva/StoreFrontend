// Editorial section title — a serif headline over a short accent rule, matching
// the storefront's SectionHeading so the section-builder home and the original
// layout read as one design. Optional `sub` renders a small-caps eyebrow above.
// Props:
//   text (string, required) — the heading text
//   size ('sm' | 'md' | 'lg', default 'md')
//   align ('left' | 'center' | 'right', default 'center')
//   sub  (optional eyebrow above the title)
import React from "react";

const SIZES = { sm: "text-xl md:text-2xl", md: "text-2xl md:text-[2rem]", lg: "text-3xl md:text-5xl" };

export default function SectionTitle({ text, size = "md", align = "center", sub }) {
  const alignCls = align === "left" ? "text-left items-start" : align === "right" ? "text-right items-end" : "text-center items-center";
  return (
    <div className={`mb-10 flex flex-col ${alignCls}`}>
      {sub && <div className="eyebrow mb-3">{sub}</div>}
      <h2 className={`${SIZES[size] || SIZES.md} text-ink leading-tight`}>{text}</h2>
      <span className="mt-4 inline-block h-px w-12" style={{ background: "var(--store-primary, #1a1512)" }} />
    </div>
  );
}
