// localStorage cart, keyed per vendor slug so carts never leak between stores.
import React, { createContext, useContext, useEffect, useState } from "react";
import { useStore } from "./StoreContext";

const CartCtx = createContext(null);

export function CartProvider({ children }) {
  const { slug, api } = useStore();
  const key = `spp_cart:${slug}`;
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem(key)) || []; }
    catch { return []; }
  });

  useEffect(() => { localStorage.setItem(key, JSON.stringify(items)); }, [items, key]);

  // size is informational only (the catalogue has no per-size SKU/stock). The
  // order-creation API re-fetches product_name from the server, so size can't
  // ride on that field — checkout folds it into the order's free-text note instead.
  function add(product, qty = 1, size = "") {
    api?.track("add_to_cart", { product_id: product.productId, db_name: product.dbName, value: product.price });
    setItems((prev) => {
      const i = prev.findIndex((x) => x.product_id === product.productId && x.db_name === product.dbName && x.size === size);
      if (i >= 0) {
        const next = [...prev];
        next[i] = { ...next[i], qty: next[i].qty + qty };
        return next;
      }
      return [...prev, {
        product_id: product.productId, db_name: product.dbName, size,
        name: product.productName, image: product.thumbnail, price: product.price, qty,
      }];
    });
  }
  function setQty(index, qty) {
    setItems((prev) => prev.map((x, i) => (i === index ? { ...x, qty: Math.max(1, qty) } : x)));
  }
  function remove(index) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }
  function clear() { setItems([]); }

  const total = items.reduce((s, x) => s + x.price * x.qty, 0);
  const count = items.reduce((s, x) => s + x.qty, 0);

  return (
    <CartCtx.Provider value={{ items, add, setQty, remove, clear, total, count }}>
      {children}
    </CartCtx.Provider>
  );
}

export const useCart = () => useContext(CartCtx);
