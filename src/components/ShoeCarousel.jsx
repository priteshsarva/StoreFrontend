import Slider from 'react-slick';

// import { useCart } from '../contexts/CartContext';
import './ShoeCarousel.css'
import { Link } from 'react-router-dom';
import Card from './Card';


export default function ShoeCarousel({ productss, primaryCat }) {

  // const { addToCart } = useCart();

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
    autoplaySpeed: 2000, // change speed (ms) to your needs
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
    <div className="max-w-7xl mx-auto pt-10 px-4">
      <div className=' container mx-auto px-4 bg-white'>
        <h4 className=" section-title section-title-center mb-5">
          <b></b>
          <span className="text-xl  text-black tracking-wide uppercase">
            Our Best {primaryCat ? primaryCat.charAt(0).toUpperCase() + primaryCat.slice(1) : ""} Collection
          </span>
          <b></b>
        </h4>
      </div>

      <Slider {...settings}>
        {products.map((product) => (
          <div key={product.productId}>
            <div className="w-50 mx-3">
              <Card
                key={product.productId}
                title={product.productName}
                price={product.productOriginalPrice}
                coverImg={product.featuredimg}
                id={product.productId}
                catName={product.catName}
                sizeName={product.sizeName || "[]"}
                primarycat={product.primarycat}
              />
            </div>
          </div>
        ))}
      </Slider>
    </div>

  );
}