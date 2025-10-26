"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { recommendService } from "@/api/recommendService"
import "swiper/css";
import "swiper/css/navigation";
import { toast } from "react-toastify";

const DishRecommendSlider = () => {
  const [dishes, setDishes] = useState();

  const userId = JSON.parse(localStorage.getItem("userId"));
  console.log(userId)
  useEffect(() => {
    const fetchRecommend = async () => {
      try {
        const body = {
          user_id: userId,
          top_k: 5
        }
        const res = await recommendService.getRecommendDish(body);
        console.log(res)
        if (res.success && Array.isArray(res.data.recommendations)) {
          setDishes(res.data.recommendations);
        } else {
          toast.info("Không có món đề xuất phù hợp");
        }
      } catch (err) {
        console.error("Failed to fetch recommended dishes:", err);
        toast.error("Lỗi khi tải món đề xuất");
      }
    };

    if (userId) fetchRecommend();
  }, [userId]);

  if (!dishes?.length) return null;

  return (
    <section className="w-full p-2">
      {/* Desktop / Tablet */}
      <div className="hidden sm:block">
        <Swiper
          className="dish-recommend-slider px-2 sm:px-4 py-20"
          grabCursor={true}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          modules={[Navigation, Autoplay]}
          autoplay={{
            delay: 7000,
            disableOnInteraction: false,
          }}
          speed={700}
          breakpoints={{
            320: { slidesPerView: 1.2, spaceBetween: 12 },
            640: { slidesPerView: 2, spaceBetween: 18 },
            1024: { slidesPerView: 3, spaceBetween: 22 },
            1280: { slidesPerView: 3.5, spaceBetween: 24 },
          }}
        >
          {dishes.map((dish) => (
            <SwiperSlide key={dish.dish_id} className=" py-4">
              <DishCard dish={dish} />
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
          {dishes.slice(0, 3).map((dish) => (
            <DishCard key={dish.dish_id} dish={dish} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default DishRecommendSlider;

// === CARD COMPONENT ===
const DishCard = ({ dish }) => {
  const data = dish.metadata || {};
  const link = `/store/${data.storeId}/dish/${dish.dish_id}`;
  const image = data.image?.url || "/assets/default-dish.png";

  return (
    <Link
      href={link}
      className="block bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 h-[320px]" // 🔹 fixed total height
    >
      {/* Image Section */}
      <div className="relative w-full h-40 bg-gray-100">
        <img
          src={image}
          alt={data.name}
          className="w-full h-full object-cover"
          onError={(e) => (e.target.src = "/images/default-dish.png")}
        />
      </div>

      {/* Text Section */}
      <div className="p-4 flex flex-col justify-between h-[calc(320px-160px)]"> {/* 320 - 160px image height */}
        <div>
          <h4 className="font-bold text-lg text-gray-800 line-clamp-1">
            {data.name}
          </h4>
          <p className="text-sm text-gray-500 line-clamp-2 mt-1">
            {data.description}
          </p>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className="font-semibold text-[#fc2111] text-base">
            {data.price?.toLocaleString()}₫
          </span>
          <span className="text-xs text-gray-400 truncate max-w-[80px]">
            #{data.cultureTags?.[0]?.name}
          </span>
        </div>
      </div>
    </Link>
  );
};