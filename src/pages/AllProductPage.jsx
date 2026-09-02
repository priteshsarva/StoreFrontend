import { useState, useEffect } from "react";
import BreadCrumbs from "../components/BreadCrumbs";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import Card from "../components/Card";
import { brandMap, categorymap, sidebarDataBrand, sidebarDataCategory } from "../data/data";
const baseUrl1 = import.meta.env.VITE_BASE_URL;
import Loader from "../components/Loader";



const AllProductPage = () => {
    const [products, setProducts] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [url, setUrl] = useState("");
    const [noProductFound, setNoProductFound] = useState(false);
    const { category, brand } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    // console.log(location.pathname);


    const [selectedFilters, setSelectedFilters] = useState({
        category: "",
        brand: "",
    });

    const combinedSections = [...sidebarDataCategory, ...sidebarDataBrand];

    const [openSections, setOpenSections] = useState(
        combinedSections.reduce((acc, section) => {
            acc[section.id] = false;
            return acc;
        }, {})
    );

    const toggleSection = (id) => {
        setOpenSections((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const buildUrl = (filters, page) => {
        let baseUrl = `${baseUrl1}/product/search?`;
        const params = [];

        if (location.pathname.includes('search')) {
            // console.log('from search');

            if (filters.brand && filters.brand.trim() !== "") {
                // Map certain brand names to query terms if needed
                const brandQuery = brandMap[filters.brand] || filters.brand;
                params.push(`q=${encodeURIComponent(brandQuery)}`);
            }
        } else {
            if (filters.brand && filters.brand.trim() !== "") {
                // Map certain brand names to query terms if needed
                const brandQuery = brandMap[filters.brand] || filters.brand;
                params.push(`q=${encodeURIComponent(brandQuery.slice(0, 3))}`);
            }
        }


        if (filters.category && filters.category.trim() !== "") {

            const categoryQuery = categorymap[filters.category] || filters.category;
            params.push(`category=${encodeURIComponent(categoryQuery)}`);
            // params.push(`category=${encodeURIComponent(filters.category)}`);
        }

        params.push(`result=20`);
        params.push(`page=${page}`);

        return baseUrl + params.join("&");
    };

    const fetchProducts = async () => {
        let apiUrl
        if (selectedFilters.category || selectedFilters.brand) {
            apiUrl = buildUrl(selectedFilters, currentPage);
            setUrl(apiUrl);

            try {
                const response = await fetch(apiUrl);
                const data = await response.json();

                if (data.results && data.results.length > 0) {
                    if (currentPage === 1) {
                        setProducts(data.results);
                    } else {
                        setProducts((prev) => [...prev, ...data.results]);
                    }
                    setNoProductFound(false);
                    setTotalPages(data.totalPages);
                } else {
                    if (currentPage === 1) {
                        setProducts([]);
                        setNoProductFound(true);
                    }
                }
            } catch (error) {
                // console.error("Error fetching products:", error);
            }
        } else if (location.pathname === '/product') {
            apiUrl = buildUrl(selectedFilters, currentPage);
            setUrl(apiUrl);

            try {
                const response = await fetch(apiUrl);
                const data = await response.json();

                if (data.results && data.results.length > 0) {
                    if (currentPage === 1) {
                        setProducts(data.results);
                    } else {
                        setProducts((prev) => [...prev, ...data.results]);
                    }
                    setNoProductFound(false);
                    setTotalPages(data.totalPages);
                } else {
                    if (currentPage === 1) {
                        setProducts([]);
                        setNoProductFound(true);
                    }
                }
            } catch (error) {
                // console.error("Error fetching products:", error);
            }
        }

    };

    useEffect(() => {

        fetchProducts();
    }, [selectedFilters, currentPage]);

    const handleFilterChange = (newBrand, newCategory) => {
        // Start with current filter values
        let updatedBrand = selectedFilters.brand;
        let updatedCategory = selectedFilters.category;

        // If the user clicked a new brand, update it (or toggle off)
        if (newBrand !== null) {
            updatedBrand = selectedFilters.brand === newBrand ? "" : newBrand;
        }

        // If the user clicked a new category, update it (or toggle off)
        if (newCategory !== null) {
            updatedCategory = selectedFilters.category === newCategory ? "" : newCategory;
        }

        // Update state
        setSelectedFilters({
            brand: updatedBrand,
            category: updatedCategory,
        });

        setCurrentPage(1);

        // Build URL based on updated values
        let path = "/product";

        if (updatedCategory && updatedBrand) {
            path += `/category/${updatedCategory}/brand/${updatedBrand}`;
        } else if (updatedCategory) {
            path += `/category/${updatedCategory}`;
        } else if (updatedBrand) {
            path += `/brand/${updatedBrand}`;
        }

        navigate(path);
    };

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
    };

    const handleLoadMore = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    useEffect(() => {
        setSelectedFilters({
            category: category || "",
            brand: brand || "",
        });
        setCurrentPage(1); // reset pagination
    }, [category, brand]);

    return (
        <>
            {/* <BreadCrumbs selectedFilters sidebarDataBrand sidebarDataCategory/> */}

            {products == '' ? <Loader /> : <>
                <BreadCrumbs
                    selectedFilters={selectedFilters}
                    setSelectedFilters={setSelectedFilters}
                    sidebarDataBrand={sidebarDataBrand}
                    sidebarDataCategory={sidebarDataCategory}
                    handleFilterChange={handleFilterChange}
                    setCurrentPage={setCurrentPage}
                />

                <section className="container mx-auto grid grid-cols-12 gap-4">
                    <div className="hidden md:block md:col-span-3 p-4 border-r border-gray-200 text-sm text-gray-800">
                        <h2 className="font-bold mb-4 text-xl">Filter</h2>
                        <div className="mb-4 border-t border-gray-300 pt-2 ">
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


                    </div>

                    <div className="col-span-12 md:col-span-9 p-4">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">


                            {products.map((product) => (
                                <div className="h-full flex flex-col">
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
                                </div>
                            ))}

                        </div>
                        <div className='w-full flex justify-center'>
                            {currentPage < totalPages && (
                                <div className="mt-6 inline-flex items-center justify-center bg-gray-900 text-white font-semibold px-4 py-2 border hover:bg-gray-700 transition rounded-none cursor-pointer" onClick={handleLoadMore}>View More Products</div>
                            )}
                        </div>
                    </div>
                </section>
            </>}
        </>
    )
};

export default AllProductPage;
