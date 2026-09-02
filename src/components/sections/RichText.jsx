// Flatsome [text_box] equivalent — plain-text block with alignment and width.
// Deliberately NOT a rich-text editor (no HTML injection from the vendor JSON) —
// paragraphs split on double newline, single newlines become <br>.
// Props: text (string), align ('left'|'center'|'right', default 'center'), max_width (css string)
import React from "react";

export default function RichText({ text, align = "center", max_width = "640px" }) {
  if (!text) return null;
  return (
    <div className={`mx-auto text-[15px] md:text-base text-ink-soft leading-relaxed ${align === "left" ? "text-left" : align === "right" ? "text-right" : "text-center"}`} style={{ maxWidth: max_width, textWrap: "pretty" }}>
      {String(text).split(/\n\n+/).map((p, i) => (
        <p key={i} className="mb-3 last:mb-0">
          {p.split("\n").map((line, j, arr) => (
            <React.Fragment key={j}>
              {line}
              {j < arr.length - 1 && <br />}
            </React.Fragment>
          ))}
        </p>
      ))}
    </div>
  );
}
