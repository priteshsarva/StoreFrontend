import { useState } from 'react'
import ProductGride from './ProductGride'
import { Link } from 'react-router-dom'


const SingleCollection = ({ productss, primaryCat }) => {

    const shuffleArray = (array) => {
        const arr = [...array]; // copy (important)
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    };

    let products = [];
    if (productss && productss.length > 0) {
        if (primaryCat !== undefined) {
            const category = productss.find(cat => cat.primarycat === primaryCat);
            if (category) {
                products = category.products;
            }
        } else {
            products = shuffleArray(
                productss.flatMap(cat => cat.products)
            );
        }
    }
    const [filteredProducts, setFilteredProducts] = useState(products.slice(0, 12));

    const filterBySize = (product, size) => {

        try {
            const sizes = JSON.parse(product.sizeName); // Convert JSON string to array
            return sizes.includes(size.toString());
            // console.log(JSON.parse(product.sizeName));

        } catch (error) {
            console.error("Error parsing sizeName for product:", product.productId, error);
            return false;
        }

    };
    const filterByCategory = (product, category) => {
        try {
            const categories = product.catName.toLowerCase(); // Convert JSON string to array
            console.log(categories.includes(category));
            return categories.includes(category.toString().toLowerCase());
        } catch (error) {
            console.error("Error parsing sizeName for product:", product.productId, error);
            return false;
        }
    };

    return (
        <>
            {/* Products with Filters */} ̰
            <div className="container mx-auto px-4 py-10 text-center">
                {/* Title */}
                <div className=' container mx-auto px-4 bg-white'>
                    <h4 className=" section-title section-title-center mb-5">
                        <b></b>
                        <span className="text-xl  text-black tracking-wide uppercase">
                            New Arrivals {primaryCat ? primaryCat.charAt(0).toUpperCase() + primaryCat.slice(1) : ""}
                        </span>
                        <b></b>
                    </h4>
                </div>
                <div className="flex flex-col sm:flex-row gap-6 mt-10">

                    {/* Sidebar for Filters (optional) */}
                    {/* <div className="w-full sm:w-1/3 md:w-1/4 px-2">
      <ProductFilters onFilterChange={handleFilterChange} /> 
    </div> */}

                    {/* Product Grid Section */}
                    <div className="w-full justify-center">
                        <ProductGride products={{ products: filteredProducts }} />


                        <div className='w-full flex justify-center'>
                            <Link
                                to="/product"
                                className="mt-6 inline-flex items-center justify-center bg-gray-900 text-white font-semibold px-4 py-2 border hover:bg-gray-700 transition rounded-none cursor-pointer"
                            >
                                <h6 className="flex items-center gap-2 text-base font-semibold">
                                    View All Products
                                    {/* <svg
                                        viewBox="0 0 14 10"
                                        fill="none"
                                        aria-hidden="true"
                                        focusable="false"
                                        className="w-4 h-4"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M8.537.808a.5.5 0 01.817-.162l4 4a.5.5 0 010 .708l-4 4a.5.5 0 11-.708-.708L11.793 5.5H1a.5.5 0 010-1h10.793L8.646 1.354a.5.5 0 01-.109-.546z"
                                            fill="currentColor"
                                        ></path>
                                    </svg> */}
                                </h6>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>


        </>
    )
}

export default SingleCollection
