import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, ArrowRight } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { inr } from "../../lib/money";
import { withStore } from "../../lib/tenant";

export default function CartPage() {
  const { items, setQty, remove, total } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="max-w-screen-md mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl text-ink mb-2">Your cart is empty</h1>
        <p className="text-muted mb-7">Nothing here yet — the collection is waiting.</p>
        <Link to={withStore("/")} className="btn btn-primary">Continue shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-screen-lg mx-auto px-4 lg:px-6 py-10">
      <h1 className="text-3xl md:text-4xl text-ink mb-8">Your cart</h1>
      <div className="grid lg:grid-cols-[1fr_320px] gap-10">
        <div className="flex flex-col">
          {items.map((it, i) => (
            <div key={`${it.product_id}-${it.db_name}-${it.size}-${i}`} className="flex gap-4 items-center border-b border-line py-5 first:pt-0">
              {it.image
                ? <img src={it.image} alt="" className="w-20 h-20 object-cover bg-panel" />
                : <div className="w-20 h-20 bg-panel" />}
              <div className="flex-1 min-w-0">
                <div className="text-sm text-ink line-clamp-2" style={{ fontWeight: 500 }}>{it.name}</div>
                {it.size && <div className="text-xs text-muted mt-0.5">Size {it.size}</div>}
                <div className="price text-[15px] mt-1.5 text-ink">{inr(it.price)}</div>
              </div>
              <div className="flex items-center border border-line-strong">
                <button onClick={() => setQty(i, it.qty - 1)} className="w-9 h-9 text-ink-soft hover:text-ink" aria-label="Decrease quantity">−</button>
                <span className="w-7 text-center text-sm num">{it.qty}</span>
                <button onClick={() => setQty(i, it.qty + 1)} className="w-9 h-9 text-ink-soft hover:text-ink" aria-label="Increase quantity">+</button>
              </div>
              <button onClick={() => remove(i)} className="text-muted hover:text-rose-700 transition-colors" aria-label="Remove item">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        {/* summary */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="border border-line bg-paper p-6 shadow-[var(--shadow-sm)]">
            <h2 className="eyebrow !text-ink mb-5">Order summary</h2>
            <div className="flex items-center justify-between text-sm text-ink-soft mb-2">
              <span>Subtotal</span><span className="num">{inr(total)}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-ink-soft mb-4">
              <span>Shipping</span><span className="text-muted">Calculated at checkout</span>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-line mb-6">
              <span className="text-base text-ink" style={{ fontWeight: 600 }}>Total</span>
              <span className="price text-2xl text-ink">{inr(total)}</span>
            </div>
            <button onClick={() => navigate(withStore("/checkout"))} className="btn btn-primary w-full">
              Checkout <ArrowRight size={15} />
            </button>
            <Link to={withStore("/")} className="link-quiet mt-4 justify-center w-full">Continue shopping</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
