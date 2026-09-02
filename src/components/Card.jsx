import React from 'react'
import { Link } from 'react-router-dom'
import { calculateAddedPrice, calculateDiscountedPrice, margin, toaddincutvalue } from '../data/data'

const Card = ({ title, price, coverImg, id, key, calculateAddedPriceHidden, catName, sizeName, primarycat }) => {


    const sizeMap = {
        "35": ["35", "35-3", "35 UK-5", "UK-5", "Size 35"], // Added size 35 based on the pattern
        "36": ["36", "36-3.5", "36-3", "36/3.5", "36/3", "UK-3.5", "U.K-3.5 Euro-36", "EURO 36", "Euro 36", "Size 36", "36-UK4", "36 UK 4", "UK 4"],
        "37": ["37", "37/4", "37/4.5", "37-4", "37-4.5", "UK-4", "U.K-4 Euro-37", "EURO 37", "Euro 37", "M-4", "m-4", "M4", "Size 37", "37 UK-4"],
        "38": ["38", "38/4.5", "38/5", "38-4.5", "38-5", "UK-5", "U.K-5 Euro-38", "EURO 38", "Euro 38", "M-5", "m-5", "M5", "Size 38"],
        "39": ["39", "39/5.5", "39/6", "39-5.5", "39-6", "UK-5.5", "U.K-5.5 Euro-39", "EURO 39", "Euro 39", "M-6", "m-6", "Size 39"],
        "40": ["40", "40/6", "40/6.5", "40/7", "40-6", "40-6.5", "40-7", "40-uk 6.5", "40-uk6", "UK 6", "UK6", "UK-6", "UK 6 / EURO 40", "UK 6|Euro 40", "UK-6 EUR-40", "UK-6 EURO-40", "EURO 40", "Euro 40", "M-6", "m-6", "M6", "Size 40", "6", "6.5", "uk6-m6", "40/uk6/m6", "40 UK 6", "40-UK 6", "40-UK6", "UK 6/EURO 40", "UK 6.5|EURO 40", "UK 6.5/EURO 40"],
        "41": ["41", "41/7", "41/7.5", "41-7", "41-7.5", "41-m7", "UK 7", "UK7", "UK-7", "UK 7 / EURO 41", "UK 7|EURO 41", "UK 7.5|EURO 41", "UK-7 EUR-41", "EURO 41", "Euro 41", "M-7", "m-7", "M7", "Size 41", "7", "7.5", "UK 7/EURO 41", "UK 7.5/EURO 41", "UK7.5/EURO 41", "41/uk7/m7", "41 UK 7", "41-UK 7", "41-UK7", "Euro-41. UK-7", "M7-41"],
        "42": ["42", "42/7.5", "42/8", "42-7.5", "42-8", "42-m8", "UK 8", "UK8", "UK-8", "UK 8 / EURO 42", "UK 8|EURO 42", "UK-8 EUR-42", "EURO 42", "Euro 42", "M-8", "m-8", "M8", "Size 42", "8", "8.5", "UK 8/EURO 42", "42/uk8/m8", "42 UK 8", "42-UK 8", "42-UK8", "Euro-42. UK-7.5", "Euro-42.5 UK-8", "42 UK 7.5"],
        "43": ["43", "43/8.5", "43/9", "43-8.5", "43-9", "43-m9", "UK 9", "UK9", "UK-9", "UK 9 / EURO 43", "UK 9|EURO 43", "UK-9 EUR-43", "EURO 43", "Euro 43", "M-9", "m-9", "M9", "Size 43", "9", "UK 9/EURO 43", "43/uk9/m9", "43 UK 9", "43-UK 9", "43-UK9", "Euro-43. Uk-8.5", "M9-43"],
        "44": ["44", "44/9", "44/9.5", "44/10", "44-9", "44-9.5", "44-10", "44-m10", "UK 10", "UK10", "UK-10", "UK 10 / EURO 44", "UK 10|EURO 44", "UK-10 EUR-44", "EURO 44", "Euro 44", "M-10", "m-10", "M10", "Size 44", "10", "9.5", "UK 10/EURO 44", "44/uk10/m10", "44 UK 10", "44-UK 10", "44-UK10", "Euro-44. Uk-9", "M10-44"],
        "45": ["45", "45/10", "45/10.5", "45/11", "45-10", "45-10.5", "45-11", "45-m11", "UK 11", "UK11", "UK-11", "UK 11 / EURO 45", "UK 11|EURO 45", "UK-11 EUR-45", "EURO 45", "Euro 45", "M-11", "m-11", "M11", "Size 45", "11", "10.5", "UK 11/EURO 45", "45/uk11/m11", "45 UK 11", "45-UK 11", "45-UK11", "Euro-45. Uk-10", "M11-45"],
        "46": ["46", "46/11", "46-11", "46-m12", "UK 12", "UK12", "UK-12", "UK 12 / EURO 47", "EURO 46", "Euro 46", "Size 46", "UK-11 EUR-46"],
        "47": ["47", "47/12", "UK 12 / EURO 47", "Size 47"]
    };

    const normalizeSize = (inputSize) => {

        for (const [baseSize, variants] of Object.entries(sizeMap)) {
            if (variants.includes(inputSize)) {
                return baseSize;
            }
        }
        return inputSize; // fallback if not found
    };

    return (
        <div>
            {/* <div className="w-full h-screen flex justify-center items-center"  key={id}> */}
            <Link to={`/productpage/${id}?cat=${primarycat}`} key={key} className='' target='_blank'>

                <div className="transition duration-300 ease-in-out xl:mb-0 lg:mb-0 md:mb-0 mb-6 cursor-pointer group">
                    <div className="overflow-hidden relative">
                        <img className="w-full transition duration-700 ease-in-out group-hover:opacity-60" src={coverImg} alt="image" style={{ aspectRatio: "1/1", objectFit: 'cover' }} />

                    </div>
                    <div className="px-4 py-3 bg-white">
                        <Link to={`/productpage/${id}`} className=""><h1 className="text-center text-gray-800 font-medium text-sm hover:text-black transition duration-300 ease-in-out line-clamp-2">{title}</h1></Link>

                        {catName !== "Luxury Watch" &&
                            <div className="flex py-2 justify-center">
                                {/* <p className="mr-2 text-sm text-gray-300 line-through">₹{Number(price) + Number(toaddincutvalue)}</p> */}
                                {!calculateAddedPriceHidden ?
                                    <p className="mr-2 text-sm text-gray-300 line-through">₹{calculateAddedPrice(price)}</p>
                                    : ""}
                                {/* <p className="mr-2 text-sm font-semibold text-gray-600">₹{Number(price) + Number(margin)}</p> */}
                                <p className="mr-2 text-sm font-bold text-gray-600"> ₹{calculateDiscountedPrice(price)}</p>
                            </div>
                        }

                        <div className="flex flex-wrap gap-1 mb-2">
                            {(sizeName ? JSON.parse(sizeName) : []).map((size) => {
                                const normalized = normalizeSize(size);
                                return (
                                    <label
                                        key={size}
                                        className="cursor-pointer border border-black-800 text-black-800 text-xs px-1 py-[2px] rounded-none hover:bg-black hover:text-white transition"
                                    >
                                        <input
                                            type="checkbox"
                                            className="hidden"
                                            checked={true}
                                            onChange={() => handleCheckboxChange("sizes", size)}
                                        />
                                        {normalized}
                                    </label>
                                );
                            })}

                            {/* {JSON.parse(product.sizeName).map((size) => (
                        <label
                          key={size}
                          className="btn btn-sm btn-outline-dark rounded-0"
                          style={{ fontSize: "0.8rem", padding: "0.15rem 0.3rem" }}>
                          <input
                            type="checkbox"
                            className="d-none"
                            checked={true}
                            onChange={() => handleCheckboxChange("sizes", size)} />
                          {size}
                        </label>
                      ))} */}
                        </div>
                        {/* <div className="flex">
                                    <div className="">
                                        <i className="fas fa-star text-yellow-400 text-xs"></i>
                                        <i className="fas fa-star text-yellow-400 text-xs"></i>
                                        <i className="fas fa-star text-yellow-400 text-xs"></i>
                                        <i className="fas fa-star text-yellow-400 text-xs"></i>
                                        <i className="far fa-star text-gray-400 text-xs"></i>
                                    </div>
                                    <div className="ml-2">
                                        <p className="text-gray-500 font-medium text-sm">(1)</p>
                                    </div>
                                </div> */}
                    </div>
                </div>

            </Link>
        </div>
        // </div>
    )
}

export default Card
