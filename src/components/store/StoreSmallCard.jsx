import Image from "next/image";
import Link from "next/link";
import React from "react";

const StoreSmallCard = ({ store }) => {
  const hasFoundDishes = store?.foundDishes && store.foundDishes.length > 0;

  return (
    <div className="flex flex-col w-full bg-white rounded-xl border border-gray-100 hover:border-[#fc2111]/40 hover:shadow-md hover:-translate-y-[2px] transition-all duration-300 overflow-hidden">
      {/* --- Store Header Section --- */}
      <Link href={`/store/${store._id}`} className="group flex gap-3 items-start w-full p-3">
        {/* Store Image */}
        <div className="relative w-[70px] h-[70px] shrink-0 rounded-lg overflow-hidden shadow-sm ring-1 ring-gray-100 group-hover:ring-[#fc2111]/40 transition-all duration-300">
          <Image
            src={store?.avatarImage?.url || "/assets/default_store.png"}
            alt={store.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Store Info */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <span className="text-[#4A4B4D] text-[15px] font-semibold line-clamp-2 group-hover:text-[#fc2111] transition-colors">
            {store.name}
          </span>

          {(store?.avgRating > 0 || store?.amountRating > 0) && (
            <div className="flex items-center gap-1 mt-[6px] text-sm">
              {store?.avgRating > 0 && (
                <>
                  <div className="relative w-[16px] h-[16px]">
                    <Image
                      src="/assets/star_active.png"
                      alt="rating"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="text-[#fc2111] font-medium">
                    {store?.avgRating?.toFixed(1)}
                  </span>
                </>
              )}
              {store?.amountRating > 0 && (
                <span className="text-gray-500 truncate">
                  ({store?.amountRating} đánh giá)
                </span>
              )}
            </div>
          )}
        </div>
      </Link>

      {/* --- Found Dishes Section (New) --- */}
      {hasFoundDishes && (
        <div className="px-3 pb-3 pt-0">
          <div className="border-t border-dashed border-gray-200 my-2"></div>
          <div className="flex flex-col gap-2">
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">
              Món liên quan:
            </span>
            {store.foundDishes.slice(0, 3).map((dish) => ( // Show max 3 dishes
              <Link 
                key={dish._id}
                href={`/store/${store._id}?dish=${dish._id}`} // Optional: Link to dish details if supported
                className="flex gap-2 items-center hover:bg-gray-50 p-1 rounded-lg transition-colors"
              >
                <div className="relative w-10 h-10 shrink-0 rounded overflow-hidden bg-gray-100">
                   <Image
                      src={dish.image?.url || "/assets/default_dish.png"}
                      alt={dish.name}
                      fill
                      className="object-cover"
                   />
                </div>
                <div className="flex flex-col flex-1 overflow-hidden">
                    <span className="text-xs font-medium text-gray-700 truncate">
                        {dish.name}
                    </span>
                    <span className="text-xs font-bold text-[#fc2111]">
                        {dish.price?.toLocaleString('vi-VN')}đ
                    </span>
                </div>
              </Link>
            ))}
            
            {store.foundDishes.length > 3 && (
                <Link href={`/store/${store._id}`} className="text-xs text-blue-500 pl-1 hover:underline">
                    Xem thêm {store.foundDishes.length - 3} món khác...
                </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreSmallCard;