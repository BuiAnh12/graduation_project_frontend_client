"use client";
import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/header/Header";
import NavBar from "@/components/header/NavBar";
import Heading from "@/components/Heading";
import StoreBigCard from "@/components/store/StoreBigCard";
import CategorySlider from "@/components/category/CategorySlider";
import { useStoreSearch } from "@/hooks/useStoreSearch";
import StoreSmallCard from "@/components/store/StoreSmallCard";
import Pagination from "@/components/Pagination";
import SortBy from "@/components/filter/SortBy";
import CategoryFilter from "@/components/filter/CategoryFilter";

const page = () => {
    const searchParams = useSearchParams();
    const [openFilter, setOpenFilter] = useState(null);

    const query = useMemo(
        () => ({
            keyword: searchParams.get("keyword") || "",
            category: searchParams.get("category") || "",
            sort: searchParams.get("sort") || "",
            limit: searchParams.get("limit") || "5",
            page: searchParams.get("page") || "1",
        }),
        [searchParams.toString()]
    );

    const { allStore, ratingStore, standoutStore, loading, error } =
        useStoreSearch(query);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [query.page, allStore]);

    return (
        <>
          <Heading title="Tìm kiếm" description="" keywords="" />
    
          {openFilter ? (
            <div className="pb-[160px] pt-[85px]">
              {/* Fixed Filter Header */}
              <div className="fixed top-0 right-0 left-0 z-10 flex items-center gap-5 bg-white h-[85px] px-5 border-b border-gray-200 shadow-md">
                <Image
                  src="/assets/close.png"
                  className="cursor-pointer hover:scale-110 transition-transform"
                  alt="Close filter"
                  width={25}
                  height={25}
                  onClick={() => setOpenFilter(null)}
                />
                <h3 className="text-lg font-semibold text-gray-700">
                  {openFilter === "All Filter"
                    ? "Bộ lọc"
                    : openFilter === "Sort By"
                    ? "Sắp xếp theo"
                    : "Danh mục"}
                </h3>
              </div>
    
              {/* Filter Components */}
              <div className="mt-[85px] space-y-4 px-5">
                {openFilter === "All Filter" && (
                  <>
                    <SortBy />
                    <CategoryFilter />
                  </>
                )}
                {openFilter === "Sort By" && <SortBy />}
                {openFilter === "Category Filter" && <CategoryFilter />}
              </div>
            </div>
          ) : (
            <div className="pt-[150px] pb-[100px] px-[20px] md:pt-[90px] md:w-[90%] md:mx-auto md:px-0">
              <Header />
    
              <div className="py-5">
                <CategorySlider />
    
                {/* Main Layout */}
                <div className="grid grid-cols-12 gap-9 md:mt-5">
                  {/* Left Content */}
                  <div className="xl:col-span-9 lg:col-span-8 md:col-span-8 col-span-12">
                    {/* Mobile Filters */}
                    <div className="block md:hidden mb-4">
                      <div className="flex items-center gap-4 overflow-x-auto whitespace-nowrap">
                        {/* All Filter */}
                        <button
                          className="flex items-center gap-2 bg-gray-100 rounded-xl px-4 py-2 hover:bg-gray-200 transition"
                          onClick={() => setOpenFilter("All Filter")}
                        >
                          <div className="relative w-[24px] h-[24px]">
                            <Image src="/assets/filter.png" alt="Filter" fill />
                          </div>
                        </button>
    
                        {/* Sort By */}
                        <button
                          className="flex items-center gap-2 bg-gray-100 rounded-xl px-4 py-2 hover:bg-gray-200 transition"
                          onClick={() => setOpenFilter("Sort By")}
                        >
                          <div className="relative w-[24px] h-[24px]">
                            <Image src="/assets/arrow_up_down.png" alt="Sort" fill />
                          </div>
                          <span className="text-gray-700 text-base font-medium">
                            Sắp xếp theo
                          </span>
                        </button>
    
                        {/* Category Filter */}
                        <button
                          className="flex items-center gap-2 bg-gray-100 rounded-xl px-4 py-2 hover:bg-gray-200 transition"
                          onClick={() => setOpenFilter("Category Filter")}
                        >
                          <div className="relative w-[24px] h-[24px]">
                            <Image src="/assets/promotion.png" alt="Category" fill />
                          </div>
                          <span className="text-gray-700 text-base font-medium">
                            Danh mục
                          </span>
                        </button>
    
                        {/* Refresh */}
                        <Link
                          href="/search"
                          className="text-[#e60012] text-base font-semibold hover:underline whitespace-nowrap"
                        >
                          Làm mới
                        </Link>
                      </div>
                    </div>
    
                    {/* Store Grid (Desktop) */}
                    <div className="hidden md:block">
                      <div className="grid lg:grid-cols-2 md:grid-cols-1 gap-6">
                        {allStore?.data?.length > 0 ? (
                          allStore?.data?.map((store) => (
                            <StoreBigCard key={store._id} store={store} />
                          ))
                        ) : (
                          <h3 className="text-lg text-gray-700 font-semibold">
                            Không tìm thấy cửa hàng nào
                          </h3>
                        )}
                      </div>
                    </div>
                  </div>
    
                  {/* Right Sidebar */}
                  <div className="xl:col-span-3 lg:col-span-4 md:col-span-4 hidden md:block">
                    {/* Sort Section */}
                    <div className="rounded-xl mb-6 bg-white shadow-md hover:shadow-lg transition-shadow">
                      <SortBy />
                    </div>
    
                    <div className="rounded-xl mb-6 bg-white overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                      <h3 className="text-white text-[20px] bg-gradient-to-r from-[#fc2111] to-[#ff8743] text-center px-4 py-3 font-semibold">
                        Quán ăn nổi bật
                      </h3>
                      {/* Added min-h-[100px] to prevent layout shift */}
                      <ul className="flex flex-col gap-3 p-3 max-h-[280px] min-h-[100px] overflow-y-auto small-scrollbar relative">
                        {loading ? (
                          <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
                            <span className="loading loading-spinner text-primary"></span>
                          </div>
                        ) : standoutStore?.total > 0 ? (
                          standoutStore.data.map((store) => (
                            <StoreSmallCard key={store._id} store={store} />
                          ))
                        ) : (
                          <li className="flex flex-col items-center justify-center h-full text-gray-500 italic py-4">
                            <span>Không có dữ liệu</span>
                          </li>
                        )}
                      </ul>
                    </div>
    
                    {/* High Rating Store */}
                    <div className="rounded-xl mb-6 bg-white overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                      <h3 className="text-white text-[20px] bg-gradient-to-r from-[#fc2111] to-[#ff8743] text-center px-4 py-3 font-semibold">
                        Quán ăn được đánh giá tốt
                      </h3>
                      <ul className="flex flex-col gap-3 p-3 max-h-[280px] overflow-y-auto small-scrollbar">
                        {loading ? (
                          <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
                            <span className="loading loading-spinner text-primary"></span>
                          </div>
                        ) : ratingStore?.total > 0 ? (
                          ratingStore.data.map((store) => (
                            <StoreSmallCard key={store._id} store={store} />
                          ))
                        ) : (
                          <li className="flex flex-col items-center justify-center h-full text-gray-500 italic py-4">
                            <span>Không có dữ liệu</span>
                          </li>
                        )}
                      </ul>
                    </div>
    
                    {/* Category Filter */}
                    <div className="rounded-xl bg-white shadow-md hover:shadow-lg transition-shadow">
                      <CategoryFilter />
                    </div>
                  </div>
                </div>
    
                {/* Mobile Store List */}
                <div className="block md:hidden mt-6">
                  <div className="flex flex-col gap-4">
                    {allStore?.data?.length > 0 ? (
                      allStore.data.map((store) => (
                        <StoreBigCard key={store._id} store={store} />
                      ))
                    ) : (
                      <h3 className="text-lg text-gray-700 font-semibold">  
                        Không tìm thấy cửa hàng nào
                      </h3>
                    )}
                  </div>
                </div>
    
                {/* Pagination */}
                {allStore?.data?.length > 0 && (
                  <Pagination
                    page={allStore.page}
                    limit={allStore.limit}
                    total={allStore.total}
                  />
                )}
              </div>
            </div>
          )}
    
          {/* Bottom Navigation */}
          {!openFilter && (
            <div className="md:hidden">
              <NavBar page="" />
            </div>
          )}
        </>
      );
};

export default page;
