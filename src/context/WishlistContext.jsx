// Wishlist — localStorage-backed, keyed per vendor slug (like the cart) so
// items don't leak between stores. Minimal shape: store enough per-item to
// render the wishlist page without a re-fetch (name, thumbnail, price, ids).
import React, { createContext, useContext, useEffect, useState } from "react";
import { useStore } from "./StoreContext";

const Ctx = createContext(null);

export function WishlistProvider({ children }) {
  const { slug } = useStore();
  const key = `spp_wishlist:${slug}`;
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem(key)) || []; }
    catch { return []; }
  });

  useEffect(() => { localStorage.setItem(key, JSON.stringify(items)); }, [items, key]);

  function has(dbName, productId) {
    return items.some((x) => x.product_id === productId && x.db_name === dbName);
  }
  function add(product) {
    setItems((prev) => (has(product.dbName, product.productId) ? prev : [
      ...prev,
      {
        product_id: product.productId, db_name: product.dbName,
        name: product.productName, image: product.thumbnail,
        price: product.price, mrp: product.mrp,
      },
    ]));
  }
  function remove(dbName, productId) {
    setItems((prev) => prev.filter((x) => !(x.product_id === productId && x.db_name === dbName)));
  }
  function toggle(product) {
    if (has(product.dbName, product.productId)) remove(product.dbName, product.productId);
    else add(product);
  }
  function clear() { setItems([]); }

  return (
    <Ctx.Provider value={{ items, count: items.length, has, add, remove, toggle, clear }}>
      {children}
    </Ctx.Provider>
  );
}

export const useWishlist = () => useContext(Ctx);
