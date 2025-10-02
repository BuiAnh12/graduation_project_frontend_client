import Image from "next/image";
import Link from "next/link";
import React from "react";

const StoreBigCard = ({ store }) => {
  return (
    <Link
      href={`/store/${store._id}`}
      data-testid='store-card'
      className='block bg-white rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden'
    >
      {/* Ảnh cửa hàng */}
      <div className='relative w-full pt-[55%] rounded-t-2xl overflow-hidden'>
        <Image src={store.avatar.url || "/placeholder.png"} alt={store.name} fill className='object-cover' />

        {/* Overlay gradient */}
        <div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent' />

        {/* Rating */}
        {store.avgRating > 0 && store.amountRating > 0 && (
          <div className='absolute left-3 bottom-2 flex items-center gap-2 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full'>
            <div className='relative w-5 h-5 flex-shrink-0'>
              <Image src='/assets/star_active.png' alt='rating' fill className='object-contain' />
            </div>
            <span className='text-orange-400 font-semibold text-sm'>{store.avgRating.toFixed(1)}</span>

            <span className='text-white text-xs whitespace-nowrap'>({store.amountRating} đánh giá)</span>
          </div>
        )}
      </div>

      {/* Nội dung */}
      <div className='p-3'>
        <h4 className='text-gray-800 text-lg font-semibold truncate'>{store.name}</h4>
        <div className='mt-1 text-sm text-gray-500 line-clamp-1'>
          {store.storeCategory &&
            store.storeCategory.map((category, index) => (
              <div key={category._id || index} className='inline'>
                <Link href={`/search?category=${category._id}`} className='hover:text-[#fc6011] transition'>
                  {category.name}
                </Link>
                {index !== store.storeCategory.length - 1 && (
                  <span className='inline-block w-1 h-1 my-[3px] mx-[5px] bg-[#fc6011] rounded-full'></span>
                )}
              </div>
            ))}
        </div>
      </div>
    </Link>
  );
};

export default StoreBigCard;
