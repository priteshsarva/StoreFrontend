// Turn any pasted video URL into something the hero can autoplay muted+looped
// with no controls. Direct files (.mp4/.webm/.ogg) play in a <video>; YouTube and
// Vimeo links become a background-style iframe embed. Returns:
//   { kind: "file", src }                 -> <video><source src></video>
//   { kind: "embed", src }                -> <iframe src>
//   null                                  -> nothing usable
export function videoEmbed(url) {
  const u = String(url || "").trim();
  if (!u) return null;

  // YouTube: watch?v=, youtu.be/, /embed/, /shorts/
  const yt = u.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/);
  if (yt) {
    const id = yt[1];
    // loop needs playlist=id; mute=1 is required for autoplay to be allowed
    const q = new URLSearchParams({
      autoplay: "1", mute: "1", loop: "1", playlist: id, controls: "0",
      showinfo: "0", modestbranding: "1", rel: "0", playsinline: "1",
      disablekb: "1", fs: "0", iv_load_policy: "3",
    });
    return { kind: "embed", src: `https://www.youtube-nocookie.com/embed/${id}?${q}` };
  }

  // Vimeo: vimeo.com/12345
  const vm = u.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vm) {
    const q = new URLSearchParams({ autoplay: "1", muted: "1", loop: "1", background: "1", controls: "0" });
    return { kind: "embed", src: `https://player.vimeo.com/video/${vm[1]}?${q}` };
  }

  // direct video file (also covers unknown hosts that serve a raw file)
  if (/\.(mp4|webm|ogg)(\?|#|$)/i.test(u)) return { kind: "file", src: u };

  // last resort: try it as a file — a plain <video> is harmless if it fails
  return { kind: "file", src: u };
}
