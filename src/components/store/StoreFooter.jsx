// Footer — everything is vendor-driven and self-hiding: a column or link only
// renders when the vendor actually provided that detail. No empty "Follow"
// block, no dead policy links, no placeholder social icons.
import React from "react";
import { Link } from "react-router-dom";
import { Instagram, Facebook, Youtube, Twitter, Mail, Phone, MessageCircle } from "lucide-react";
import { useStore } from "../../context/StoreContext";

const POLICY_LABELS = { shipping: "Shipping Policy", returns: "Returns Policy", terms: "Terms of Service", privacy: "Privacy Policy" };

export default function StoreFooter() {
  const { config } = useStore();
  if (!config) return null;

  const addr = config.address || {};
  const socials = config.social_urls || {};
  const hasAddress = addr.line1 || addr.city;

  // Every store now has real, store-branded default legal text (see
  // legalDefaults.js), so all four policy links + FAQ always resolve to a real
  // page — no dead links, and the vendor can override the text any time.
  const policyLinks = Object.keys(POLICY_LABELS);

  // only socials the vendor set. community = a whatsapp community/group invite link.
  const socialItems = [
    socials.instagram && { href: socials.instagram, Icon: Instagram, label: "Instagram" },
    socials.facebook && { href: socials.facebook, Icon: Facebook, label: "Facebook" },
    socials.youtube && { href: socials.youtube, Icon: Youtube, label: "YouTube" },
    socials.twitter && { href: socials.twitter, Icon: Twitter, label: "Twitter" },
    socials.community && { href: socials.community, Icon: MessageCircle, label: "Community" },
  ].filter(Boolean);

  const hasContact = config.email || config.phone || hasAddress;

  // Footer takes the vendor's SECONDARY palette colour; all text inherits the
  // auto-contrast colour (--store-on-secondary = black or white) and uses opacity
  // for hierarchy, so it stays readable on any brand colour.
  const linkCls = "opacity-80 hover:opacity-100 transition-opacity";
  const headCls = "text-[11px] uppercase tracking-[0.18em] opacity-60 mb-4 font-semibold";
  const hairline = { borderColor: "color-mix(in srgb, var(--store-on-secondary, #fff) 16%, transparent)" };

  return (
    <footer className="mt-auto border-t" style={{ background: "var(--store-secondary, #1a1512)", color: "var(--store-on-secondary, #fff)", ...hairline }}>
      <div className="max-w-screen-xl mx-auto px-4 lg:px-6 py-14 grid grid-cols-2 md:grid-cols-4 gap-10 text-sm">
        {/* brand + contact */}
        <div className="col-span-2 md:col-span-1">
          {config.logo_url
            ? <img src={config.logo_url} alt={config.store_name} className="h-12 mb-4" />
            : <div className="font-display text-xl mb-4">{config.store_name}</div>}
          {config.email && (
            <a href={`mailto:${config.email}`} className={`flex items-center gap-2 mb-2 ${linkCls}`}>
              <Mail size={14} /> {config.email}
            </a>
          )}
          {config.phone && (
            <a href={`tel:${config.phone.replace(/\s+/g, "")}`} className={`flex items-center gap-2 ${linkCls}`}>
              <Phone size={14} /> {config.phone}
            </a>
          )}
          {hasAddress && (
            <p className="mt-3 opacity-70 leading-relaxed">
              {[addr.line1, addr.city, addr.state, addr.pincode].filter(Boolean).join(", ")}
            </p>
          )}
        </div>

        {/* policies — only the ones that exist */}
        {policyLinks.length > 0 && (
          <div>
            <h4 className={headCls}>Policies</h4>
            <div className="flex flex-col gap-2.5">
              {policyLinks.map((k) => (
                <Link key={k} to={`/policy/${k}`} className={linkCls}>{POLICY_LABELS[k]}</Link>
              ))}
              <Link to="/faq" className={linkCls}>FAQ</Link>
            </div>
          </div>
        )}

        {/* account */}
        <div>
          <h4 className={headCls}>Account</h4>
          <div className="flex flex-col gap-2.5">
            <Link to="/account" className={linkCls}>My account</Link>
            <Link to="/wishlist" className={linkCls}>Wishlist</Link>
            <Link to="/cart" className={linkCls}>Cart</Link>
          </div>
        </div>

        {/* follow — only if the vendor set any social/community link */}
        {socialItems.length > 0 && (
          <div>
            <h4 className={headCls}>Follow</h4>
            <div className="flex gap-2">
              {socialItems.map(({ href, Icon, label }) => (
                <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} style={hairline}
                   className="w-9 h-9 flex items-center justify-center rounded-full border opacity-80 hover:opacity-100 transition-opacity">
                  <Icon size={17} strokeWidth={1.75} />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="border-t" style={hairline}>
        <div className="max-w-screen-xl mx-auto px-4 lg:px-6 py-5 text-xs opacity-70 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} {config.store_name}. All rights reserved.</span>
          <span className="opacity-80">Hand-picked · Quality-checked · Dispatched personally</span>
          {/* Platform credit — on by default; a higher plan will hide it (config.powered_by === false). */}
          {config.powered_by !== false && (
            <a href="https://authnic.co.in" target="_blank" rel="noopener noreferrer"
               className="opacity-40 hover:opacity-80 transition-opacity">
              Powered by Authnic
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
