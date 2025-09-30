import Image from "next/image";
import React from "react";

const ToppingItemRadio = ({ topping, toppingGroup, selectedTopping, handleChooseTopping }) => {
  const isSelected = selectedTopping?.some((tp) => tp._id === topping._id);

  return (
    <div
      className={`flex mb-[2px] items-center justify-between p-4 rounded-lg border transition cursor-pointer 
        ${isSelected ? "bg-orange-50 border-[#fc6011]" : "bg-white border-gray-200 hover:shadow-md"}`}
      onClick={() => handleChooseTopping(topping, topping.price, toppingGroup)}
      name='checkedBtn'
    >
      <div className='flex items-center gap-4'>
        <Image
          src={isSelected ? "/assets/button_active.png" : "/assets/button.png"}
          alt={isSelected ? "active" : "inactive"}
          width={22}
          height={22}
        />
        <h3 className='text-[#333] text-[16px] md:text-[18px] font-medium' name='toppingName'>
          {topping.name}
        </h3>
      </div>

      {topping.price !== 0 && (
        <span className='text-[#4A4B4D] text-[16px] md:text-[18px] font-semibold' name='toppingPrice'>
          +{Number(topping.price).toLocaleString("vi-VN")}đ
        </span>
      )}
    </div>
  );
};

export default ToppingItemRadio;
