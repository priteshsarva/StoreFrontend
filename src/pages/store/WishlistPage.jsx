import React from "react";
import { Link } from "react-router-dom";
import { Trash2, ShoppingBag } from "lucide-react";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";
import { inr } from "../../lib/money";
import { withStore } from "../../lib/tenant";

export default function WishlistPage() {
  const { items, remove } = useWishlist();
  const { add } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-screen-md mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl text-ink mb-2">Your wishlist is empty</h1>
        <p className="text-muted mb-7">Tap the heart on any product to save it here.</p>
        <Link to={withStore("/")} className="btn btn-primary">Browse products</Link>
      </div>
    );
  }

  return (
    <div className="max-w-screen-md mx-auto px-4 lg:px-6 py-10">
      <h1 className="text-3xl md:text-4xl text-ink mb-8">Wishlist</h1>
      <div className="flex flex-col">
        {items.map((it) => (
          <div key={`${it.db_name}-${it.product_id}`} className="flex gap-4 items-center border-b border-line py-5 first:pt-0">
            <Link to={withStore(`/p/${it.db_name}/${it.product_id}`)}>
              {it.image
                ? <img src={it.image} alt="" className="w-20 h-20 object-cover bg-panel" />
                : <div className="w-20 h-20 bg-panel" />}
            </Link>
            <div className="flex-1 min-w-0">
              <Link to={withStore(`/p/${it.db_name}/${it.product_id}`)} className="text-sm text-ink line-clamp-2 hover:underline" style={{ fontWeight: 500 }}>{it.name}</Link>
              <div className="price text-[15px] mt-1.5 text-ink">{inr(it.price)}</div>
            </div>
            <button
              onClick={() => add({ productId: it.product_id, dbName: it.db_name, productName: it.name, thumbnail: it.image, price: it.price }, 1)}
              className="text-ink-soft hover:text-ink flex items-center gap-1.5 text-sm transition-colors"
              title="Add to cart"
            >
              <ShoppingBag size={16} /> <span className="hidden sm:inline">Add to cart</span>
            </button>
            <button onClick={() => remove(it.db_name, it.product_id)} className="text-muted hover:text-rose-700 transition-colors" aria-label="Remove">
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
