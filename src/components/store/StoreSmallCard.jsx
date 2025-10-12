import Image from "next/image";
import Link from "next/link";
import React from "react";

const StoreSmallCard = ({ store }) => {
  return (
    <Link
      href={`/store/${store._id}`}
      className="group flex gap-3 items-start w-full bg-white rounded-xl p-3 border border-gray-100 hover:border-[#fc2111]/40 hover:shadow-md hover:-translate-y-[2px] transition-all duration-300"
    >
      {/* Ảnh cửa hàng */}
      <div className="relative w-[70px] h-[70px] shrink-0 rounded-lg overflow-hidden shadow-sm ring-1 ring-gray-100 group-hover:ring-[#fc2111]/40 transition-all duration-300">
        <Image
          src={store?.avatarImage?.url || "/assets/default_store.png"}
          alt={store.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Thông tin */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Tên cửa hàng */}
        <span className="text-[#4A4B4D] text-[15px] font-semibold line-clamp-2 group-hover:text-[#fc2111] transition-colors">
          {store.name}
        </span>

        {/* Đánh giá */}
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
  );
};

export default StoreSmallCard;
