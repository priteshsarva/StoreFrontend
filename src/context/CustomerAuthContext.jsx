// Buyer (shopper) auth — scoped to this vendor's slug. A customer account on
// one vendor's site is invisible to every other vendor (enforced server-side too).
import React, { createContext, useContext, useEffect, useState } from "react";
import { useStore } from "./StoreContext";
import { getCustomerToken, setCustomerToken } from "../lib/storeApi";

const AuthCtx = createContext(null);

export function CustomerAuthProvider({ children }) {
  const { slug, api } = useStore();
  const [customer, setCustomer] = useState(null);
  const [booted, setBooted] = useState(false);

  useEffect(() => {
    if (!getCustomerToken(slug)) { setBooted(true); return; }
    api.me()
      .then((r) => setCustomer(r.customer))
      .catch(() => setCustomerToken(slug, ""))
      .finally(() => setBooted(true));
  }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

  async function login(email, password) {
    const r = await api.login({ email, password });
    // Store owner/admin used their portal credentials — send them to the portal.
    if (r.redirect_to_portal) {
      window.location.href = import.meta.env.VITE_PORTAL_URL || "http://localhost:5174";
      return;
    }
    setCustomerToken(slug, r.token);
    setCustomer(r.customer);
  }
  async function signup(body) {
    const r = await api.signup(body);
    setCustomerToken(slug, r.token);
    setCustomer(r.customer);
  }
  function logout() { setCustomerToken(slug, ""); setCustomer(null); }

  // Log the buyer in from a guest checkout: the order response hands back a
  // session token for the (auto-created or reused unclaimed) account.
  function sessionFromCheckout(token, cust) {
    if (!token) return;
    setCustomerToken(slug, token);
    if (cust) setCustomer(cust);
  }

  return (
    <AuthCtx.Provider value={{ customer, booted, login, signup, logout, sessionFromCheckout }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useCustomerAuth = () => useContext(AuthCtx);
