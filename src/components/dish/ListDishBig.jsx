"use client";
import React from "react";
import DishBigCard from "./DishBigCard";

const ListDishBig = ({ storeInfo, allDish, cartItems }) => {
  return (
    <section className="my-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <h3 className="text-[26px] md:text-[30px] font-extrabold text-[#b91c1c]">
          Món nổi bật
        </h3>
        <div className="flex-1 h-[2px] bg-gradient-to-r from-[#b91c1c]/70 to-transparent rounded-full"></div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {allDish?.slice(0, 3).map((dish) => (
          <DishBigCard
            key={dish._id}
            dish={dish}
            storeInfo={storeInfo}
            cartItems={cartItems}
          />
        ))}
      </div>
    </section>
  );
};

export default ListDishBig;
