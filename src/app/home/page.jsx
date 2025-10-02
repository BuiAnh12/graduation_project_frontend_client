"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import NavBar from "@/components/header/NavBar";
import Heading from "@/components/Heading";
import Header from "@/components/header/Header";
import CategorySlider from "@/components/category/CategorySlider";
import Hero from "@/components/hero/Hero";
import ListStore from "@/components/store/ListStore";
import StoreBigSlider from "@/components/store/StoreBigSlider";
import { useStoreSearch } from "@/hooks/useStoreSearch";
import { ThreeDot } from "react-loading-indicators";
import { useAuth } from "@/context/authContext";

const page = () => {
  const { allStore, ratingStore, standoutStore, loading: storeLoading } = useStoreSearch();
  const { setUserId } = useAuth();

  useEffect(() => {
    const userId = JSON.parse(localStorage.getItem("userId"));
    setUserId(userId);
  }, []);

  if (storeLoading) {
    return (
      <div className='w-full h-screen flex items-center justify-center'>
        <ThreeDot color='#fc6011' size='medium' text='' textColor='' />
      </div>
    );
  }

  return (
    <div className='pt-[140px] pb-[100px] md:pt-[75px]' name='home_page'>
      <Heading title='Trang chủ' description='' keywords='' />
      <Header />
      {ratingStore && ratingStore?.data?.length > 0 && <Hero allStore={ratingStore.data} />}

      <div className='md:w-[90%] md:mx-auto'>
        <div className='px-[20px] pt-[20px] md:px-0'>
          <CategorySlider />
        </div>

        <div className='my-[20px] md:hidden'>
          <div className='flex items-center justify-between px-[20px] md:px-0 md:mb-[10px]'>
            <h3 className='text-[#4A4B4D] text-[24px] font-bold line-clamp-1'>Nhà hàng nổi tiếng</h3>
            <Link href='/search?sort=standout' className='text-[#fc6011] text-[16px] whitespace-nowrap'>
              Xem tất cả
            </Link>
          </div>

          {standoutStore && standoutStore?.data?.length > 0 && (
            <div className=''>
              <Link href={`/store/${standoutStore.data[0]._id}`} className='my-[20px]'>
                <div className='relative w-full pt-[45%]'>
                  <Image src={standoutStore.data[0].avatar.url} alt='' layout='fill' objectFit='fill' />
                </div>

                <h4 className='text-[#4A4B4D] text-[20px] font-semibold px-[20px] py-[4px] line-clamp-1'>
                  {standoutStore.data[0].name}
                </h4>

                <div
                  className={`flex items-center px-[20px] ${standoutStore.data[0].amountRating != 0 && "gap-[10px]"}`}
                >
                  <div className='flex items-center gap-[6px] flex-shrink-0'>
                    {standoutStore.data[0].avgRating != 0 && (
                      <>
                        <div className='relative w-[20px] h-[20px] md:w-[15px] md:h-[15px] flex-shrink-0'>
                          <Image src='/assets/star_active.png' alt='' layout='fill' objectFit='cover' />
                        </div>
                        <span className='text-[#fc6011]'>{standoutStore.data[0].avgRating.toFixed(2)}</span>
                      </>
                    )}
                    {standoutStore.data[0].amountRating != 0 && (
                      <span className='text-[#636464]'>{`(${standoutStore.data[0].amountRating} đánh giá)`}</span>
                    )}
                  </div>

                  {standoutStore.data[0].amountRating != 0 && (
                    <div className='w-[4px] h-[4px] rounded-full bg-[#fc6011] flex-shrink-0'></div>
                  )}

                  <div className='flex items-center gap-[4px] min-w-0 overflow-hidden text-ellipsis whitespace-nowrap'>
                    {standoutStore.data[0].storeCategory.map((category, index) => (
                      <Link href={`/search?category=${category._id}`} key={category._id} className='text-[#636464]'>
                        {category.name}
                        {index !== standoutStore.data[0].storeCategory.length - 1 && <span>, </span>}
                      </Link>
                    ))}
                  </div>
                </div>
              </Link>
            </div>
          )}
        </div>

        <div className='my-[20px] px-[20px] md:px-0'>
          <div className='flex items-center justify-between mb-[10px]'>
            <h3 className='text-[#4A4B4D] text-[24px] font-bold'>Phổ biến nhất</h3>
            <Link href='/search?sort=rating' className='text-[#fc6011] text-[16px]'>
              Xem tất cả
            </Link>
          </div>

          { ratingStore && ratingStore?.length > 0 && <StoreBigSlider allStore={ratingStore} />}
        </div>

        <div className='my-[20px] px-[20px] md:px-0'>
          { allStore && allStore?.length > 0 && <ListStore allStore={allStore} />}
        </div>
      </div>

      <div className='md:hidden'>
        <NavBar page='home' />
      </div>
    </div>
  );
};

export default page;
