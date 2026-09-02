import React, { useEffect } from 'react'
import ContactUsImg from '../assets/ContactUsImg.jpg'
import { Truck, Recycle, Tag , ShieldCheck} from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faHeadset, faLock } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { FaInstagram, FaFacebookSquare, FaWhatsapp } from 'react-icons/fa';
import './Footer.css'
import { Link, useLocation } from 'react-router-dom';
import { brand, BrandEmail, Brandphone, brandlogo, directWhatsapp, facebookHandel, instagramHandel } from '../data/data';
import HappyCustomer from './HappyCustomer';
import ReadyToDispatch from './ReadyToDispatch';


const Footers = () => {

  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.slice(1));
      if (el) {
        // optional: smooth scrolling
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  return (
    <>
      {/* ========== FOOTER ========== */}
      <HappyCustomer />
      <ReadyToDispatch />
      {/* <div className="features-section">
        <div className="feature-card ">
          <FontAwesomeIcon icon={faThumbsUp} size='2x' className='mb-2 feature-icon' />
          <div className="feature-title">Quality Products</div>
          <p className="feature-text">Best in Market, Trusted by 10,000+ Customers</p>
        </div>
        <div className="feature-card">
          <FontAwesomeIcon icon={faHeadset} size='2x' className='mb-2 feature-icon' />
          <div className="feature-title">Customer Support</div>
          <p className="feature-text">We’re here Mon–Fri to help with all your queries.</p>
        </div>
        <div className="feature-card">
          <FontAwesomeIcon icon={faLock} size='2x' className='mb-2 feature-icon' />

          <div className="feature-title">Secure Payment</div>
          <p className="feature-text">Your payment info is encrypted &amp; safe with us.</p>
        </div>
        <div className="feature-card">
          <FontAwesomeIcon icon={faWhatsapp} size='2x' className='mb-2 feature-icon' />
          <div className="feature-title">WhatsApp Help</div>
          <p className="feature-text">Need help fast? Message us on WhatsApp.</p>
        </div>
      </div> */}

      <section className="py-15 mb-10 bg-neutral-100">
        <div className="container mx-auto px-4 text-center text-2xl">
         

          {/* Icons Section */}
          <div className="grid grid-cols-3 md:grid-cols-3 gap-8">
            {/* Free Delivery */}
            <div className="flex flex-col items-center">
              <Truck className="w-15 h-15 mb-3 text-black" />
              <p className=" font-medium">Free Delivery</p>
            </div>

            {/* 48 Hours Returnable */}
            <div className="flex flex-col items-center">
              <Recycle className="w-15 h-15 mb-3 text-black" />
              <p className=" font-medium">7 days replace/ exchange</p>
            </div>

            {/* Cash on Delivery */}
            <div className="flex flex-col items-center">
              <ShieldCheck className="w-15 h-15 mb-3 text-black" />
              <p className=" font-medium">Secure Checkout</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="mt-auto w-full max-w-[85rem] py-10 px-4 sm:px-6 lg:px-8 mx-auto">

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6 mb-10">

          <div id='contactus'>
            <Link className="flex-none font-semibold text-xl text-black focus:outline-hidden focus:opacity-80 " to="/" aria-label="Brand"><img src={brandlogo} alt={brand} srcset="" className='h-20' /></Link>
            <p><Link className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 focus:outline-hidden focus:text-gray-800 cursor-pointer mt-3" to={`mailto:${BrandEmail}`}>{BrandEmail}</Link></p>
            <p><Link className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 focus:outline-hidden focus:text-gray-800 mt-3" to={`tel:${Brandphone.replace(/\s+/g, '')}`}>{Brandphone}</Link></p>
            <p className="mt-3 text-xs sm:text-sm text-gray-600">
              {`© 2025 ${brand}.`}
            </p>
          </div>
          {/* End Col */}


          <div>
            <h4 className="text-xl font-semibold text-gray-900 ">Customer Service</h4>
            <div className="mt-3 grid space-y-3 text-sm">
              <p><Link className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 focus:outline-hidden focus:text-gray-800 cursor-pointer" to="/ShippingPolicy">Shipping Policy</Link></p>
              <p><Link className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 focus:outline-hidden focus:text-gray-800" to="/ReturnPolicy">Return & Refund Policy</Link></p>
              <p><Link className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 focus:outline-hidden focus:text-gray-800" to="/faq">FAQ</Link></p>
            </div>
          </div>
          {/* End Col */}

          <div>
            <h4 className="text-xl font-semibold text-gray-900 ">Legal</h4>

            <div className="mt-3 grid space-y-3 text-sm">
              <p><Link className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 focus:outline-hidden focus:text-gray-800 cursor-pointer" to="/TermsOfService">Terms of Service</Link></p>
              <p><Link className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 focus:outline-hidden focus:text-gray-800 cursor-pointer" to="/PrivacyPolicy">Privacy Policy</Link></p>
              {/* <p><Link className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 focus:outline-hidden focus:text-gray-800" to="#">Careers</Link> <span className="inline text-blue-600">— We're hiring</span></p> */}

            </div>
          </div>
          {/* End Col */}

          <div>
            <h4 className="text-xl font-semibold text-gray-900 ">Follow Us</h4>

            <div className="mt-3 flex gap-3 text-sm justify-items-center">
              <Link to={instagramHandel}><FaInstagram className="text-2xl" /></Link>
              {/* <Link to={facebookHandel}><FaFacebookSquare className="text-2xl" /></Link>
              <Link to={directWhatsapp}><FaWhatsapp className="text-2xl" /></Link> */}
            </div>

          </div>
          {/* End Col */}

          {/* <div>
                <h4 className="text-xs font-semibold text-gray-900 uppercase">Developers</h4>
    
                <div className="mt-3 grid space-y-3 text-sm">
                  <p><Link className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 focus:outline-hidden focus:text-gray-800" to="#">Api</Link></p>
                  <p><Link className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 focus:outline-hidden focus:text-gray-800" to="#">Status</Link></p>
                  <p><Link className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 focus:outline-hidden focus:text-gray-800" to="#">GitHub</Link> <span className="inline text-blue-600">— New</span></p>
                </div>
    
                <h4 className="mt-7 text-xs font-semibold text-gray-900 uppercase">Industries</h4>
    
                <div className="mt-3 grid space-y-3 text-sm">
                  <p><Link className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 focus:outline-hidden focus:text-gray-800" to="#">Financial Services</Link></p>
                  <p><Link className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 focus:outline-hidden focus:text-gray-800" to="#">Education</Link></p>
                </div>
              </div> */}
          {/* End Col */}
        </div>
        {/* End Grid */}

      </footer>
      {/* ========== END FOOTER ========== */}
    </>
  )
}

export default Footers
