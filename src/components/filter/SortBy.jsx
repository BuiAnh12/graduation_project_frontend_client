"use client";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const SortBy = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [sort, setSort] = useState(searchParams.get("sort") || "");

  const name = searchParams.get("name");
  const category = searchParams.get("category") || "";
  const limit = searchParams.get("limit") || "20";
  const page = searchParams.get("page") || "1";

  const handleSort = () => {
    const params = new URLSearchParams();
    if (name) params.set("name", name);
    if (category) params.set("category", category);
    if (sort) params.set("sort", sort);
    if (limit) params.set("limit", limit);
    if (page) params.set("page", page);
    router.push(`/search?${params.toString()}`);
  };

  useEffect(() => {
    handleSort();
  }, [sort]);

  const sortOptions = [
    { key: "name", label: "Tên", icon: "/assets/store.png" },
    { key: "standout", label: "Nổi bật", icon: "/assets/ic_fire.png" },
    { key: "rating", label: "Đánh giá", icon: "/assets/ic_star_outline.png" },
  ];

  return (
    <div className='rounded-lg overflow-hidden bg-white shadow-md'>
      <div className='bg-gradient-to-r from-[#fc6011] to-[#ff8743] text-white px-5 py-3 text-lg font-semibold text-center'>
        Sắp xếp theo
      </div>

      <div>
        {sortOptions.map((option) => (
          <div
            key={option.key}
            onClick={() => setSort(option.key)}
            className={`flex items-center gap-4 p-4 cursor-pointer transition-all hover:bg-[#fff7f2] ${
              sort === option.key ? "bg-[#fff1e7]" : ""
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
                  src={`/assets/${sort === option.key ? "button_active" : "button"}.png`}
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
