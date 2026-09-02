import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import Slider from 'react-slick';
import { box, brand, Brandphone, calculateAddedPrice, calculateDiscountedPrice, calculateSavingsPercentage } from '../data/data'
import Card from '../components/Card';
import VideoModal from '../components/VideoModal';
import Loader from '../components/Loader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeadset, faMoneyBillWave, faCheckCircle, faUndo } from '@fortawesome/free-solid-svg-icons';
import {
    ComputerDesktopIcon,
    PhoneArrowUpRightIcon,
    VideoCameraIcon,
    CubeIcon,
} from "@heroicons/react/24/solid";
import { Truck, Recycle, Tag } from "lucide-react";
import { msterCode } from '../data/data'
import { useLocation } from 'react-router-dom';
import BoxSelector from '../components/BoxSelector';
import { boxOptions } from '../data/data.jsx';

const baseUrl = import.meta.env.VITE_BASE_URL;
const liveUrl = import.meta.env.VITE_LIVE_URL;


const ProductDetailPage = () => {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const catmasster = searchParams.get("cat");

    // Get left side (category)
    let category = null;
    if (catmasster) {
        category = catmasster.split("/")[0]; // left side
    }

    let mastercodeurl = null;
    if (catmasster && catmasster.includes("/")) {
        const parts = catmasster.split("/");
        mastercodeurl = parts[1]; // right side
    }

    console.log(mastercodeurl); // -> "viaksh" for "watches/viaksh"

    const [product, setproduct] = useState('');
    const [hash, sethash] = useState(window.location.hash);
    const [simillarproducts, setsimillarproducts] = useState('');
    const [selectedImage, setSelectedImage] = useState('');
    const [imageUrlArray, setimageUrlArray] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [openIndex, setOpenIndex] = useState(null);
    const location = useLocation();

    // ─── Box selector (watches only) ────────────────────────────────────────────
    const [wantsBox, setWantsBox] = useState(null);
    const [selectedBox, setSelectedBox] = useState('');
    const selectedBoxData = boxOptions.find((o) => o.id === selectedBox) || null;

    // ─── Shoes: size selector ───────────────────────────────────────────────────
    const [sizes, setsizes] = useState([]);
    const [selectedSize, setSelectedSize] = useState('');
    const [sizeError, setSizeError] = useState('');

    // ─── Shoes: "Request for size" modal ────────────────────────────────────────
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', contact: '', email: '', size: '' });
    const [formErrors, setFormErrors] = useState({});

    // ─── Video modal ─────────────────────────────────────────────────────────────
    const openVideoModal = () => setShowModal(true);
    const closeVideoModal = () => setShowModal(false);

    // ─── Size normalisation map ──────────────────────────────────────────────────
    const sizeMap = {
        "35": ["35", "35-3", "35 UK-5", "UK-5", "Size 35"],
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
            if (variants.includes(inputSize)) return baseSize;
        }
        return inputSize;
    };

    // ─── Form validation ─────────────────────────────────────────────────────────
    const validateForm = () => {
        const errors = {};
        if (!formData.name.trim()) errors.name = 'Name is required';
        if (!formData.contact.trim()) {
            errors.contact = 'Contact number is required';
        } else if (!/^\d{10}$/.test(formData.contact.trim())) {
            errors.contact = 'Contact must be a valid 10-digit number';
        }
        if (!formData.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email.trim())) {
            errors.email = 'Enter a valid email';
        }
        if (!formData.size.trim()) errors.size = 'Size is required';
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const isShoes = (category ?? '').toLowerCase() === 'shoes';

    // ─── Accordion ───────────────────────────────────────────────────────────────
    const toggle = (index) => setOpenIndex(openIndex === index ? null : index);

    const accordions = [
        {
            question: "How PRODUCT DESCRIPTION",
            answer: (
                <div className="space-y-2 text-gray-700 text-base leading-relaxed">
                    <p>This Product is the <span className="font-semibold">Same as Original Quality Master Copy</span> with <span className="font-semibold">3 month Machine Replacement Warranty</span>.</p>
                    <p><span className="font-bold">If you want the original box kit, extra charges apply!</span></p>
                    <p>Cash on Delivery available all over India.</p>
                    <p>All Chrono working.</p>
                    <p>Approximate delivery time: <span className="italic">4-6 days</span>.</p>
                </div>
            )
        },
        {
            question: "BOX POLICY",
            answer: (
                <div className="space-y-3 text-gray-700 text-base leading-relaxed">
                    <p><strong>Standard packaging:</strong> Every watch is shipped in a secure, high-quality protective box suitable for safe delivery. This is included with every order at <span className="font-semibold">no extra cost</span>.</p>
                    <p><strong>Original / Brand box:</strong> Extra charges apply if an original or brand box is available for your selected watch.</p>
                </div>
            ),
        },
        {
            question: "RETURN POLICY",
            answer: (
                <div className="space-y-3 text-gray-700 text-base leading-relaxed">
                    <p><strong>Exchange & Store Credit Policy</strong></p>
                    <p>At <em>AquaWatch</em>, we do not offer cash refunds. Instead, we provide easy exchange and store credit options.</p>
                    <p><strong>Exchange Window:</strong> You may request an exchange within <strong>48 hours of delivery</strong>.</p>
                    <ol className="list-decimal list-inside ml-4 text-gray-600">
                        <li>Item must be unused and in original packaging.</li>
                        <li>All original tags, accessories, and documentation must be included.</li>
                        <li>The protective <em>polythene/film on the watch must be intact</em>.</li>
                        <li>A <em>clear unboxing video (from start to finish)</em> is required.</li>
                    </ol>
                    <p><strong>Store Credit:</strong> If you don't wish to exchange immediately, the product value will be credited as <em>store credit</em>.</p>
                    <p><strong>Damaged / Defective Items:</strong> Free replacement subject to unboxing video proof.</p>
                </div>
            ),
        }
    ];

    const steps = [
        { title: "ORDER NOW", Icon: ComputerDesktopIcon },
        { title: "OUR SALES TEAM CALL YOU", Icon: PhoneArrowUpRightIcon },
        { title: "VIDEO CALL FACILITY", Icon: VideoCameraIcon },
        { title: "DELIVERY", Icon: CubeIcon },
    ];

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        swipeToSlide: true,
        className: "slider variable-width",
        variableWidth: true,
        centerMode: true,
        responsive: [
            { breakpoint: 1024, settings: { slidesToShow: 4, slidesToScroll: 3 } },
            { breakpoint: 768, settings: { slidesToShow: 3, slidesToScroll: 2 } },
            { breakpoint: 480, settings: { arrows: false } }
        ]
    };

    // ─── Fetch product ────────────────────────────────────────────────────────────
    useEffect(() => {
        if (!id || !category || category === 'undefined') {
            window.location.href = '/';
            return;
        }
        sethash(window.location.hash);

        fetch(`${liveUrl}/dev/update-single-product?productId=${id}&productDb=${category}`, { method: 'GET' })
            .then(res => {
                // If the live response fails (status is not 200-299), throw an error to jump to the fallback
                if (!res.ok) {
                    throw new Error(`Live URL failed with status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                // Process the data from the live URL
                if (data.results && data.results.length > 0) {
                    const p = data.results[0];
                    setproduct(p);
                    setSelectedImage(Array.isArray(p.image) ? p.image[0] : p.featuredimg);
                    setimageUrlArray(JSON.parse(p.imageUrl));

                    // Parse sizes only for shoes
                    if (category === 'shoes') {
                        const parsedSizes = JSON.parse(p.sizeName);
                        setsizes(parsedSizes);
                    }
                }
            })
            .catch(error => {
                console.warn('Live fetch failed, trying fallback baseUrl...', error);

                // Fallback fetch to baseUrl
                return fetch(`${baseUrl}/product/${id}?cat=${category}`, { method: 'GET' })
                    .then(fallbackRes => {
                        if (!fallbackRes.ok) {
                            throw new Error(`Fallback URL also failed with status: ${fallbackRes.status}`);
                        }
                        return fallbackRes.json();
                    })
                    .then(data => {
                        // Process the data from the fallback URL
                        if (data.results && data.results.length > 0) {
                            const p = data.results[0];
                            setproduct(p);
                            setSelectedImage(Array.isArray(p.image) ? p.image[0] : p.featuredimg);
                            setimageUrlArray(JSON.parse(p.imageUrl));

                            // Parse sizes only for shoes
                            if (category === 'shoes') {
                                const parsedSizes = JSON.parse(p.sizeName);
                                setsizes(parsedSizes);
                            }
                        }
                    })
                    .catch(fallbackError => {
                        console.error('Both live and fallback fetches failed:', fallbackError);
                    });
            });
    }, [id, category]);

    // ─── Fetch similar products ───────────────────────────────────────────────────
    useEffect(() => {
        if (product) {
            fetch(`${baseUrl}/product/search?q=${product.productName.slice(0, 3)}&category=${product.catName}&result=30&page=1`, { method: 'GET' })
                .then(res => res.json())
                .then(data => setsimillarproducts(data.results))
                .catch(error => console.error('Error in Similar:', error));
        }
    }, [product]);

    return (
        <>
            {product === '' ? <Loader /> : (
                <div className="">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
                        <div className="flex flex-col md:flex-row -mx-4">

                            {/* ── Left: Images ── */}
                            <div className="md:flex-1 px-4 grid-cols-4">
                                <div className="aspect-square rounded-lg bg-gray-100 mb-4 flex items-center justify-center">
                                    <img
                                        src={selectedImage}
                                        alt={product.productName}
                                        className="img-fluid rounded"
                                        style={{ objectFit: 'cover', width: '100%', aspectRatio: '1/1' }}
                                    />
                                </div>

                                <div className="flex -mx-2 mb-4">
                                    {Array.isArray(imageUrlArray) ? imageUrlArray.map((image, index) => (
                                        <div key={index} className="w-1/4 p-2">
                                            <img
                                                src={image}
                                                alt={`${product.productName} thumbnail ${index + 1}`}
                                                className={`w-full h-[100px] object-cover rounded cursor-pointer border ${selectedImage === image ? 'border-black' : 'border-gray-300'}`}
                                                style={{ aspectRatio: '1 / 1' }}
                                                onClick={() => setSelectedImage(image)}
                                            />
                                        </div>
                                    )) : null}
                                </div>
                            </div>

                            {/* ── Right: Details ── */}
                            <div className="md:flex-1 px-4">
                                <h2 className="mb-2 leading-tight tracking-tight font-bold text-black text-2xl md:text-3xl">
                                    {product.productName}
                                </h2>
                                <p className="text-gray-500 text-sm">
                                    By{' '}
                                    <a href="#" className="text-black hover:underline font-medium">
                                        {brand}
                                    </a>
                                </p>


                                {mastercodeurl === msterCode && (
                                    <div className="mt-4 space-y-2">
                                        <p className="text-2xl font-semibold text-gray-900">
                                            ${product.productOriginalPrice}
                                        </p>

                                        <a
                                            href={product.productUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block text-lg font-medium text-blue-600 hover:text-blue-800 underline"
                                        >
                                            {product.productFetchedFrom}
                                        </a>
                                    </div>
                                )}

                                {/* Price (watches only) */}

                                <div className="flex items-center space-x-4 my-4">
                                    <div className="flex py-2 pe-3">
                                        <span className="text-gray-300 mr-1 mt-1">₹</span>
                                        <span className="font-semibold text-gray-300 text-3xl line-through pe-3">
                                            {parseInt(calculateAddedPrice(product.productOriginalPrice))}
                                        </span>
                                        <span className="text-black mr-1 mt-1">₹</span>
                                        <span className="font-semibold text-black text-4xl">
                                            {parseInt(calculateDiscountedPrice(product.productOriginalPrice))}
                                        </span>
                                    </div>
                                </div>

                                {console.log(product.dbName)}
                                {/* ── Box selector: watches only ── */}
                                {!isShoes && product.dbName === 'watches' && (
                                    <div className="p-4 bg-white rounded-xl shadow-md w-full max-w-lg space-y-4">
                                        <div className="flex items-center gap-4">
                                            <span className="font-semibold text-gray-800">Buy with Box</span>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input type="radio" name="boxAvailable" value="yes" checked={wantsBox === 'yes'} onChange={() => setWantsBox('yes')} />
                                                Yes
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input type="radio" name="boxAvailable" value="no" checked={wantsBox === 'no'} onChange={() => { setWantsBox('no'); setSelectedBox(''); }} />
                                                No
                                            </label>
                                        </div>

                                        {wantsBox === 'yes' && (
                                            <div className="flex flex-col gap-2">
                                                <span className="text-gray-700 font-medium">Select Box</span>
                                                <select
                                                    value={selectedBox}
                                                    onChange={(e) => setSelectedBox(e.target.value)}
                                                    className="border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-black"
                                                >
                                                    <option value="">Choose a Box</option>
                                                    {boxOptions.map((opt) => (
                                                        <option key={opt.id} value={opt.id}>
                                                            {opt.name} (+₹{opt.price})
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}

                                        {selectedBox !== '' && selectedBoxData && (
                                            <>
                                                <div className="w-full bg-white rounded-lg shadow-md p-4 flex gap-4">
                                                    <div className="w-32 h-32 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                                                        {selectedBoxData.image ? (
                                                            <img src={selectedBoxData.image} alt={selectedBoxData.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Image</div>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col justify-between flex-1">
                                                        <div>
                                                            <h4 className="text-lg font-semibold">{selectedBoxData.name}</h4>
                                                            {selectedBoxData.price && (
                                                                <div className="flex py-2 pe-3">
                                                                    <span className="text-gray-300 mr-1 mt-1 text-sm">₹</span>
                                                                    <span className="font-semibold text-black text-2xl">{selectedBoxData.price}</span>
                                                                </div>
                                                            )}
                                                            {selectedBoxData.link && (
                                                                <a href={selectedBoxData.link} target="_blank" className="text-blue-600 underline text-sm mt-1 inline-block">
                                                                    View product
                                                                </a>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="w-full max-w-sm bg-white rounded-xl p-4 space-y-3">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="font-medium text-gray-700">Options Amount</span>
                                                        <span className="font-semibold text-gray-900">₹{selectedBoxData.price}</span>
                                                    </div>
                                                    <div className="border-t"></div>
                                                    <div className="flex justify-between text-base">
                                                        <span className="font-semibold text-gray-800">Final Total</span>
                                                        <span className="font-bold text-black">₹{parseInt(calculateDiscountedPrice(product.productOriginalPrice)) + selectedBoxData.price}</span>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}

                                {/* ── Size selector: shoes only ── */}
                                {isShoes && (
                                    <div className="my-5">
                                        {sizes.length === 0 || JSON.stringify(sizes) === '[]' ? (
                                            <button className="w-full py-3 bg-red-500 text-white font-semibold rounded-xl cursor-not-allowed" disabled>
                                                Out of Stock
                                            </button>
                                        ) : (
                                            <>
                                                <h5 className="font-semibold text-gray-800 mb-3">Select Size</h5>
                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    {sizes.map((size) => {
                                                        const normalized = normalizeSize(size);
                                                        return (
                                                            <button
                                                                key={size}
                                                                onClick={() => { setSelectedSize(size); setSizeError(''); }}
                                                                className={`px-4 py-2 border rounded-lg font-medium text-sm transition-colors ${selectedSize === size
                                                                    ? 'bg-black text-white border-black'
                                                                    : 'bg-white text-black border-gray-300 hover:border-black'
                                                                    }`}
                                                            >
                                                                {normalized}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                                {sizeError && <p className="text-red-500 text-sm mb-3">{sizeError}</p>}

                                                {/* Request for Size button */}
                                                <button
                                                    onClick={() => setShowRequestModal(true)}
                                                    className="w-full py-3 border-2 border-black text-black font-semibold rounded-xl hover:bg-black hover:text-white transition-colors mb-3"
                                                >
                                                    Request for size
                                                </button>
                                            </>
                                        )}
                                    </div>
                                )}

                                {/* ── Action buttons ── */}
                                <div className="flex items-center space-x-4 py-4">
                                    {product.videoUrl && (
                                        <>
                                            <button
                                                onClick={openVideoModal}
                                                className="h-14 px-6 py-2 font-semibold rounded-xl bg-black hover:bg-neutral-800 text-white transition-colors"
                                            >
                                                Live Video
                                            </button>
                                            <VideoModal
                                                isOpen={showModal}
                                                onClose={closeVideoModal}
                                                videoUrl={product.videoUrl}
                                                name={product.productName}
                                            />
                                        </>
                                    )}

                                    <button
                                        onClick={() => {
                                            // For shoes: require a size selection
                                            if (isShoes && !selectedSize) {
                                                setSizeError('Please select a size before continuing.');
                                                return;
                                            }

                                            // For watches: require box selection if wantsBox = yes
                                            if (!isShoes && wantsBox === 'yes' && (!selectedBox || !selectedBoxData)) {
                                                alert('Please select a box before proceeding.');
                                                return;
                                            }

                                            const productDiscounted = parseInt(calculateDiscountedPrice(product.productOriginalPrice));
                                            const productAddedPrice = parseInt(calculateAddedPrice(product.productOriginalPrice));

                                            const includeBox = !isShoes && wantsBox === 'yes' && selectedBox !== '' && selectedBoxData;
                                            const boxText = includeBox
                                                ? `🎁 *Selected Box*: ${selectedBoxData.name}\n💵 *Box Price*: ₹${selectedBoxData.price}\n-----------------------------------\n🧮 *Total Price*: ₹${productDiscounted + selectedBoxData.price}\n\n`
                                                : '';

                                            const priceText = !isShoes && product.catName !== 'Luxury Watch'
                                                ? `💰 *Price*: ~₹${productAddedPrice}~ → *₹${productDiscounted}*\n\n`
                                                : '';

                                            const sizeText = isShoes && selectedSize
                                                ? `👟 *Size*: ${selectedSize}\n`
                                                : '';

                                            const whatsappUrl = `https://api.whatsapp.com/send?phone=${Brandphone}&text=${encodeURIComponent(
                                                `📦 *Product Details*\n\n` +
                                                `🛍️ *Product*: ${product.productName}\n` +
                                                sizeText +
                                                priceText +
                                                boxText +
                                                `🔗 *URL*: ${window.location.href}`
                                            )}`;

                                            window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
                                        }}
                                        className="h-14 px-6 py-2 font-semibold rounded-xl bg-black hover:bg-neutral-800 text-white transition-colors text-center"
                                    >
                                        Buy via WhatsApp
                                    </button>
                                </div>

                                {location.pathname.includes(msterCode) && (
                                    <>
                                        <p className="text-red-500 text-xl font-semibold">{product.productOriginalPrice}</p>
                                        <a href={product.productUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500">{product.productUrl}</a>
                                    </>
                                )}

                                {/* Shipping info */}
                                <section className="py-4">
                                    <div className="container mx-auto px-4 text-center">
                                        <p className="font-semibold mb-8 text-left">
                                            SHIPPING DAYS: <span className="font-normal">4 TO 7 DAYS</span>
                                        </p>
                                        <div className="grid grid-cols-3 gap-8">
                                            <div className="flex flex-col items-center">
                                                <Truck className="w-10 h-10 mb-3 text-black" />
                                                <p className="text-sm font-medium">Free Delivery</p>
                                            </div>
                                            <div className="flex flex-col items-center">
                                                <Recycle className="w-10 h-10 mb-3 text-black" />
                                                <p className="text-sm font-medium">48 Hours Returnable</p>
                                            </div>
                                            <div className="flex flex-col items-center">
                                                <Tag className="w-10 h-10 mb-3 text-black" />
                                                <p className="text-sm font-medium">Cash On Delivery</p>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Accordion */}
                                <div className="w-full max-w-2xl mx-auto my-6">
                                    {accordions.map((accordion, index) => (
                                        <div key={index} className="border border-neutral-300 border-s-0 border-e-0 overflow-hidden">
                                            <button
                                                onClick={() => toggle(index)}
                                                className="w-full flex justify-between items-center px-6 py-4 text-left font-semibold bg-white hover:bg-gray-50"
                                            >
                                                <span className="text-base tracking-wide">{accordion.question}</span>
                                                <span className={`transform transition-transform duration-300 ${openIndex === index ? 'rotate-90' : 'rotate-0'} text-lg`}>
                                                    &gt;
                                                </span>
                                            </button>
                                            <div className={`transition-all duration-300 overflow-hidden bg-gray-50 px-6 ${openIndex === index ? 'py-4' : 'max-h-0 py-0'} text-sm text-gray-700`}>
                                                {accordion.answer}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Step by step */}
                                <div className="flex flex-col items-center p-6 bg-purple-100 rounded-xl max-w-3xl mx-auto">
                                    <h2 className="text-xl font-bold text-purple-900 mb-6">STEP BY STEP</h2>
                                    <div className="flex flex-col md:flex-row items-center md:justify-between w-full gap-6">
                                        {steps.map((step, idx) => (
                                            <div key={idx} className="flex flex-col items-center text-center relative">
                                                <step.Icon className="w-14 h-14 text-purple-700 mb-2" />
                                                <p className="text-sm font-semibold text-purple-800">{step.title}</p>
                                                {idx !== steps.length - 1 && (
                                                    <span className="hidden md:block absolute right-[-32px] top-6 text-purple-600 text-2xl">→</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-6 w-full">
                                        <button
                                            onClick={() => {
                                                const whatsappUrl = `https://api.whatsapp.com/send?phone=${Brandphone}&text=${encodeURIComponent(
                                                    `👋 Hello,\n\nI'm interested in moving forward through the *Step by Step* process on your site.\n\n🛍️ *Product*: ${product.productName}\n💰 *Price*: ~₹${parseInt(calculateAddedPrice(product.productOriginalPrice))}~ → *₹${parseInt(calculateDiscountedPrice(product.productOriginalPrice))}*\n🔗 *Product Link*: ${window.location.href}\n\nCan you please guide me with the next steps?`
                                                )}`;
                                                window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
                                            }}
                                            className="bg-purple-400 text-white rounded-full py-3 px-6 text-center font-medium shadow-md cursor-pointer w-full"
                                        >
                                            💬 Chat with Support: {Brandphone}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Similar Products */}
                    <div className="mt-5 max-w-7xl mx-auto pt-10 px-4">
                        <h2 className="text-2xl font-semibold mb-4 text-black">Similar Products</h2>
                        {simillarproducts && simillarproducts.length > 0 ? (
                            <Slider {...settings}>
                                {simillarproducts.map(similarProduct => (
                                    <div key={similarProduct.productId}>
                                        <div className="w-50 mx-3">
                                            <Card
                                                key={similarProduct.productId}
                                                title={similarProduct.productName}
                                                price={similarProduct.productOriginalPrice}
                                                coverImg={similarProduct.featuredimg}
                                                id={similarProduct.productId}
                                                catName={similarProduct.catName}
                                                primarycat={similarProduct.primarycat}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </Slider>
                        ) : (
                            <p className="text-gray-500">No results found</p>
                        )}
                    </div>

                    {/* ── Request for Size Modal (shoes only) ── */}
                    {showRequestModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4">
                                <div className="flex items-center justify-between px-6 py-4 border-b">
                                    <h5 className="font-bold text-lg">Request Size for Product</h5>
                                    <button onClick={() => setShowRequestModal(false)} className="text-gray-400 hover:text-black text-2xl leading-none">&times;</button>
                                </div>

                                <div className="px-6 py-4 space-y-4">
                                    {/* Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                                        <input
                                            type="text"
                                            className={`w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-black ${formErrors.name ? 'border-red-500' : 'border-gray-300'}`}
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                        {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
                                    </div>

                                    {/* Contact */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                                        <input
                                            type="tel"
                                            className={`w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-black ${formErrors.contact ? 'border-red-500' : 'border-gray-300'}`}
                                            value={formData.contact}
                                            onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                                        />
                                        {formErrors.contact && <p className="text-red-500 text-xs mt-1">{formErrors.contact}</p>}
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                        <input
                                            type="email"
                                            className={`w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-black ${formErrors.email ? 'border-red-500' : 'border-gray-300'}`}
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                        {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                                    </div>

                                    {/* Product Name (read-only) */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                                        <input
                                            type="text"
                                            className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 text-gray-500"
                                            value={product.productName}
                                            disabled
                                        />
                                    </div>

                                    {/* Preferred Size */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Size</label>
                                        <input
                                            type="text"
                                            className={`w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-black ${formErrors.size ? 'border-red-500' : 'border-gray-300'}`}
                                            value={formData.size}
                                            onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                                        />
                                        {formErrors.size && <p className="text-red-500 text-xs mt-1">{formErrors.size}</p>}
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 px-6 py-4 border-t">
                                    <button
                                        onClick={() => setShowRequestModal(false)}
                                        className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
                                    >
                                        Close
                                    </button>
                                    <button
                                        disabled={!formData.name.trim() || !formData.contact.trim() || !formData.email.trim() || !formData.size.trim()}
                                        onClick={() => {
                                            if (validateForm()) {
                                                const message = `📦 *Product Request*\n\n👤 Name: ${formData.name}\n📱 Contact: ${formData.contact}\n📧 Email: ${formData.email}\n🛍️ Product: ${product.productName}\n👟 Requested Size: ${formData.size}\n🔗 URL: ${window.location.href}`;
                                                window.open(`https://api.whatsapp.com/send?phone=${Brandphone}&text=${encodeURIComponent(message)}`, '_blank');
                                                setShowRequestModal(false);
                                            }
                                        }}
                                        className="px-4 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Send via WhatsApp
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default ProductDetailPage;