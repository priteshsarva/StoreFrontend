// Horizontal scrolling product carousel — same UX as the legacy ShoeCarousel,
// rebuilt on the tenant-generic ProductCard. Reused for home category rails
// and "you may also like" on the product page.
import React from "react";
import Slider from "react-slick";
import ProductCard from "./ProductCard";
import "./ProductRail.css";

const settings = {
  dots: false,
  infinite: false,
  speed: 400,
  slidesToShow: 4,
  slidesToScroll: 2,
  arrows: true,
  swipeToSlide: true,
  responsive: [
    { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 2 } },
    { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 2, arrows: false } },
  ],
};

export default function ProductRail({ products }) {
  if (!products || products.length === 0) return null;
  // slick needs more slides than slidesToShow to look right; fall back to a
  // plain grid for a short list instead of an oddly-empty carousel.
  if (products.length <= 3) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
        {products.map((p) => <ProductCard key={`${p.dbName}-${p.productId}`} product={p} />)}
      </div>
    );
  }
  return (
    <Slider {...settings}>
      {products.map((p) => (
        <div key={`${p.dbName}-${p.productId}`} className="px-2">
          <ProductCard product={p} />
        </div>
      ))}
    </Slider>
  );
}
