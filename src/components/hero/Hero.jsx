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
    <div className='h-[calc(100vh-225px)] hidden md:block'>
      <div className='relative overflow-hidden h-full'>
        <Swiper
          slidesPerView={1}
          spaceBetween={0}
          autoplay={{
            delay: 500000,
            disableOnInteraction: false,
          }}
          loop={true}
          pagination={{
            clickable: true,
          }}
          navigation={true}
          modules={[Autoplay, Pagination, Navigation]}
          className='hero'
        >
          {allStore?.slice(0, 8).map((store) => (
            <SwiperSlide key={store._id}>
              <DetailHero store={store} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Hero;
