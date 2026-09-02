import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Slider from 'react-slick';
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
import { brand, calculateDiscountedPrice, calculateSavingsPercentage } from '../data/data'
import Card from '../components/Card';
import VideoModal from '../components/VideoModal';

const baseUrl = import.meta.env.VITE_BASE_URL;

const OriginalProductDetailPageWithprice = () => {
    const { id } = useParams();
    const [product, setproduct] = useState('')
    const [hash, sethash] = useState(window.location.hash)
    const [simillarproducts, setsimillarproducts] = useState("")
    const [selectedImage, setSelectedImage] = useState(""); // Default to the first image
    const [imageUrlArray, setimageUrlArray] = useState("")
    const [showModal, setShowModal] = useState(false);

    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);
    const videoUrl = "https://www.w3schools.com/html/mov_bbb.mp4"; // Replace with your video URL
    const [quantity, setQuantity] = useState(1);

    const increaseQty = () => {
        if (quantity < 9) {
            setQuantity(prev => prev + 1);
        }
    };

    const decreaseQty = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };


    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        swipeToSlide: true,

        // lazyLoad: true,

        className: "slider variable-width",
        variableWidth: true,
        centerMode: true,
        // Disable swiping globally (optional)
        // swipe: false,
        // touchMove: false,

        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 3
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    // slidesToShow: 2,
                    // slidesToScroll: 1,
                    arrows: false,
                    // 👇 Disable swipe specifically for mobile
                    // swipe: false,
                    // touchMove: false,
                    // swipeToSlide: false
                }
            }
        ]
    };


    useEffect(() => {
        console.log(baseUrl);
        sethash(window.location.hash);

        // Fetch product details
        fetch(`${baseUrl}/product/${id}`, {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => {
                setproduct(data.results[0]);
                setSelectedImage(Array.isArray(data.results[0].image) ? data.results.image[0] : data.results[0].featuredimg);
                setimageUrlArray(JSON.parse(data.results[0].imageUrl));
                // setsizes(JSON.parse(data.results[0].sizeName));
                console.log("data", data);
            })
            .catch(error => console.error('Error:', error));

    }, [id]); // Add id as dependency

    useEffect(() => {
        // Fetch similar products only when product is available
        if (product) {
            fetch(`${baseUrl}/product/search?q=${product.productName.slice(0, 3)}&category=${product.catName}&result=30&page=1`, {
                method: 'GET',
            })
                .then(response => response.json())
                .then(data => {
                    setsimillarproducts(data.results);
                    console.log(data.results);
                })
                .catch(error => console.error('Error in Similar:', error));
        }
    }, [product]); // This remains unchanged
    return (
        <>
            <div>
                {/* <div className="bg-indigo-700 text-indigo-200 md:text-center py-2 px-4">
                Inspired from Dribbble Shot by <a href="https://dribbble.com/shots/14127375-Product-Page" className="font-bold underline hover:text-indigo-100">Vishnu Prasad</a>.
                See his works on <a href="https://dribbble.com/vlockn" className="font-bold underline hover:text-indigo-100">Dribbble</a>.
            </div>

            <div className="bg-white shadow-sm sticky top-0">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1 md:py-4">
                    <div className="flex items-center justify-between md:justify-start">
                        <button type="button" className="md:hidden w-10 h-10 rounded-lg -ml-2 flex justify-center items-center">
                            <svg className="text-gray-500 w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>

                        <a href="#" className="font-bold text-gray-700 text-2xl">Shop.</a>

                        <div className="hidden md:flex space-x-3 flex-1 lg:ml-8">
                            <a href="#" className="px-2 py-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600">Electronics</a>
                            <a href="#" className="px-2 py-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600">Fashion</a>
                            <a href="#" className="px-2 py-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600">Tools</a>
                            <a href="#" className="px-2 py-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600">Books</a>
                            <a href="#" className="px-2 py-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600">More</a>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="relative hidden md:block">
                                <input type="search" className="pl-10 pr-2 h-10 py-1 rounded-lg border border-gray-200 focus:border-gray-300 focus:outline-none focus:shadow-inner leading-none" placeholder="Search" />
                                <svg className="h-6 w-6 text-gray-300 ml-2 mt-2 stroke-current absolute top-0 left-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>

                            <a href="#" className="flex h-10 items-center px-2 rounded-lg border border-gray-200 hover:border-gray-300 focus:outline-none hover:shadow-inner">
                                <svg className="h-6 w-6 leading-none text-gray-300 stroke-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                <span className="pl-1 text-gray-500 text-md">0</span>
                            </a>

                            <button type="button" className="hidden md:block w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 flex justify-center items-center">
                                <img src="https://avatars.dicebear.com/api/bottts/2.svg" alt="bottts" width="28" height="28" className="rounded-lg mx-auto" />
                            </button>
                        </div>
                    </div>

                    <div className="relative md:hidden">
                        <input type="search" className="mt-1 w-full pl-10 pr-2 h-10 py-1 rounded-lg border border-gray-200 focus:border-gray-300 focus:outline-none focus:shadow-inner leading-none" placeholder="Search" />

                        <svg className="h-6 w-6 text-gray-300 ml-2 mt-3 stroke-current absolute top-0 left-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                </div>
            </div> */}

                <div className="">
                    {/* Bread crums */}
                    {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center space-x-2 text-gray-400 text-sm">
                        <a href="#" className="hover:underline hover:text-gray-600">Home</a>
                        <span>
                            <svg className="h-5 w-5 leading-none text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </span>
                        <a href="#" className="hover:underline hover:text-gray-600">Electronics</a>
                        <span>
                            <svg className="h-5 w-5 leading-none text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </span>
                        <span>Headphones</span>
                    </div>
                </div> */}

                    <div className=" max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
                        <div className="flex flex-col md:flex-row -mx-4">
                            <div className="md:flex-1 px-4 grid-cols-4">
                                {/* Main Display Area */}
                                <div className="aspect-square rounded-lg bg-gray-100 mb-4 flex items-center justify-center">
                                    {/* <span className="text-5xl">{selectedImage}</span> */}
                                    <img
                                        src={selectedImage}
                                        alt={product.productName}
                                        className="img-fluid rounded"
                                        style={{
                                            // height: '500px',
                                            objectFit: 'cover', width: '100%',
                                            aspectRatio: "1/1"
                                        }}
                                    />
                                </div>

                                {/* Buttons */}
                                <div className="flex -mx-2 mb-4">
                                    {
                                        Array.isArray(imageUrlArray) ? imageUrlArray.map((image, index) => (
                                            <div key={index} className="w-1/4 p-2">
                                                <img
                                                    src={image}
                                                    alt={`${product.productName} thumbnail ${index + 1}`}
                                                    className={`w-full h-[100px] object-cover rounded cursor-pointer border ${selectedImage === image ? 'border-black' : 'border-gray-300'}`}
                                                    style={{ aspectRatio: "1 / 1" }}
                                                    onClick={() => setSelectedImage(image)}
                                                />
                                            </div>
                                        )) : null
                                    }


                                    {/* {buttons.map((i) => (
                                    <div key={i} className="flex-1 px-2">
                                        <button
                                            onClick={() => setSelectedImage(i)}
                                            className={`focus:outline-none w-full rounded-lg h-24 md:h-32 bg-gray-100 flex items-center justify-center ${selectedImage === i ? 'ring-2 ring-indigo-300 ring-inset' : ''
                                                }`}
                                        >
                                            <span className="text-2xl">{i}</span>
                                        </button>
                                    </div>
                                ))} */}
                                </div>
                            </div>

                            <div className="md:flex-1 px-4">
                                <h2 className="mb-2 leading-tight tracking-tight font-bold text-[#1e2939] text-2xl md:text-3xl">
                                    {product.productName}
                                </h2>
                                <p className="text-gray-500 text-sm">
                                    By{' '}
                                    <a href="#" className="text-[#1e2939] hover:underline font-medium">
                                        {brand}
                                    </a>
                                </p>

                                <div className="flex items-center space-x-4 my-4">
                                    <div>
                                        <div className="rounded-lg bg-gray-100 flex py-2 px-3">
                                            <span className="text-[#1e2939] mr-1 mt-1">₹</span>
                                            <span className="font-bold text-[#1e2939] text-3xl">
                                                {calculateDiscountedPrice(product.productOriginalPrice)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-green-500 text-xl font-semibold">Save {calculateSavingsPercentage(product.productOriginalPrice)}%</p>
                                        <p className="text-gray-400 text-sm">Inclusive of all Taxes.</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4 py-4">
                                    {/* Quantity Controls */}
                                    {/* <div className="flex items-center border border-[#1e2939] rounded-xl overflow-hidden">
                                    <button
                                        type="button"
                                        onClick={decreaseQty}
                                        className="px-4 py-2 text-lg font-semibold text-[#1e2939] hover:bg-gray-200"
                                    >
                                        −
                                    </button>

                                    <span className="px-6 py-2 text-lg font-medium text-[#1e2939]">
                                        {quantity}
                                    </span>

                                    <button
                                        type="button"
                                        onClick={increaseQty}
                                        className="px-4 py-2 text-lg font-semibold text-[#1e2939] hover:bg-gray-200"
                                    >
                                        +
                                    </button>
                                </div> */}

                                    {/* Add to Cart Button */}
                                    {product.videoUrl && (
                                        <>
                                            <button
                                                onClick={openModal}
                                                className="h-14 px-6 py-2 font-semibold rounded-xl bg-[#1e2939] hover:bg-[#2a3950] text-white transition-colors"
                                            >
                                                Live Video
                                            </button>

                                            <VideoModal
                                                isOpen={showModal}
                                                onClose={closeModal}
                                                videoUrl={product.videoUrl}
                                                name={product.productName}
                                            />
                                        </>
                                    )}

                                    {/* <button
                                        onClick={() => {
                                            console.log(`Added ${quantity} item(s) to cart`);
                                            const whatsappUrl = `https://api.whatsapp.com/send?phone=919586235982&text=${encodeURIComponent(
                                                `📦 *Product*\n\n🛍️ Product: ${product.productName}\n💰 Price: ${product.productOriginalPrice}\n🔗 URL: ${window.location.href}`
                                            )}`;
                                            window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
                                        }}
                                        className="h-14 px-6 py-2 font-semibold rounded-xl bg-[#1e2939] hover:bg-[#2a3950] text-white transition-colors text-center"
                                    >
                                        Buy via WhatsApp
                                    </button> */}



                                </div>

                                <p className="text-red-500 text-xl font-semibold">{product.productOriginalPrice}</p>
                                <a href={product.productUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 ">{product.productUrl}</a>

                                {/* Why Choose Us Section */}
                                <div className="mt-10">
                                    <h2 className="text-2xl font-semibold mb-4 text-[#1e2939]">
                                        Why Choose Us?
                                    </h2>

                                    <ul className="list-disc list-inside space-y-2 text-[#1e2939]">
                                        <li>Authentic Timepieces Only – No Replicas or Fakes</li>
                                        <li>Comes with Original Branded Watch Box</li>
                                        <li>Sourced Directly from Trusted Distributors</li>
                                        <li>10,000+ Satisfied Customers & Counting</li>
                                        <li>Live Product Videos Available Before Dispatch</li>
                                        <li>Fast & Secure Shipping Across India</li>
                                    </ul>

                                    <div className="mt-6 text-[#1e2939]">
                                        <p className="font-bold">Trust the Name – TimeLuxe</p>
                                        <p>- Where precision meets prestige</p>
                                        <p>
                                            - We deliver premium watches at the best price without compromising on
                                            authenticity or style.
                                        </p>
                                    </div>

                                    <div className="mt-4 text-[#1e2939]">
                                        <p>- Want to see it before you buy?</p>
                                        <p>
                                            - Live videos available on <span className="font-medium">WhatsApp</span>.
                                            Just message us!
                                        </p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Similar Products */}
                    <div className="mt-5 max-w-7xl mx-auto pt-10 px-4">
                        <h2 className="text-2xl font-semibold mb-4 text-[#1e2939]">Similar Products</h2>

                        {simillarproducts && simillarproducts.length > 0 ? (
                            <Slider {...settings}>
                                {simillarproducts.map(similarProduct => (
                                    // <div
                                    //     key={similarProduct.productId}
                                    //     className="px-2"
                                    //     style={{ width: '200px' }}
                                    // >

                                    // </div>

                                    <div key={similarProduct.productId}>
                                        <div className="w-50 mx-3">
                                            <Card
                                                key={similarProduct.productId}
                                                title={similarProduct.productName}
                                                price={similarProduct.productOriginalPrice}
                                                coverImg={similarProduct.featuredimg}
                                                id={similarProduct.productId}

                                            />
                                        </div>
                                    </div>
                                ))}
                            </Slider>
                        ) : (
                            <p className="text-gray-500">No results found</p>
                        )}
                    </div>
                </div>





            </div>
        </>
    )
}

export default OriginalProductDetailPageWithprice
