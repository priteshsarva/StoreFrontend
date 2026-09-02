import './App.css'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useEffect } from 'react';

import { StoreProvider, useStore } from './context/StoreContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { CustomerAuthProvider } from './context/CustomerAuthContext.jsx';
import { WishlistProvider } from './context/WishlistContext.jsx';

import StoreNavBar from './components/store/StoreNavBar.jsx';
import StoreFooter from './components/store/StoreFooter.jsx';
import MobileBottomNav from './components/store/MobileBottomNav.jsx';
import StoreHome from './pages/store/StoreHome.jsx';
import StoreCategoryPage from './pages/store/StoreCategoryPage.jsx';
import StoreProductPage from './pages/store/StoreProductPage.jsx';
import CartPage from './pages/store/CartPage.jsx';
import CheckoutPage from './pages/store/CheckoutPage.jsx';
import AccountPage from './pages/store/AccountPage.jsx';
import PolicyPage from './pages/store/PolicyPage.jsx';
import FaqPage from './pages/store/FaqPage.jsx';
import WishlistPage from './pages/store/WishlistPage.jsx';
import StoreNotFound from './pages/store/StoreNotFound.jsx';

import ScrollToTop from './components/ScrollToTop.jsx';
import { useScrollReveal } from './hooks/useScrollReveal.js';

async function loadPreline() {
  return import('preline/dist/index.js');
}

// On localhost the tenant is carried by ?store=slug — but a shopper who copies
// or shares the URL /p/watches/28440 without that query gets "Store not found".
// Keep the query in the address bar after every navigation so every copied
// URL is a shareable, deep-link-safe URL. Skipped in production (subdomains
// resolve natively; a subdomain URL is already shareable).
function useShareableTenantUrl(slug: string | undefined) {
  const location = useLocation();
  useEffect(() => {
    if (!slug) return;
    const host = window.location.hostname;
    const isLocalHost = host === 'localhost' || host === '127.0.0.1' || /^\d+\.\d+\.\d+\.\d+$/.test(host);
    if (!isLocalHost) return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('store') === slug) return;
    params.set('store', slug);
    const q = params.toString();
    const url = `${window.location.pathname}${q ? '?' + q : ''}${window.location.hash}`;
    window.history.replaceState(null, '', url);
  }, [slug, location.pathname, location.search]);
}

function AppShell() {
  const location = useLocation();
  const { status, slug, config } = useStore();

  useShareableTenantUrl(slug);
  useScrollReveal();

  // Tab title + favicon from the vendor's branding (favicon_url, else the logo).
  useEffect(() => {
    if (config?.store_name) document.title = config.store_name;
    const icon = config?.favicon_url || config?.logo_url;
    if (icon) {
      let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement | null;
      if (!link) { link = document.createElement("link"); link.rel = "icon"; document.head.appendChild(link); }
      link.href = icon;
    }
  }, [config?.store_name, config?.favicon_url, config?.logo_url]);

  useEffect(() => {
    const initPreline = async () => {
      await loadPreline();
      if (window.HSStaticMethods && typeof window.HSStaticMethods.autoInit === 'function') {
        window.HSStaticMethods.autoInit();
      }
    };
    initPreline();
  }, [location.pathname]);

  if (status === 'loading') return <div className="min-h-screen" />;
  if (status !== 'ready') return <StoreNotFound reason={status} />;

  return (
    <CartProvider>
      <WishlistProvider>
        <CustomerAuthProvider>
          <StoreNavBar />
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<StoreHome />} />
            <Route path="/c/:category" element={<StoreCategoryPage />} />
            <Route path="/search" element={<StoreCategoryPage />} />
            <Route path="/p/:dbName/:id" element={<StoreProductPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/policy/:kind" element={<PolicyPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <StoreFooter />
          <MobileBottomNav />
        </CustomerAuthProvider>
      </WishlistProvider>
    </CartProvider>
  );
}

const App = () => (
  <StoreProvider>
    <AppShell />
  </StoreProvider>
);

export default App
