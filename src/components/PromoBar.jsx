import { useState } from 'react';
import { Link } from 'react-router-dom';
import { joinUsOnWhatsapp } from '../data/data';

function PromoBar() {
    const [isVisible, setIsVisible] = useState(true);

    const handleClose = () => {
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="flex items-center bg-gradient-to-r from-[#25D366] via-[#128C7E] to-[#075E54] text-white p-2.5 text-sm w-full box-border z-50 whitespace-nowrap overflow-hidden font-sans">
            <span className="flex items-center overflow-hidden text-ellipsis flex-grow min-w-0">
                {/* WhatsApp Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="#fff" viewBox="0 0 24 24" width="18" height="18" className="mr-2 flex-shrink-0">
                    <path d="M20.52 3.48a11.87 11.87 0 0 0-16.76 0A11.87 11.87 0 0 0 2 12.07c0 2.12.55 4.14 1.6 5.94L2 22l4.12-1.57a11.82 11.82 0 0 0 5.93 1.52h.05c6.55 0 11.87-5.32 11.87-11.87 0-3.17-1.23-6.14-3.45-8.35zM12.1 20.1h-.04a9.97 9.97 0 0 1-5.07-1.37l-.36-.21-2.44.93.87-2.38-.23-.37A9.94 9.94 0 0 1 4.1 12c0-5.47 4.45-9.92 9.92-9.92 2.65 0 5.14 1.04 7.01 2.92a9.89 9.89 0 0 1 2.91 7c0 5.47-4.45 9.92-9.92 9.92zm5.4-7.57c-.29-.15-1.72-.85-1.99-.95-.27-.1-.47-.15-.66.15s-.76.95-.93 1.14-.34.22-.63.07a8.1 8.1 0 0 1-2.39-1.47 9 9 0 0 1-1.66-2.06c-.17-.3 0-.47.13-.61.14-.14.3-.37.45-.56.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.52s-.66-1.6-.91-2.2c-.24-.58-.5-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.46s1.07 2.86 1.22 3.06c.15.2 2.1 3.2 5.08 4.48.71.31 1.26.5 1.69.64.71.23 1.36.2 1.87.12.57-.08 1.72-.7 1.96-1.38.24-.67.24-1.26.17-1.38-.07-.12-.26-.19-.55-.34z"></path>
                </svg>
                <Link to={joinUsOnWhatsapp} target="_blank" className="text-white no-underline font-medium overflow-hidden text-ellipsis whitespace-nowrap flex-1">
                    Join our WhatsApp Community for exclusive drops!
                </Link>
            </span>

            <span onClick={handleClose} className="ml-2 bg-white text-black flex justify-center rounded-full text-xs font-bold w-5 h-5 cursor-pointer flex-shrink-0 font-black">
                ×
            </span>
        </div>
    );
}

export default PromoBar;

