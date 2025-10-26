"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import StoreBigCard from "./StoreBigCard.jsx";

const StoreBigSlider = ({ allStore = [] }) => {
  if (!allStore?.length) return null;

  return (
    <section className="w-full">
      {/* Desktop / Tablet */}
      <div className="hidden sm:block">
        <Swiper
          className="store-big-slider px-2 sm:px-4 py-2"
          grabCursor={true}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          modules={[Navigation, Autoplay]}
          autoplay={{
            delay: 8000,
            disableOnInteraction: false,
          }}
          speed={800}
          breakpoints={{
            320: { slidesPerView: 1.2, spaceBetween: 12 },
            640: { slidesPerView: 2, spaceBetween: 18 },
            1024: { slidesPerView: 3, spaceBetween: 22 },
            1280: { slidesPerView: 3.5, spaceBetween: 24 },
          }}
        >
          {allStore.map((store) => (
            <SwiperSlide key={store._id} className=" py-4">
              <StoreBigCard store={store} />
            </SwiperSlide>
          ))}

          {/* Navigation arrows */}
          <div className="swiper-button-prev !text-[#fc2111] !w-8 !h-8 !bg-white !shadow-sm !rounded-full after:!text-[16px] hover:!bg-[#fc2111] hover:after:!text-white transition-all"></div>
          <div className="swiper-button-next !text-[#fc2111] !w-8 !h-8 !bg-white !shadow-sm !rounded-full after:!text-[16px] hover:!bg-[#fc2111] hover:after:!text-white transition-all"></div>
        </Swiper>
      </div>

      {/* Mobile */}
      <div className="block sm:hidden">
        <div className="flex flex-col gap-4 px-2">
          {allStore.slice(0, 3).map((store) => (
            <StoreBigCard key={store._id} store={store} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StoreBigSlider;
