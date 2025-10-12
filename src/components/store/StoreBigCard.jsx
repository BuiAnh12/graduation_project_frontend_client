import Image from "next/image";
import Link from "next/link";
import React from "react";

const StoreBigCard = ({ store }) => {
  const rating = store?.avgRating ?? 0;
  const totalRatings = store?.amountRating ?? 0;

  return (
    <Link
      href={`/store/${store._id}`}
      className="group block bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden border border-gray-100"
    >
      {/* Image Section */}
      <div className="relative w-full aspect-[16/9] overflow-hidden">
        <Image
          src={store?.avatarImage?.url || "/placeholder.png"}
          alt={store?.name || "Store image"}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          priority={false}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

        {/* Rating Badge */}
        {rating > 0 && totalRatings > 0 && (
          <div className="absolute left-3 bottom-3 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm px-2.5 py-1.5 rounded-full text-white">
            <Image
              src="/assets/star_active.png"
              alt="rating"
              width={16}
              height={16}
              className="object-contain"
            />
            <span className="text-sm font-semibold text-yellow-400">
              {rating.toFixed(1)}
            </span>
            <span className="text-xs text-gray-200">
              ({totalRatings})
            </span>
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="p-4">
        <h4 className="text-gray-900 text-lg font-semibold truncate mb-1 group-hover:text-[#fc2111] transition-colors">
          {store?.name || "Tên cửa hàng"}
        </h4>

        {/* Categories */}
        {store?.storeCategory?.length > 0 && (
          <p className="text-sm text-gray-500 line-clamp-1">
            {store.storeCategory.map((category, index) => (
              <span key={category._id || index}>
                <Link
                  href={`/search?category=${category._id}`}
                  className="hover:text-[#fc2111] transition-colors"
                >
                  {category.name}
                </Link>
                {index !== store.storeCategory.length - 1 && (
                  <span className="mx-1 text-[#fc2111]">•</span>
                )}
              </span>
            ))}
          </p>
        )}
      </div>
    </Link>
  );
};

export default StoreBigCard;
