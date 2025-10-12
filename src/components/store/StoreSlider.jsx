"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import StoreCard from "./StoreCard";
import { motion } from "framer-motion";

const StoreSlider = ({ reverse = false, stores = [] }) => {
  if (!stores?.length)
    return (
      <div className="text-center text-gray-400 py-10">
        Không có cửa hàng nào để hiển thị.
      </div>
    );

  return (
    <section className="w-full py-4 md:py-6">
      {/* Desktop & Tablet */}
      <div className="hidden sm:block">
        <Swiper
          className="card-slider pb-4"
          grabCursor
          modules={[Autoplay]}
          autoplay={{
            delay: 6000,
            disableOnInteraction: false,
            reverseDirection: reverse,
          }}
          speed={900}
          loop
          breakpoints={{
            320: { slidesPerView: 1, spaceBetween: 12 },
            640: { slidesPerView: 2, spaceBetween: 16 },
            1024: { slidesPerView: 3, spaceBetween: 20 },
            1280: { slidesPerView: 4, spaceBetween: 24 },
          }}
        >
          {stores.map((store) => (
            <SwiperSlide key={store._id}>
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="transition-all duration-300"
              >
                <StoreCard store={store} />
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Mobile Layout */}
      <div className="block sm:hidden px-4">
        <div className="flex flex-col gap-5">
          {stores.slice(0, 5).map((store) => (
            <motion.div
              key={store._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <StoreCard store={store} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StoreSlider;
