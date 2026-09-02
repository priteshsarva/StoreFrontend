import React from 'react'
import './Herosection.css'
import Banner1 from '../assets/Gemini_Generated_Image_ll2tr7ll2tr7ll2t.png'
import Banner2 from '../assets/Gemini_Generated_Image_ll2tr7ll2tr7ll2t copy.png'
import BannerVideo from '../assets/herobanner.mp4'

import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const Herosection = () => {
  return (
    <>
      <div className='w-full flex justify-center items-center'>
        <Swiper
          spaceBetween={50}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          className=' w-full custom-height'
          // style={{height:'calc(100vh - 162px)'}}
        >
          <SwiperSlide className='relative w-full h-full'> 
            <video
              autoPlay
              loop
              muted
              playsInline
              className='absolute inset-0 w-full h-full object-cover'
            >
              <source src={BannerVideo} type='video/mp4' />
              Your browser does not support the video tag.
            </video>
            <div className='absolute inset-0 bg-black/30'></div>
            {/* {' '} */}
         {/* Optional overlay */}
          </SwiperSlide>

          {/* <SwiperSlide className='relative w-full h-full'>
            <div
              className='absolute inset-0 bg-cover bg-center  hidden md:block'
              style={{ backgroundImage: `url(${Banner1})` }}
            ></div>
              <div
              className='absolute inset-0 bg-cover bg-center  md:hidden'
              style={{ backgroundImage: `url(${Banner2})` }}
            ></div> */}
            {/* <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center">
                            <h1 className="text-4xl font-bold">Slide 1</h1>
                            <p className="mt-4">This is the first slide description.</p>
                        </div> */}
          {/* </SwiperSlide> */}
          {/* <SwiperSlide className='relative w-full h-full'> */}
          
            {/* <div className='absolute inset-0 '></div> */}
            {/* <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center">
                            <h1 className="text-4xl font-bold">Slide 1</h1>
                            <p className="mt-4">This is the first slide description.</p>
                        </div> */}
          {/* </SwiperSlide> */}

          {/* Slide 2: Video */}

          {/* <SwiperSlide className="relative w-full h-full">
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: 'url(https://via.placeholder.com/1200x1920)' }}
                        ></div>
                        <div className="absolute inset-0 bg-black opacity-50"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center">
                            <h1 className="text-4xl font-bold">Slide 2</h1>
                            <p className="mt-4">This is the second slide description.</p>
                        </div>
                    </SwiperSlide> */}
        </Swiper>
      </div>
    </>
  )
}

export default Herosection
