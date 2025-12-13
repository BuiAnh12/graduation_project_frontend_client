"use client";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { systemCategoryService } from "@/api/systemCategoryService";

const CategoryFilter = ({ currentCategory }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize from prop, fallback to empty array
  // We use this local state for optimistic UI updates (instant checkbox toggle)
  const [selectedCategories, setSelectedCategories] = useState(
    currentCategory ? currentCategory.split(",") : []
  );
  
  const [allCategories, setAllCategories] = useState([]);

  // Sync local state if URL changes externally (e.g. back button)
  useEffect(() => {
    setSelectedCategories(currentCategory ? currentCategory.split(",") : []);
  }, [currentCategory]);

  const handleCategoryClick = (typeId) => {
    let updatedCategories = [...selectedCategories];
    
    // Toggle logic
    if (updatedCategories.includes(typeId)) {
      updatedCategories = updatedCategories.filter((id) => id !== typeId);
    } else {
      updatedCategories.push(typeId);
    }

    // Update local UI immediately
    setSelectedCategories(updatedCategories);

    // Update URL
    const params = new URLSearchParams(searchParams.toString());
    
    if (updatedCategories.length > 0) {
      params.set("category", updatedCategories.join(","));
    } else {
      params.delete("category");
    }
    
    // Reset page to 1 when filter changes usually a good UX practice
    params.set("page", "1"); 

    router.push(`/search?${params.toString()}`);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await systemCategoryService.getAllSystemCategory();
        setAllCategories(result.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className='rounded-lg overflow-hidden bg-white shadow-md'>
      <div className='bg-gradient-to-r from-[#fc2111] to-[#ff8743] text-white px-5 py-3 text-lg font-semibold text-center'>
        Danh mục
      </div>

      <div className='max-h-[400px] overflow-auto small-scrollbar'>
        {allCategories.map((category) => (
          <div
            key={category?._id}
            onClick={() => handleCategoryClick(category?._id)}
            className={`flex items-center justify-between p-4 cursor-pointer transition-all hover:bg-[#fff7f2] ${
              selectedCategories.includes(category?._id) ? "bg-[#fff1e7]" : ""
            }`}
            style={{ borderBottom: "1px solid #eaeaea" }}
          >
            <h3 className='text-[#4A4B4D] text-[18px] font-medium line-clamp-1 w-[98%]'>
              {category.name}
            </h3>
            <div className=''>
              <Image
                src={`/assets/${
                  selectedCategories.includes(category?._id)
                    ? "check_box_checked"
                    : "check_box_empty"
                }.png`}
                alt=''
                width={24}
                height={24}
                objectFit='contain'
                className='!w-[24px] !h-[24px]'
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;