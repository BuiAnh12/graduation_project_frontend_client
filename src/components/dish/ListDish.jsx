"use client";
import React from "react";
import { groupDishesByCategory } from "@/utils/functions";
import DishCard from "./DishCard";

const ListDish = ({ storeInfo, allDish, cartItems, onAddToCartShowSimilar }) => {
  const groupedDishes = groupDishesByCategory(allDish);
  return (
    <div className="space-y-10">
      {groupedDishes.map(({ category, dishes }) => (
        <section key={category?._id}>
          {/* Category Header */}
          <div className="flex items-center gap-3 mb-5">
            <h3 className="text-[24px] md:text-[28px] font-extrabold text-[#b91c1c]">
              {category}
            </h3>
            <div className="flex-1 h-[2px] bg-gradient-to-r from-[#b91c1c]/70 to-transparent rounded-full"></div>
          </div>

          {/* Dish Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {dishes.map((dish) => (
              <DishCard
                key={dish._id}
                dish={dish}
                storeInfo={storeInfo}
                cartItems={cartItems}
                onAddToCartShowSimilar={onAddToCartShowSimilar}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default ListDish;
