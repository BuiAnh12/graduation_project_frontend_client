"use client";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const CategoryItem = ({ type }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedCategories, setSelectedCategories] = useState([]);

  const name = searchParams.get("name") || "";
  const sort = searchParams.get("sort") || "";
  const category = searchParams.get("category") || "";
  const limit = searchParams.get("limit") || "20";
  const page = searchParams.get("page") || "1";

  useEffect(() => {
    setSelectedCategories(category !== "" ? category.split(",") : []);
  }, [category]);

  const handleCategoryClick = () => {
    let updatedCategories = [...selectedCategories];

    if (updatedCategories.includes(type._id)) {
      updatedCategories = updatedCategories.filter((id) => id !== type._id);
    } else {
      updatedCategories.push(type._id);
    }

    setSelectedCategories(updatedCategories);

    const params = new URLSearchParams();
    if (name) params.set("name", name);
    if (updatedCategories.length > 0) params.set("category", updatedCategories.join(","));
    if (sort) params.set("sort", sort);
    if (limit) params.set("limit", limit);
    if (page) params.set("page", page);

    router.push(`/search?${params.toString()}`);
  };

  const isSelected = selectedCategories.includes(type._id);

  return (
    <div
      className="category-item relative flex flex-col items-center gap-3 w-fit cursor-pointer group transition-all duration-300 hover:scale-[1.03]"
      onClick={handleCategoryClick}
      data-category-name={type.name}
    >
      {/* Image container */}
      <div
        className={`relative w-[95px] h-[95px] sm:w-[110px] sm:h-[110px] rounded-full overflow-hidden shadow-md transition-all duration-300 ${
          isSelected
            ? "ring-4 ring-red-500 ring-offset-2 shadow-red-200"
            : "ring-2 ring-gray-200 hover:ring-red-300"
        }`}
      >
        <Image
          src={type?.image?.url || "/placeholder.png"}
          alt={type?.name}
          fill
          className="object-cover rounded-full group-hover:scale-110 transition-transform duration-300"
        />

        {/* Checkmark overlay */}
        {isSelected && (
          <div className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-[3px] shadow-md">
            <Image
              src="/assets/check_box_circle_active.png"
              alt="selected"
              width={26}
              height={26}
            />
          </div>
        )}
      </div>

      {/* Category name */}
      <span
        className={`text-[15px] sm:text-[16px] text-center font-semibold line-clamp-2 transition-colors duration-200 ${
          isSelected ? "text-red-600" : "text-gray-700 group-hover:text-red-500"
        }`}
      >
        {type.name}
      </span>
    </div>
  );
};

export default CategoryItem;
