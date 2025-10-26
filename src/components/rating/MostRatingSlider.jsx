"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import MostRatingItem from "./MostRatingItem";

const MostRatingSlider = ({ allStoreRatingDesc }) => (
  <div>
    <div className="hidden sm:block">
      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        slidesPerView={2}
        spaceBetween={24}
        grabCursor
      >
        {allStoreRatingDesc.map((r, i) => (
          <SwiperSlide key={i} className=" py-4">
            <MostRatingItem rating={r} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>

    <div className="flex sm:hidden overflow-x-auto gap-4 pb-4 snap-x">
      {allStoreRatingDesc.map((r, i) => (
        <div key={i} className="snap-center min-w-[80%]">
          <MostRatingItem rating={r} />
        </div>
      ))}
    </div>
  </div>
);

export default MostRatingSlider;
