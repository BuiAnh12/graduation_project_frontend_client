"use client";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react"; // Removed unnecessary useEffect

// Accept currentSort as a prop to control initial visual state
const SortBy = ({ currentSort }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // We don't need local state 'sort' to trigger an effect. 
  // We can just use the prop for UI and function for logic.

  const handleSort = (selectedSortKey) => {
    // 1. If clicking the same sort, do nothing (optional optimization)
    if (selectedSortKey === currentSort) return;

    // 2. Clone current params to preserve keyword, page, etc.
    const params = new URLSearchParams(searchParams.toString());

    // 3. Update the 'sort' param
    if (selectedSortKey) {
      params.set("sort", selectedSortKey);
    } else {
      params.delete("sort");
    }

    // 4. Push new URL
    router.push(`/search?${params.toString()}`);
  };

  const sortOptions = [
    { key: "name", label: "Tên", icon: "/assets/store.png" },
    { key: "standout", label: "Nổi bật", icon: "/assets/ic_fire.png" },
    { key: "rating", label: "Đánh giá", icon: "/assets/ic_star_outline.png" },
  ];

  return (
    <div className='rounded-lg overflow-hidden bg-white shadow-md'>
      <div className='bg-gradient-to-r from-[#fc2111] to-[#ff8743] text-white px-5 py-3 text-lg font-semibold text-center'>
        Sắp xếp theo
      </div>

      <div>
        {sortOptions.map((option) => (
          <div
            key={option.key}
            // Call handleSort directly on click
            onClick={() => handleSort(option.key)}
            className={`flex items-center gap-4 p-4 cursor-pointer transition-all hover:bg-[#fff7f2] ${
              currentSort === option.key ? "bg-[#fff1e7]" : ""
            }`}
            style={{ borderBottom: "1px solid #eaeaea" }}
          >
            <div className='relative w-[28px] h-[28px]'>
              <Image src={option.icon} alt='' layout='fill' objectFit='contain' />
            </div>
            <div className='flex-1 flex items-center justify-between'>
              <h3 className='text-[#4A4B4D] text-[18px] font-medium'>{option.label}</h3>
              <div className='relative w-[26px] h-[26px]'>
                <Image
                  src={`/assets/${
                    currentSort === option.key ? "button_active" : "button"
                  }.png`}
                  alt=''
                  layout='fill'
                  objectFit='contain'
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SortBy;