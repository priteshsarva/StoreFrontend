import React from 'react'
import Slider from 'react-slick';
import { happyCustomerData } from '../data/data';

const HappyCustomer = () => {
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        swipeToSlide: true,
        // 👇 Add autoplay
        autoplay: true,
        autoplaySpeed: 1000, // change speed (ms) to your needs
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
    return (
        <>
            <div className=" mx-auto pt-10 px-4">
                <div className=' container mx-auto px-4 py-10 bg-white'>
                    <h4 className=" section-title section-title-center mb-5">
                        <b></b>
                        <span className="text-xl  text-black tracking-wide uppercase">
                             Happy Customers
                        </span>
                        <b></b>
                    </h4>
                </div>

                <Slider {...settings}>

                    {happyCustomerData.map((img, index) => (
                        <img
                            key={index}
                            src={img}
                            alt={`Happy customer ${index + 1}`}
                            style={{ width: "150px", height: "150px", objectFit: "cover" }}
                            className='px-1'
                        />
                    ))}
                </Slider>
            </div>

        </>
    )
}

export default HappyCustomer
