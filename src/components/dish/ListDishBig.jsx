"use client";
import React from "react";
import DishBigCard from "./DishBigCard";

const ListDishBig = ({ storeInfo, allDish, cartItems }) => {
  return (
    <div className='grid gap-[20px] grid-cols-2 lg:grid-cols-3'>
      {allDish &&
        allDish
          ?.slice(0, 3)
          .map((dish) => <DishBigCard key={dish._id} dish={dish} storeInfo={storeInfo} cartItems={cartItems} />)}
    </div>
  );
};

export default ListDishBig;
