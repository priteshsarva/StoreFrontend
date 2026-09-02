import { useState, useEffect } from 'react';
import './VideoModal.css';

const VideoModal = ({ videoUrl, isOpen, onClose, name }) => {

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (event.target.classList.contains('main-modal')) {
                onClose();
            }
        };

        if (isOpen) {
            window.addEventListener('click', handleOutsideClick);
        }

        return () => {
            window.removeEventListener('click', handleOutsideClick);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <>
            <div className="main-modal fixed w-full h-full inset-0 z-50 overflow-hidden flex justify-center items-center animated fadeIn faster" style={{ background: 'rgba(0,0,0,0.7)' }}>
                <div className="border border-teal-500 shadow-lg modal-container bg-white w-11/12 md:max-w-md mx-auto rounded z-50 overflow-y-auto w-80 ">
                    <div className="modal-content py-4 text-left px-6">
                        {/* Title */}
                        <div className="flex justify-between items-center pb-3">
                            <p className="text-lg font-bold">{name}</p>
                            <button className="modal-close cursor-pointer z-50" onClick={onClose}>
                                <svg className="fill-current text-black" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                                    <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z" />
                                </svg>
                            </button>
                        </div>

                        {/* Body */}
                        <div className="my-5">
                            {/* Video Player */}
                            <video controls className="w-full rounded-b-lg">
                                <source src={videoUrl} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        </div>

                        {/* Footer */}
                        {/* <div className="flex justify-end pt-2">
                            <button onClick={onClose} className="focus:outline-none modal-close px-4 bg-gray-400 p-3 rounded-lg text-black hover:bg-gray-300">Cancel</button>
                            <button className="focus:outline-none px-4 bg-teal-500 p-3 ml-3 rounded-lg text-white hover:bg-teal-400">Confirm</button>
                        </div> */}
                    </div>
                </div>
            </div>
        </>
    );
};

export default VideoModal;
