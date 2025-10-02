import Image from "next/image";
import Link from "next/link";
import React from "react";

const StoreSmallCard = ({ store }) => {
  return (
    <Link
      href={`/store/${store._id}`}
      className='flex gap-3 items-start w-full bg-white rounded-lg p-2 hover:bg-[#fff7f2] transition-all duration-200'
    >
      {/* Ảnh cửa hàng */}
      <div className='relative w-[70px] h-[70px] shrink-0 rounded-lg overflow-hidden shadow-sm'>
        <Image
          src={store.avatar.url || "/assets/default_store.png"}
          alt={store.name}
          layout='fill'
          objectFit='cover'
          className='hover:scale-105 transition-transform duration-300'
        />
      </div>

      {/* Thông tin */}
      <div className='flex flex-1 flex-col overflow-hidden'>
        <span className='text-[#4A4B4D] text-[16px] font-semibold line-clamp-2'>{store.name}</span>

        {/* Rating */}
        <div className='flex items-center gap-1 mt-[4px]'>
          {store?.avgRating !== 0 && (
            <>
              <div className='relative w-[18px] h-[18px]'>
                <Image src='/assets/star_active.png' alt='rating' layout='fill' objectFit='contain' />
              </div>
              <span className='text-[#fc6011] text-[14px] font-medium'>{store?.avgRating?.toFixed(1)}</span>
            </>
          )}
          {store?.amountRating !== 0 && (
            <span className='text-[#636464] text-[14px] truncate'>({store?.amountRating} đánh giá)</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default StoreSmallCard;
