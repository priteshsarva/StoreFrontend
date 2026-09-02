import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faFilter, faSliders, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';


const BreadCrumbs = ({ selectedFilters, sidebarDataBrand, sidebarDataCategory, handleFilterChange, setSelectedFilters, setCurrentPage }) => {


    const [leftDrawerOpen, setLeftDrawerOpen] = useState(false);
    const combinedSections = [...sidebarDataCategory, ...sidebarDataBrand];
    const navigate = useNavigate();




    const [searchQuery, setSearchQuery] = useState("");


    const handleSearchChange = (event) => {
        console.log(selectedFilters.category);
        
        setSearchQuery(event.target.value);
        handleFilterChange(event.target.value, null);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Handle form submission, e.g., call an API or redirect
        console.log(`Searching for: ${searchQuery}`);
    };






    const [openSections, setOpenSections] = useState(
        combinedSections.reduce((acc, section) => {
            acc[section.id] = false;
            return acc;
        }, {})
    );

    const location = useLocation();
    const pathSegments = location.pathname.split('/').filter(Boolean);

    // Extract category and brand from the path
    const category = pathSegments.includes('category') ? decodeURIComponent(pathSegments[pathSegments.indexOf('category') + 1]) : null;
    const brand = pathSegments.includes('brand') ? decodeURIComponent(pathSegments[pathSegments.indexOf('brand') + 1]) : null;

    // Default product breadcrumb if both category and brand are blank
    const showProductBreadcrumb = !category && !brand;

    const clearFilters = () => {
        // Reset the selected filters
        setSelectedFilters({
            brand: "",
            category: "",
        });
        // Reset the current page to 1 (optional)
        setCurrentPage(1);
        // Build URL to the base path "/product" (without any filters)
        navigate("/product");
        setLeftDrawerOpen(false)
    };
    const toggleSection = (id) => {
        setOpenSections((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    return (
        <>
            <div className="w-full text-center py-3">
                <nav aria-label="breadcrumb" className="block w-full">
                    <ol className="flex w-full flex-wrap items-center rounded-md bg-neutral-gray-50 bg-opacity-60 py-2 px-4 justify-center">
                        {/* Home breadcrumb */}
                        <li className="flex items-center font-sans text-sm font-normal leading-normal text-neutral-gray-900 antialiased">
                            <Link
                                to="/"
                                className="flex cursor-pointer items-center font-sans text-sm font-normal leading-normal text-neutral-gray-900 antialiased transition-colors duration-300 hover:text-gray-800 opacity-60 hover:opacity-100"
                            >
                                <span>Home</span>
                            </Link>
                            <span className="pointer-events-none mx-2 select-none font-sans text-sm font-normal leading-normal text-neutral-gray-500 antialiased"> / </span>
                        </li>

                        {/* Category breadcrumb */}
                        {category && (
                            <li className="flex items-center font-sans text-sm font-normal leading-normal text-neutral-gray-900 antialiased">
                                <Link
                                    to={`/product/category/${encodeURIComponent(category)}`}
                                    className={`flex cursor-pointer items-center font-sans text-sm leading-normal text-neutral-gray-900 antialiased transition-colors duration-300 hover:text-gray-800 opacity-60 hover:opacity-100 ${brand ? ' ' : 'font-medium text-neutral-gray-900 opacity-100 '}`}
                                >
                                    <span>{category}</span>
                                </Link>
                                <span className={`pointer-events-none mx-2 select-none font-sans text-sm font-normal leading-normal text-neutral-gray-500 antialiased ${brand ? 'block' : 'hidden'}`}>
                                    /
                                </span>

                            </li>
                        )}

                        {/* Brand breadcrumb */}
                        {brand && (
                            <li className="flex items-center font-sans text-sm font-normal leading-normal text-neutral-gray-900 antialiased">
                                <Link
                                    to={`/product/brand/${encodeURIComponent(brand)}`}
                                    className={`flex cursor-pointer items-center font-sans text-sm leading-normal text-neutral-gray-900 antialiased transition-colors duration-300 hover:text-gray-800 opacity-60 hover:opacity-100 font-medium text-neutral-gray-900 opacity-100 `}
                                >
                                    <span>{brand}</span>
                                </Link>
                            </li>
                        )}

                        {/* Default "Products" breadcrumb if both category and brand are empty */}
                        {showProductBreadcrumb && (
                            <li className="flex items-center font-sans text-sm font-normal leading-normal text-neutral-gray-900 antialiased">
                                <Link
                                    to="/product"
                                    className="font-medium text-neutral-gray-900 transition-colors hover:text-gray-800"
                                >
                                    <span>Products</span>
                                </Link>
                            </li>
                        )}
                    </ol>
                    <ol className=" w-full flex-wrap items-center rounded-md bg-neutral-gray-50 bg-opacity-60 pb-2 px-4 justify-center">

                        <li className=" items-center font-sans text-sm font-normal leading-normal text-neutral-gray-900 antialiased">
                            <button onClick={() => setLeftDrawerOpen(true)} className="md:hidden font-medium text-neutral-gray-900 transition-colors hover:text-gray-800 " >
                                <FontAwesomeIcon icon={faSliders} className='me-1' />
                                Filter </button>
                        </li>

                        <li className=" items-center font-sans text-sm font-normal leading-normal text-neutral-gray-900 antialiased block md:hidden">


                            <div className="header-search-form-wrapper">
                                <div className="searchform-wrapper ux-search-box relative is-normal">
                                    <form
                                        role="search"
                                        method="get"
                                        className="searchform"
                                        // action="https://crepculture.com/"
                                        onSubmit={handleSubmit}
                                    >
                                        <div className="flex flex-row relative">
                                            <div className="flex flex-col flex-grow">
                                                <label
                                                    className="screen-reader-text sr-only"
                                                    htmlFor="woocommerce-product-search-field-2"
                                                >
                                                    Search for:
                                                </label>
                                                <input
                                                    type="text"
                                                    id="woocommerce-product-search-field-2"
                                                    className="search-field mb-0 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-neutral-500"
                                                    placeholder="Search…"
                                                    value={searchQuery}
                                                    onChange={handleSearchChange}
                                                    name="s"
                                                    autoComplete="off"
                                                />


                                                <input type="hidden" name="post_type" value="product" />
                                            </div>
                                            <div className="flex flex-col">
                                                <button
                                                    type="submit"
                                                    value="Search"
                                                    className="ux-search-submit submit-button secondary button icon mb-0 bg-neutral-950  text-white p-2 rounded-lg focus:outline-none hover:bg-neutral-700 ms-2"
                                                    aria-label="Submit"
                                                >
                                                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>

                        </li>
                    </ol>
                </nav>
            </div>

            {leftDrawerOpen && (
                <div className="fixed top-0 left-0 z-40 h-screen w-80 bg-white/80 backdrop-blur-lg shadow transition-transform animate-slide-right p-4 overflow-y-auto text-black">
                    <div className="w-full sticky top-0 z-40  border-b border-gray-200 flex justify-between items-center mb-2 pb-3">
                        <button onClick={() => setLeftDrawerOpen(false)} className="text-base font-semibold inline-flex items-center gap-2">
                            Filter options
                        </button>
                        <button
                            onClick={() => setLeftDrawerOpen(false)}
                            className="text-gray-400 hover:bg-gray-200 rounded-lg p-1"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-900">

                        <div className="mb-4   pt-2 ">
                            <h2 className="font-bold mb-4 text-lg">Category</h2>
                            <div className="cursor-pointer">
                                {sidebarDataCategory.map(({ id, title, items }) => (
                                    <div key={id} className="pl-4 mb-4">
                                        <button
                                            onClick={() => {
                                                handleFilterChange(null, title); // Corrected
                                                toggleSection(id)
                                            }}
                                            className={`flex justify-between items-center w-full font-semibold mb-2 focus:outline-none hover:opacity-100 ${selectedFilters.category === title ? "opacity-100 font-bold text-grey-600 text-md" : "opacity-65"}`}
                                        >
                                            {title}
                                            {items.length > 0 && (
                                                <span className="opacity-75 hover:opacity-100">
                                                    {openSections[id] ? "▲" : "▼"}
                                                </span>
                                            )}
                                        </button>

                                        {openSections[id] && (
                                            <ul className="pl-4 space-y-1 border-l border-gray-300">
                                                {items.map((item) => (
                                                    <li
                                                        key={item}
                                                        className={`cursor-pointer hover:text-gray-600 hover:opacity-100 ${selectedFilters.category === item ? "opacity-100 font-semibold" : "opacity-75"}`}
                                                        onClick={() =>
                                                            handleFilterChange(null, item)
                                                        }
                                                    >
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mb-4 border-t border-gray-300 pt-2 ">
                            <h2 className="font-bold mb-4 text-lg">Brand</h2>
                            <div className="cursor-pointer">
                                {sidebarDataBrand.map(({ id, title, items }) => (
                                    <div key={id} className="pl-4 mb-4">
                                        <button
                                            onClick={() => {
                                                handleFilterChange(title, null)
                                                toggleSection(id)
                                            }}
                                            className={`flex justify-between items-center w-full font-semibold mb-2 focus:outline-none hover:opacity-100 ${selectedFilters.brand === title ? "opacity-100 font-bold text-grey-600 text-md" : "opacity-65"}`}
                                        >
                                            {title}
                                            {items.length > 0 && (
                                                <span className="opacity-75 hover:opacity-100">
                                                    {openSections[id] ? "▲" : "▼"}
                                                </span>
                                            )}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="cursor-pointer mb-4 border-t border-gray-300 pt-2 ">
                            <h2 className="font-bold mb-4 text-lg" onClick={() => {
                                clearFilters()
                            }}>Clear Filters</h2>


                        </div>

                    </ul>
                </div>
            )}
        </>
    );
}

export default BreadCrumbs;
