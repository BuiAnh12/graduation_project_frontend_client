"use client";
import Image from "next/image";
import React from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import Header from "@/components/header/Header";
import MobileHeader from "@/components/header/MobileHeader";
import Heading from "@/components/Heading";
import NavBar from "@/components/header/NavBar";
import { useFavorite } from "@/context/favoriteContext";
import { favoriteService } from "@/api/favoriteService";
import FavoriteItem from "@/components/favorite/FavoriteItem";
import { Atom } from "react-loading-indicators";
import Link from "next/link";

const page = () => {
  const { favorite, loading, refreshFavorite } = useFavorite();

  const handleRemoveAllFavorite = async () => {
    try {
      await favoriteService.removeAllFavorite();
      toast.success("Xóa hết yêu thích thành công!");

      refreshFavorite();
    } catch (error) {
      console.error(error);
    }
  };

  const confirmRemoveAllFavorite = async () => {
    const result = await Swal.fire({
      title: "Bạn có chắc chắn muốn xóa hết yêu thích?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      await handleRemoveAllFavorite();
    }
  };

  return (
    <div className='pt-[10px] pb-[100px] md:pt-[90px] md:px-0'>
      <Heading title='Yêu thích' description='' keywords='' />
      <div className='hidden md:block'>
        <Header page='favorite' />
      </div>

      <MobileHeader page='favorite' />

      <div className='md:w-[90%] md:mx-auto px-[20px]'>
        {!loading ? (
          <>
            {favorite ? (
              <div className='my-[20px]'>
                <div className='flex items-center justify-between mb-[20px]'>
                  <h3 className='text-[#4A4B4D] text-[24px] font-bold hidden md:block'>Các cửa hàng yêu thích</h3>
                  <div
                    className='flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#fc6011] to-[#ff8743] cursor-pointer shadow-md hover:shadow-xl transition-transform hover:scale-105'
                    onClick={confirmRemoveAllFavorite}
                  >
                    <Image src='/assets/trash_white.png' alt='' width={20} height={20} />
                    <span className='text-white font-semibold text-lg'>Xóa hết yêu thích</span>
                  </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[20px]'>
                  {favorite.store.map((store) => (
                    <FavoriteItem key={store._id} store={store} />
                  ))}
                </div>
              </div>
            ) : (
              <div className='flex flex-col items-center text-center py-10'>
                <Image src='/assets/no_favorite.png' alt='empty cart' width={150} height={150} />
                <h3 className='text-[#4A4B4D] text-2xl font-bold mt-4'>Yêu thích trống</h3>
                <p className='text-gray-500 mt-2'>Hãy tìm cửa hàng yêu thích!</p>
                <Link
                  href={`/search`}
                  className='mt-5 px-6 py-3 bg-[#fc6011] text-white rounded-full shadow hover:scale-105 transition-transform'
                >
                  Tìm kiếm ngay
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className='w-full h-screen flex items-center justify-center'>
            <Atom color='#fc6011' size='medium' text='' textColor='' />
          </div>
        )}
      </div>

      <div className='md:hidden'>
        <NavBar page='favorite' />
      </div>
    </div>
  );
};

export default page;
