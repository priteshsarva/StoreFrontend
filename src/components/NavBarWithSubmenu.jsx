import { useEffect, useState } from 'react';
import { FaSearch, FaBars } from 'react-icons/fa';
import logo1 from '../assets/logo_1.png'
import { Link } from 'react-router-dom';
import Card from './Card'
import PromoBar from './PromoBar';
import { brand, brandlogo } from '../data/data';
import AnnouncementBar from './AnnouncementBar';
const baseUrl = import.meta.env.VITE_BASE_URL;

export default function NavBarWithSubmenu() {
  const [searchDrawerOpen, setSearchDrawerOpen] = useState(false);
  const [leftDrawerOpen, setLeftDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);



  const navLinks = [
    // { name: "Rolex", url: "product/brand/Rolex" },
    // { name: "Omega", url: "product/brand/omeg" },
    // { name: "Patek Philippe", url: "product/brand/patek" },
    // { name: "Cartier", url: "product/brand/cart" },
    // { name: "Audemars Piguet", url: "product/brand/audem" },
    // { name: "Breitling", url: "product/brand/breitling" },
    // { name: "TAG Heuer", url: "product/brand/tag" },
    // { name: "Tissot", url: "product/brand/tiss" },
    // { name: "Seiko", url: "product/brand/seik" },
    // { name: "Fossil", url: "product/brand/foss" },   
    // { name: "Citize", url: "product/brand/citi" },
    { name: "Home", url: "/" },
    { name: "Shop by Brands ", url: "/home#shopByBrand" },
    { name: "Men's", url: "/product/category/Men" },
    { name: "Women's", url: "/product/category/Ladies" },
    { name: "Luxury collection", url: "/product/category/Luxury Watch" },
    { name: "Contact info", url: "#contactus" },
  ];



  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    // console.log(term);

    if (term.trim().length >= 3) {
      let urls = `${baseUrl}/product/search?q=${term}`;
      fetch(urls, {
        method: 'GET',
      })
        .then(response => response.json())
        .then(data => {
          // console.log(data.results);
          setSearchResults(data.results);
        })
      // .catch(error => console.error('Error:', error));
    }


  };

  const handleCloseSearch = () => {
    setSearchDrawerOpen(false)
    setSearchTerm('');
    setSearchResults([]);
  };


  useEffect(() => {
    // Disable scrolling on the body


    if (searchDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';

    }


  }, [searchDrawerOpen]);

  return (
    <>
      {/* 🔍 Top Search Drawer */}
      {searchDrawerOpen && <>
        <div
          className="absolute inset-0 bg-black bg-opacity-50 transition-opacity fixed z-50" style={{ opacity: "0.8" }}
          onClick={handleCloseSearch} // Closes search when clicking outside
        ></div>

        <div className="fixed top-0 left-0 right-0 z-50 w-full p-4 bg-white shadow-md transition-transform animate-slide-down">


          <div className="flex justify-between items-center mb-4">
            <h2 className="text-gray-700 text-lg font-semibold">Search</h2>
            <button onClick={handleCloseSearch} className="text-gray-500">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="relative mb-4">
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
              <FaSearch />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              autoFocus
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg bg-white text-black"
            />
          </div>
          <div className="text-sm text-gray-500">
            {searchTerm.trim().length <= 2 ? (
              <p className="text-center mt-4">Please enter a search term to see results.</p>
            ) : (
              <>
                {searchResults.length > 0 ? (
                  <>
                    <div className="max-h-100 overflow-y-auto pr-2">
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                        {searchResults.slice(0, 6).map((product) => (
                          <Card
                            key={product.productId}
                            title={product.productName}
                            price={product.productOriginalPrice}
                            coverImg={product.featuredimg}
                            id={product.productId}
                            catName={product.catName}
                            primarycat={product.primarycat}
                            sizeName={product.sizeName || "[]"}
                          />
                        ))}
                      </div>
                    </div>
                    <Link
                      to={`/search/brand/${searchTerm}`}
                      onClick={handleCloseSearch}
                      className="w-full flex justify-center mt-4 btn fw-semibold px-4 rounded-none text-dark"
                    >
                      <h6 className="inline-flex items-center font-semibold">
                        View All Products
                        <svg
                          viewBox="0 0 14 10"
                          fill="none"
                          aria-hidden="true"
                          focusable="false"
                          className="ml-1 icon icon-arrow"
                          width="14"
                          height="10"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M8.537.808a.5.5 0 01.817-.162l4 4a.5.5 0 010 .708l-4 4a.5.5 0 11-.708-.708L11.793 5.5H1a.5.5 0 010-1h10.793L8.646 1.354a.5.5 0 01-.109-.546z"
                            fill="currentColor"
                          />
                        </svg>
                      </h6>
                    </Link>
                  </>
                ) : (
                  <p className="mt-4 text-center text-sm text-red-500">No Result Found</p>
                )}
              </>
            )}
          </div>
        </div>
      </>}

      {/* 🍔 Left Drawer (Mobile Menu) */}
      {leftDrawerOpen && (
        <div className="fixed top-0 left-0 z-40 h-screen w-80 bg-white/80 backdrop-blur-lg shadow transition-transform animate-slide-right p-4 overflow-y-auto text-black">
          <div className="w-full sticky top-0 z-40   border-b border-gray-500 flex justify-between items-center mb-2 pb-3">
            <Link to='/' onClick={() => setLeftDrawerOpen(false)} className="text-base font-semibold text-gray-500 inline-flex items-center gap-2">
              <img src={brandlogo} alt={brand} className="h-15 w-auto" />
            </Link>
            <button
              onClick={() => setLeftDrawerOpen(false)}
              className="text-gray-400 hover:bg-gray-200 rounded-lg p-1 "
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <ul className="space-y-2 text-sm text-gray-900">
            {navLinks.map((link, index) => (
              <li key={index}>
                <Link
                  to={link.url}
                  onClick={() => setLeftDrawerOpen(false)}
                  className="block px-4 py-2 rounded-md hover:bg-gray-200 transition-colors duration-200 cursor-pointer"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 🌐 Navbar */}
      <nav className="sticky top-0 z-30 bg-white/70 backdrop-blur-md border-b border-gray-200">
        <AnnouncementBar />
        <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Left: Hamburger (mobile only) */}
          <button
            onClick={() => setLeftDrawerOpen(true)}
            className="md:hidden text-gray-600"
          >
            <FaBars />
          </button>

          {/* Center: Logo */}
          <div className="flex-1 flex justify-center ">
            <Link to="/#" className="inline-flex items-center">
              <img src={brandlogo} alt={brand} className="h-15 w-auto" />
            </Link>
          </div>

          {/* Right: Search */}
          <button
            onClick={() => setSearchDrawerOpen(true)}
            className="flex items-center text-sm font-semibold text-gray-600 hover:underline"
          >
            <FaSearch className="mr-1" />
            <div className="hidden md:block">
              Search
            </div>
          </button>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex justify-center border-t border-gray-100 bg-gray-50 py-2">
          <ul className="w-full max-w-[80%] flex justify-center space-x-4 text-sm font-medium text-gray-700 text-center">
            {navLinks.map((link, index) => (
              // <li key={index} className={`${index !== 0 ? 'border-l border-gray-300 pl-4' : ''}`}>
              <li key={index} className={`${index !== 0 ? 'pl-4' : ''}`}>
                <Link to={link.url} className="hover:underline block">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <PromoBar />
      </nav>

    </>
  );
}
