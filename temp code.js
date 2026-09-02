{/* Features */ }
<div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
    {/* Title */}
    <div className="mx-auto max-w-2xl mb-8 lg:mb-14 text-center">
        <h2 className="text-3xl lg:text-4xl text-gray-800 font-bold">
            Seamless Shopping, Guaranteed
        </h2>
        <p className="mt-3 text-gray-800">
            We make every order effortless — from doorstep delivery to post-purchase support.
        </p>
    </div>
    {/* End Title */}


    {/* Grid */}
    <div className="mx-auto max-w-3xl grid grid-cols-3 gap-6 lg:gap-8">
        {/* Icon Block */}
        <div className="flex flex-col items-center text-center">
            <Truck className="mb-3 w-12 h-12" />
            <div className="mt-2 sm:mt-6">
                <h3 className="sm:text-lg font-semibold text-gray-800">
                    Free Shipping
                </h3>
            </div>
        </div>
        {/* End Icon Block */}

        {/* Icon Block */}
        <div className="flex flex-col items-center text-center">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mb-3 w-12 h-12"
                viewBox="0 0 24 24"
            >
                <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
                <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                <path d="M16 16h5v5" />
            </svg>
            <div className="mt-2 sm:mt-6">
                <h3 className="sm:text-lg font-semibold text-gray-800">
                    7 days replace/ exchange
                </h3>
            </div>
        </div>
        {/* End Icon Block */}

        {/* Icon Block */}
        <div className="flex flex-col items-center text-center">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mb-3 w-12 h-12"
                viewBox="0 0 24 24"
            >
                <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
                <path d="m9 12 2 2 4-4" />
            </svg>
            <div className="mt-2 sm:mt-6">
                <h3 className="sm:text-lg font-semibold text-gray-800">
                    Secure Checkout
                </h3>
            </div>
        </div>
        {/* End Icon Block */}
    </div>
    {/* End Grid */}


    {/* Grid */}

    {/* End Grid */}
</div>
{/* End Features */ }


{/* =============Contact Form============== */ }
{/* Contact */ }
<div className="max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-24 mx-auto">
    <div className="mb-6 sm:mb-10 max-w-2xl text-center mx-auto">
        <h2 className="font-medium text-black text-2xl sm:text-4xl">
            Contacts
        </h2>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:items-center gap-6 md:gap-8 lg:gap-12">
        <div className="aspect-w-16 aspect-h-6 lg:aspect-h-14 overflow-hidden  rounded-2xl">
            <img className="group-hover:scale-105 group-focus:scale-105 transition-transform duration-500 ease-in-out object-cover rounded-2xl" src={ContactUsImg} alt="Contacts Image" />
        </div>
        {/* End Col */}

        <div className="space-y-8 lg:space-y-16">
            <div>
                <h3 className="mb-5 font-semibold text-black">
                    Our address
                </h3>

                {/* Grid */}
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-12">
                    <div className="flex gap-4">
                        <svg className="shrink-0 size-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>

                        <div className="grow">
                            <p className="text-sm text-gray-600">
                                United Kingdom
                            </p>
                            <address className="mt-1 text-black not-italic">
                                300 Bath Street, Tay House<br />
                                Glasgow G2 4JR
                            </address>
                        </div>
                    </div>
                </div>
                {/* End Grid */}
            </div>

            <div>
                <h3 className="mb-5 font-semibold text-black">
                    Our contacts
                </h3>

                {/* Grid */}
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-12">
                    <div className="flex gap-4">
                        <svg className="shrink-0 size-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 .8-1.6l8-6a2 2 0 0 1 2.4 0l8 6Z"></path><path d="m22 10-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 10"></path></svg>

                        <div className="grow">
                            <p className="text-sm text-gray-600">
                                Email us
                            </p>
                            <p>
                                <a className="relative inline-block font-medium text-black before:absolute before:bottom-0.5 before:start-0 before:-z-1 before:w-full before:h-1 before:bg-yellow-400 hover:before:bg-black focus:outline-hidden focus:before:bg-black" href="mailto:example@site.so">
                                    hello@example.so
                                </a>
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <svg className="shrink-0 size-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>

                        <div className="grow">
                            <p className="text-sm text-gray-600">
                                Call us
                            </p>
                            <p>
                                <a className="relative inline-block font-medium text-black before:absolute before:bottom-0.5 before:start-0 before:-z-1 before:w-full before:h-1 before:bg-yellow-400 hover:before:bg-black focus:outline-hidden focus:before:bg-black" href="mailto:example@site.so">
                                    +44 222 777-000
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
                {/* End Grid */}
            </div>
        </div>
        {/* End Col */}
    </div>
</div>



{/* End Contact */ }
{/* =============End Contact Form============== */ }