"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import DetailHero from "./DetailHero";

const Hero = ({ allStore }) => {
  return (
    <div className="hidden md:block relative h-[calc(100vh-225px)]">
      <div className="relative h-full overflow-hidden rounded-b-3xl shadow-xl">
        <Swiper
          slidesPerView={1}
          spaceBetween={0}
          autoplay={{
            delay: 6000,
            disableOnInteraction: false,
          }}
          loop={true}
          pagination={{
            clickable: true,
            bulletClass: "swiper-pagination-bullet custom-bullet",
            bulletActiveClass: "swiper-pagination-bullet-active custom-bullet-active",
          }}
          navigation={true}
          modules={[Autoplay, Pagination, Navigation]}
          className="hero-swiper"
        >
          {allStore?.slice(0, 8).map((store) => (
            <SwiperSlide key={store._id} className=" py-4">
              <DetailHero store={store} />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Gradient overlay on top for fade effect */}
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/50 to-transparent pointer-events-none z-20"></div>
      </div>

      {/* Decorative glow bar (red accent) */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120px] h-[5px] bg-red-500 rounded-full blur-[2px]"></div>

      <style jsx global>{`
        /* Customize Swiper navigation & pagination */
        .hero-swiper .swiper-button-prev,
        .hero-swiper .swiper-button-next {
          color: white;
          opacity: 0.7;
          transition: opacity 0.3s;
        }
        .hero-swiper .swiper-button-prev:hover,
        .hero-swiper .swiper-button-next:hover {
          opacity: 1;
        }

        .custom-bullet {
          background-color: rgba(255, 255, 255, 0.5);
          width: 10px;
          height: 10px;
          margin: 0 6px !important;
          border-radius: 50%;
          transition: all 0.3s ease;
        }
        .custom-bullet-active {
          background-color: #ef4444; /* red-500 */
          transform: scale(1.3);
        }
      `}</style>
    </div>
  );
};

export default Hero;
