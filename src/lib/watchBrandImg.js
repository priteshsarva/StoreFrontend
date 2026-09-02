// Default brand images for watch brands, bundled in src/assets/watch/* and
// src/assets/watch1/*. Used as the fallback tile image when a vendor hasn't set
// their own brand thumbnail. Matches by normalised name (case/spacing/punctuation-
// insensitive), with a prefix fallback so "Vacheron Constantin" finds "Vacheron".
// watch1 is the vendor's preferred set, so it overrides watch on the same brand.
const filesWatch = import.meta.glob("../assets/watch/*", { eager: true, query: "?url", import: "default" });
const filesWatch1 = import.meta.glob("../assets/watch1/*", { eager: true, query: "?url", import: "default" });

const nk = (s) => String(s || "").toLowerCase().replace(/[^a-z0-9]/g, "");
// filename -> brand key: drop the extension and any trailing "-N" variant marker
// ("Cartier-4" -> cartier, "Citizen-2" -> citizen) so it matches the brand name.
const fileKey = (path) => nk(path.split("/").pop().replace(/\.[^.]+$/, "").replace(/-\d+$/, ""));

const byKey = {};
for (const [path, url] of Object.entries(filesWatch)) byKey[fileKey(path)] = url;   // base set
for (const [path, url] of Object.entries(filesWatch1)) byKey[fileKey(path)] = url;  // watch1 wins

export function watchBrandImg(brand) {
  const k = nk(brand);
  if (!k) return null;
  if (byKey[k]) return byKey[k];
  for (const [fk, url] of Object.entries(byKey)) {
    if (fk.length >= 4 && (k.startsWith(fk) || fk.startsWith(k))) return url;
  }
  return null;
}
