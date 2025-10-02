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
      // Nếu đã chọn, thì bỏ chọn
      updatedCategories = updatedCategories.filter((id) => id !== type._id);
    } else {
      // Nếu chưa chọn, thì thêm vào danh sách
      updatedCategories.push(type._id);
    }

    setSelectedCategories(updatedCategories);

    // Cập nhật URL
    const params = new URLSearchParams();
    if (name) params.set("name", name);
    if (updatedCategories.length > 0) params.set("category", updatedCategories.join(","));
    if (sort) params.set("sort", sort);
    if (limit) params.set("limit", limit);
    if (page) params.set("page", page);

    router.push(`/search?${params.toString()}`);
  };

  return (
    <div
      className='category-item relative flex flex-col items-center gap-[4px] w-fit cursor-pointer'
      onClick={handleCategoryClick}
      data-category-name={category.name}
    >
      <div className='relative w-[100px] h-[100px] pt-[100px]'>
        <Image
          src={type.image.url}
          layout='fill'
          alt=''
          className={`rounded-full w-[100px] h-[100px] justify-center border-[4px] border-solid object-cover ${
            selectedCategories.includes(type._id) ? "border-[#fc6011]" : "border-[#e8e9e9]"
          }`}
        />
      </div>
      <span
        className={`text-[16px] text-center font-semibold line-clamp-2 ${
          selectedCategories.includes(type._id) ? "text-[#fc6011]" : "text-[#4A4B4D]"
        }`}
      >
        {type.name}
      </span>
      {selectedCategories.includes(type._id) && (
        <Image
          src='/assets/check_box_circle_active.png'
          alt=''
          width={30}
          height={30}
          className='absolute top-[0px] right-[0px]'
        />
      )}
    </div>
  );
};

export default CategoryItem;
