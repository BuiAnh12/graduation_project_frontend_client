import Image from "next/image";
import React from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { favoriteService } from "@/api/favoriteService";
import { useFavorite } from "@/context/favoriteContext";

const FavoriteItem = ({ store }) => {
  const { refreshFavorite } = useFavorite();

  const handleRemoveFavorite = async () => {
    try {
      await favoriteService.removeFavorite(store._id);
      toast.success("Xóa khỏi yêu thích thành công!");
      refreshFavorite();
    } catch (error) {
      console.error(error);
    }
  };

  const confirmRemoveFavorite = async () => {
    const result = await Swal.fire({
      title: "Bạn có chắc chắn muốn xóa khỏi yêu thích?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy",
    });
    if (result.isConfirmed) {
      await handleRemoveFavorite();
    }
  };

  return (
    <Link
      href={`/store/${store._id}`}
      className='relative block bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg'
    >
      {/* Hình ảnh cửa hàng */}
      <div className='relative w-full pt-[55%]'>
        <Image
          src={store?.avatarImage?.url || "/placeholder.png"}
          alt={store.name}
          fill
          className='object-cover rounded-t-2xl'
        />
      </div>

      {/* Nội dung */}
      <div className='flex flex-col gap-1 p-4'>
        <h4 className='text-gray-800 text-lg font-semibold line-clamp-1'>{store.name}</h4>

        {/* Danh mục */}
        <div className='mt-1 text-sm text-gray-500 line-clamp-1'>
          {store.storeCategory &&
            store.storeCategory.map((category, index) => (
              <div key={category._id || index} className='inline'>
                <Link href={`/search?category=${category._id}`} className='hover:text-[#fc2111] transition'>
                  {category.name}
                </Link>
                {index !== store.storeCategory.length - 1 && (
                  <span className='inline-block w-1 h-1 my-[3px] mx-[5px] bg-[#fc2111] rounded-full'></span>
                )}
              </div>
            ))}
        </div>

        {/* Rating */}
        <div className='flex items-center gap-2 mt-1'>
          {store.avgRating > 0 && (
            <>
              <div className='relative w-4 h-4'>
                <Image src='/assets/star_active.png' alt='rating' fill className='object-contain' />
              </div>
              <span className='text-orange-500 text-sm font-medium'>{store.avgRating.toFixed(1)}</span>
            </>
          )}
          {store.amountRating > 0 && <span className='text-gray-500 text-sm'>({store.amountRating} đánh giá)</span>}
        </div>
      </div>

      {/* Nút xóa */}
      <div
        className='absolute top-3 right-3 z-10 p-2 bg-gray-200 hover:bg-gray-300 rounded-full cursor-pointer transition'
        onClick={(e) => {
          e.preventDefault();
          confirmRemoveFavorite();
        }}
      >
        <div className='relative w-6 h-6'>
          <Image src='/assets/trash.png' alt='remove' fill className='object-contain' />
        </div>
      </div>
    </Link>
  );
};

export default FavoriteItem;
