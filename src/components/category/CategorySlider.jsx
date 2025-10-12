"use client";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import CategoryItem from "./CategoryItem";
import { systemCategoryService } from "@/api/systemCategoryService";

const CategorySlider = () => {
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await systemCategoryService.getAllSystemCategory();
        setAllCategories(result.data);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full py-10">
        <div className="animate-pulse text-gray-400 text-sm">Đang tải danh mục...</div>
      </div>
    );
  }

  return (
    <div className="relative w-full py-3 sm:py-5">
      <Swiper
        className="category-slider"
        grabCursor={true}
        navigation
        modules={[Navigation]}
        breakpoints={{
          320: { slidesPerView: 3, spaceBetween: 10 },
          490: { slidesPerView: 4, spaceBetween: 12 },
          640: { slidesPerView: 6, spaceBetween: 16 },
          768: { slidesPerView: 7, spaceBetween: 18 },
          1024: { slidesPerView: 8, spaceBetween: 20 },
          1280: { slidesPerView: 10, spaceBetween: 24 },
        }}
      >
        {allCategories.map((type) => (
          <SwiperSlide key={type._id}>
            <div className="flex justify-center">
              <CategoryItem type={type} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Subtle bottom divider */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
    </div>
  );
};

export default CategorySlider;
