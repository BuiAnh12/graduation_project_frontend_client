"use client";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
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
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <Swiper
      className='category-slider'
      grabCursor={true}
      breakpoints={{
        320: {
          slidesPerView: 3,
          spaceBetween: 10,
        },
        490: {
          slidesPerView: 4,
          spaceBetween: 10,
        },
        640: {
          slidesPerView: 6,
          spaceBetween: 20,
        },
        768: {
          slidesPerView: 6,
          spaceBetween: 20,
        },
        1024: {
          slidesPerView: 8,
          spaceBetween: 25,
        },
        1280: {
          slidesPerView: 10,
          spaceBetween: 25,
        },
      }}
    >
      {allCategories &&
        allCategories.map((type) => (
          <SwiperSlide key={type._id}>
            <CategoryItem type={type} />
          </SwiperSlide>
        ))}
    </Swiper>
  );
};

export default CategorySlider;
