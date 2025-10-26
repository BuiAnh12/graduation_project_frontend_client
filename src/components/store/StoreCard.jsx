import Image from "next/image";
import Link from "next/link";
import React from "react";

const StoreCard = ({ store }) => {
  return (
    <Link
      href={`/store/${store._id}`}
      className="group flex gap-4 items-start p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-[3px] transition-all duration-300"
    >
      {/* Ảnh cửa hàng */}
      <div className="relative w-[100px] h-[100px] flex-shrink-0 rounded-xl overflow-hidden ring-1 ring-gray-100 group-hover:ring-[#fc2111]/30 transition-all">
        <Image
          src={store?.avatarImage?.url || "/placeholder.png"}
          alt={store.name}
          fill
          className="object-cover"
        />
      </div>

      {/* Nội dung */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Tên cửa hàng */}
        <h4 className="truncate text-gray-800 text-lg font-semibold group-hover:text-[#fc2111] transition-colors">
          {store.name}
        </h4>

        {/* Danh mục */}
        {store.storeCategory?.length > 0 && (
          <div className="mt-1 text-sm text-gray-500 line-clamp-1">
            {store.storeCategory.map((category, index) => (
              <React.Fragment key={category?._id || index}>
                <Link
                  href={`/search?category=${category?._id}`}
                  className="hover:text-[#fc2111] transition"
                >
                  {category.name}
                </Link>
                {index !== store.storeCategory.length - 1 && (
                  <span className="inline-block w-1 h-1 mx-1 bg-[#fc2111]/60 rounded-full" />
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Đánh giá */}
        {store.avgRating > 0 && (
          <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
            <div className="relative w-4 h-4">
              <Image
                src="/assets/star_active.png"
                alt="rating"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-[#fc2111] font-medium">
              {store.avgRating.toFixed(1)}
            </span>
            {store.amountRating > 0 && (
              <span className="text-gray-400">
                ({store.amountRating} đánh giá)
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
};

export default StoreCard;
