import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarEmpty } from '@fortawesome/free-regular-svg-icons';

const testimonial = [
    {
        name: "Arjun Malhotra",
        img: "https://staywavy.in/wp-content/uploads/2025/07/pexels-ravi-k-301762-938639-scaled.jpg",
        text: "Absolutely love the product quality. Very premium experience!",
        rating: 4.5,
    },
    {
        name: "Neha Sinha",
        img: "https://staywavy.in/wp-content/uploads/2025/07/young-arab-woman-relaxed-thinking-about-something-looking-copy-space_1187-49050.jpg",
        text: "Fast delivery and packaging was so neat. 10/10 service!",
        rating: 5,
    },
    {
        name: "Vikram Desai",
        img: "https://staywavy.in/wp-content/uploads/2025/07/photo-1571367034861-e6729ad9c2d5-scaled.jpeg",
        text: "Customer support was helpful and polite. Great job!",
        rating: 4,
    },
    {
        name: "Rakesh Kumar",
        img: "https://staywavy.in/wp-content/uploads/2025/07/premium_photo-1661775601929-8c775187bea6-scaled.jpeg",
        text: "Highly recommend for gifting – beautiful presentation!",
        rating: 5,
    },
    {
        name: "Ravi Kapoor",
        img: "https://staywavy.in/wp-content/uploads/2025/07/premium_photo-1682092603230-1ce7cf8ca451-scaled.jpeg",
        text: "Unboxing experience was smooth and exciting!",
        rating: 3.5,
    },
    {
        name: "Ayesha Khan",
        img: "https://staywavy.in/wp-content/uploads/2025/07/indian-woman-posing-cute-stylish-outfit-camera-smiling_482257-122351.avif",
        text: "I got exactly what I saw in photos. Great platform!",
        rating: 4,
    },
];


export default function Testimonials() {
    const [showMore, setShowMore] = useState(false);

    const toggleTestimonials = () => {
        setShowMore(!showMore);
    };


    const visibleTestimonials = showMore ? testimonial : testimonial.slice(0, 3);


    return (
        <section className="py-12 bg-white">
            <div className=' container mx-auto px-4 py-10 bg-white'>
                <h4 className=" section-title section-title-center mb-5">
                    <b></b>
                    <span className="text-xl  text-black tracking-wide uppercase">
                        What Our Happy Customers Say
                    </span>
                    <b></b>
                </h4>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 md:px-8 max-w-7xl mx-auto">
                {visibleTestimonials.map((testimonial, index) => (
                    <TestimonialCard key={index} {...testimonial} />
                ))}
            </div>



            <div className="flex justify-center mt-8">
                <button
                    onClick={() => setShowMore(!showMore)}
                    className="px-6 py-2 bg-black text-white font-medium rounded hover:bg-gray-800 transition"
                >
                    {showMore ? 'Show Less' : 'Show More'}
                </button>
            </div>
        </section>
    );
}

function TestimonialCard({ img, name, text, rating }) {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

    return (
        <div className="bg-gray-50 p-6 rounded-lg shadow text-center flex flex-col items-cente feature-card">
            <img
                src={img}
                alt={name}
                className="w-24 h-24 rounded-full object-cover mb-4 mx-auto"
                loading="lazy"
            />
            <div className="font-semibold text-lg">{name}</div>
            <p className="text-gray-600 mt-2 mb-3">{text}</p>
            <div className="flex items-center justify-center gap-1 text-yellow-500">
                {[...Array(fullStars)].map((_, i) => (
                    <FontAwesomeIcon key={`full-${i}`} icon={faStar} />
                ))}
                {hasHalf && <FontAwesomeIcon icon={faStarHalfAlt} />}
                {[...Array(emptyStars)].map((_, i) => (
                    <FontAwesomeIcon key={`empty-${i}`} icon={faStarEmpty} />
                ))}
                <span className="ml-2 text-sm text-gray-700">{rating} / 5</span>
            </div>
        </div>
    );
}
