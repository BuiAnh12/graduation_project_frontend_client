"use client";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const SearchBar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("keyword") || "");
  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "";
  const limit = searchParams.get("limit") || "20";
  const page = searchParams.get("page") || "1";

  useEffect(() => {
    setSearch(searchParams.get("keyword") || "");
  }, [searchParams]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (search) params.set("keyword", search);
    if (category) params.set("category", category);
    if (sort) params.set("sort", sort);
    if (limit) params.set("limit", limit);
    if (page) params.set("page", page);

    router.push(`/search?${params.toString()}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className='relative w-full my-3 md:my-0 md:w-[90%] lg:w-[60%]'>
      {/* Icon Search */}
      <button
        className='absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400 hover:text-[#fc6011] transition'
        onClick={handleSearch}
      >
        <Image src='/assets/search.png' alt='search' width={22} height={22} />
      </button>

      {/* Input */}
      <input
        type='text'
        value={search}
        placeholder='Tìm kiếm quán ăn...'
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={handleKeyDown}
        className='w-full pl-12 pr-4 py-3 rounded-full bg-[#f3f3f3] text-gray-700 text-lg placeholder-gray-400 outline-none border border-transparent focus:border-[#fc6011] focus:bg-white focus:shadow-md transition-all'
      />

      {/* Nút Xóa nhanh */}
      {search && (
        <button
          className='absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition'
          onClick={() => setSearch("")}
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default SearchBar;
