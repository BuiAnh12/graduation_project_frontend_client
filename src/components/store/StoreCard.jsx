import Image from "next/image";
import Link from "next/link";
import React from "react";

const StoreCard = ({ store }) => {
  return (
    <Link
      href={`/store/${store._id}`}
      className='flex gap-4 items-start p-3 bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300'
    >
      {/* Hình ảnh cửa hàng */}
      <div className='relative w-[90px] h-[90px] flex-shrink-0 rounded-xl overflow-hidden'>
        <Image src={store.avatar.url || "/placeholder.png"} alt={store.name} fill className='object-cover' />
      </div>

      {/* Nội dung */}
      <div className='flex flex-col flex-1 overflow-hidden'>
        {/* Tên cửa hàng */}
        <h4 className='truncate text-gray-800 text-lg font-semibold mb-1'>{store.name}</h4>

        {/* Danh mục */}
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

        {/* Đánh giá */}
        {store.avgRating > 0 && (
          <div className='flex items-center gap-2 text-sm'>
            <div className='relative w-4 h-4'>
              <Image src='/assets/star_active.png' alt='rating' fill className='object-contain' />
            </div>
            <span className='text-orange-500 font-medium'>{store.avgRating.toFixed(1)}</span>
            {store.amountRating > 0 && <span className='text-gray-500'>({store.amountRating} đánh giá)</span>}
          </div>
        )}
      </div>
    </Link>
  );
};

export default StoreCard;
