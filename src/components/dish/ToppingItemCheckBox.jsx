import Image from "next/image";
import React from "react";

const ToppingItemCheckBox = ({ topping, toppingGroup, selectedTopping, handleChooseTopping }) => {
  const isChecked = selectedTopping?.some((tp) => tp._id === topping._id);

  return (
    <div
      onClick={() => handleChooseTopping(topping, topping.price, toppingGroup)}
      name="checkedBtn"
      className={`flex items-center justify-between p-4 mb-2 rounded-xl border-2 transition-all cursor-pointer 
        ${
          isChecked
            ? "bg-red-50 border-red-600 shadow-sm shadow-red-100"
            : "bg-white border-gray-200 hover:border-red-300 hover:shadow-md"
        }`}
    >
      {/* Left: Icon + Label */}
      <div className="flex items-center gap-4">
        <Image
          src={isChecked ? "/assets/check_box_checked.png" : "/assets/check_box_empty.png"}
          alt={isChecked ? "checked" : "unchecked"}
          width={22}
          height={22}
          className="transition-transform duration-300 ease-in-out"
        />
        <h3
          name="toppingName"
          className={`text-[16px] md:text-[18px] font-medium ${
            isChecked ? "text-red-700" : "text-gray-800"
          }`}
        >
          {topping.name}
        </h3>
      </div>

      {/* Right: Price */}
      {topping.price !== 0 && (
        <span
          name="toppingPrice"
          className={`text-[16px] md:text-[18px] font-semibold ${
            isChecked ? "text-red-600" : "text-gray-600"
          }`}
        >
          +{Number(topping.price).toLocaleString("vi-VN")}đ
        </span>
      )}
    </div>
  );
};

export default ToppingItemCheckBox;
