// Flatsome [section] equivalent — wraps content with padding, optional bg image
// or color, optional dark-mode text.
// Props:
//   bg (string url), bg_color (css color), dark (bool),
//   padding ('sm' | 'md' | 'lg' | 'none'), overlay (0-100 opacity for dark scrim),
//   contained (bool, default true) — constrains to max-w-screen-xl
import React from "react";

const PADS = { none: "", sm: "py-8", md: "py-14 md:py-16", lg: "py-20 md:py-24" };

export default function SectionWrap({
  children, bg, bg_color, dark = false, padding = "md", overlay = 0, contained = true,
}) {
  const hasBgImg = !!bg;
  const style = {};
  if (bg_color) style.background = bg_color;
  if (hasBgImg) {
    style.backgroundImage = `url(${bg})`;
    style.backgroundSize = "cover";
    style.backgroundPosition = "center";
  }
  return (
    <section className={`relative ${PADS[padding] || PADS.md} ${dark ? "text-white" : "text-ink"}`} style={style}>
      {hasBgImg && overlay > 0 && (
        <div className="absolute inset-0" style={{ background: `rgba(0,0,0,${overlay / 100})` }} />
      )}
      <div className={`relative ${contained ? "max-w-screen-xl mx-auto px-4" : ""}`}>
        {children}
      </div>
    </section>
  );
}
