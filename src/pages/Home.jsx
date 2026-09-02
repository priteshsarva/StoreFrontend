import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Herosection from '../components/Herosection';
import Card from '../components/Card';
import ShoeCarousel from '../components/ShoeCarousel';
import { joinUsOnWhatsapp, products } from '../data/data';
import ProductCategory from '../components/ProductCategory';
import SingleCollection from '../components/SingleCollection';
import ShopbyBrand from '../components/ShopbyBrand';
import AquwawacthJoinFamily from '../assets/Aquwawacth-join-family.png';
import ReadyToDispatch from '../components/ReadyToDispatch';
import Loader from '../components/Loader';
import Testimonials from '../components/Testimonials';
import PromoBar from '../components/PromoBar';

const baseUrl = import.meta.env.VITE_BASE_URL;




const Home = () => {
    const [product, setproduct] = useState("")
    let urls = `${baseUrl}/product/firstdata`;

    useEffect(() => {
        if (product == '') {
            fetch(urls, {
                method: 'GET',
            })
                .then(response => response.json())
                .then(data => {

                    const grouped = Object.values(
                        data.results.reduce((acc, item) => {
                            if (!acc[item.primarycat]) {
                                acc[item.primarycat] = {
                                    primarycat: item.primarycat,
                                    products: []
                                };
                            }

                            acc[item.primarycat].products.push(item);
                            return acc;
                        }, {})
                    );



                    setproduct(grouped);
                    // setproduct(data.results);
                    // setSearchResults(data.results);
                })
                .catch(error => console.error('Error:', error));
        }
    }, [product])



    return (
        <>
            <Herosection />
            {/* <PromoBar /> */}
            {product == "" ?
                <Loader />
                : <>
                    {/* <div className="relative w-full aspect-[3/1]">
                        <img
                            src={AquwawacthJoinFamily}
                            alt="Join Us"
                            className="absolute top-0 left-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Link
                                to={joinUsOnWhatsapp}
                                target='_blank'
                                className="mt-6 inline-flex items-center justify-center bg-white text-gray-900 font-semibold px-4 py-2  hover:text-white hover:bg-gray-900 transition rounded-none cursor-pointer"
                            >
                                <h6 className="flex items-center gap-2 text-base font-semibold">
                                    Join Us on Whatsapp
                                </h6>
                            </Link>
                        </div>
                    </div> */}
                    <ShopbyBrand />
                    <ProductCategory />
                    <ShoeCarousel productss={product} primaryCat="watches" />
                    <SingleCollection productss={product}
                        primaryCat="watches"
                    />
                    {/* <ShopbyBrand /> */}
                    {/* <ProductCategory /> */}
                    <ShoeCarousel productss={product} primaryCat="shoes" />
                    <SingleCollection productss={product} primaryCat="shoes" />

                    {/* <Testimonials /> */}
                </>}
        </>
    )
}

export default Home
