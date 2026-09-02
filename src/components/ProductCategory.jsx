import React from 'react'
import { category } from '../data/data';
import { Link } from 'react-router-dom';
import './ProductCategory.css';

const ProductCategory = () => {

    return (
        <>
            <section className="container mx-auto px-4 py-10 bg-white">
                {/* Title */}
                <h4 className="section-title section-title-center mb-5">
                    <b></b>
                    <span className="text-xl  text-black tracking-wide uppercase">
                        Browse Our Categories
                    </span>
                    <b></b>
                </h4>

                {/* Grid */}
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-3 md:grid-cols-3 gap-4 md:gap-9">
                        {category.map((cat, index) => (
                            <Link
                                key={index}
                                to={cat.link}
                                className="flex flex-col items-center text-center transform transition duration-300 hover:scale-105"
                                aria-label={`Visit product category ${cat.title}`}
                            >
                                {/* Image */}
                                <div className="w-full aspect-square rounded-xl overflow-hidden mb-4">
                                    <img
                                        src={cat.img}
                                        alt={cat.title}
                                        className="object-cover w-full h-full"
                                        loading="lazy"
                                    />
                                </div>

                                {/* Text */}
                                <h5 className="uppercase text-xs text-black">
                                    {cat.title}
                                </h5>
                            </Link>
                        ))}
                    </div>
                </div>
            </section >

            <div class="w-full group relative">
                <div class="dark">
                    <img
                        src="https://crepculture.com/wp-content/uploads/2025/08/Heading.svg"
                        alt=""
                        class="w-full h-auto"
                    />
                </div>
            </div>

        </>
    )
}

export default ProductCategory
