"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import DetailHero from "./DetailHero";

const Hero = ({ allStore }) => {
    // 1. Handle data structure safely (check if it's the object {data: []} or just an array)
    const stores = allStore?.data || (Array.isArray(allStore) ? allStore : []);

    // If no stores, don't render the huge empty block
    if (!stores || stores.length === 0) return null;

    return (
        // Height matched to DetailHero (md:h-[450px]) to prevent gaps
        <div className="hidden md:block relative w-full h-[450px] mb-8">
            <div className="relative h-full w-full shadow-2xl overflow-hidden group/hero">
                <Swiper
                    slidesPerView={1}
                    spaceBetween={0}
                    centeredSlides={true}
                    autoplay={{
                        delay: 5000,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                    }}
                    loop={stores.length > 1} // Only loop if more than 1 store
                    pagination={{
                        clickable: true,
                        bulletClass: "swiper-pagination-bullet custom-bullet",
                        bulletActiveClass:
                            "swiper-pagination-bullet-active custom-bullet-active",
                    }}
                    navigation={true}
                    modules={[Autoplay, Pagination, Navigation]}
                    className="hero-swiper h-full w-full"
                >
                    {stores.slice(0, 8).map((store) => (
                        <SwiperSlide key={store._id}>
                            <DetailHero store={store} />
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* --- Custom Navigation Buttons Styling --- */}
                <style jsx global>{`
                    .hero-swiper .swiper-button-prev,
                    .hero-swiper .swiper-button-next {
                        color: white;
                        background: rgba(0, 0, 0, 0.3);
                        width: 40px;
                        height: 40px;
                        border-radius: 50%;
                        backdrop-filter: blur(4px);
                        opacity: 0; /* Hidden by default */
                        transition: all 0.3s ease;
                    }

                    .hero-swiper .swiper-button-prev::after,
                    .hero-swiper .swiper-button-next::after {
                        font-size: 18px;
                        font-weight: bold;
                    }

                    /* Show navigation on hover */
                    .group\/hero:hover .swiper-button-prev,
                    .group\/hero:hover .swiper-button-next {
                        opacity: 1;
                    }

                    .hero-swiper .swiper-button-prev:hover,
                    .hero-swiper .swiper-button-next:hover {
                        background: #fc2111;
                        transform: scale(1.1);
                    }

                    /* Pagination Dots */
                    .hero-swiper .swiper-pagination {
                        bottom: 20px !important; /* Move up slightly */
                    }

                    .custom-bullet {
                        background-color: rgba(255, 255, 255, 0.4);
                        width: 8px;
                        height: 8px;
                        margin: 0 6px !important;
                        border-radius: 50%;
                        transition: all 0.3s ease;
                        cursor: pointer;
                        display: inline-block;
                    }

                    .custom-bullet-active {
                        background-color: #fc2111;
                        width: 24px; /* Elongate active dot */
                        border-radius: 4px;
                    }
                `}</style>
            </div>
        </div>
    );
};

export default Hero;
