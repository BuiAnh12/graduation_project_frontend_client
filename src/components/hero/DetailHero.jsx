import Image from "next/image";
import Link from "next/link";
import React from "react";

const DetailHero = ({ store }) => {
    // Safe check for data
    if (!store) return null;

    const isOpen = store.openStatus === "opened";

    return (
        <div className="relative w-full h-[350px] md:h-[450px] overflow-hidden shadow-xl bg-gray-900 group">
            {/* --- 1. Background Cover Image --- */}
            <div className="absolute inset-0">
                <Image
                    src={store?.coverImage?.url || "/assets/default_cover.png"} // Fallback if no cover
                    alt="Cover"
                    fill
                    priority
                    className="object-cover opacity-90 group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                {/* Dark Gradient Overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent/20" />
            </div>

            {/* --- 2. Content Container --- */}
            <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 z-20">
                <div className="flex flex-col md:flex-row items-end md:items-center gap-6">
                    {/* Avatar / Logo (Floating Effect) */}
                    <div className="relative w-24 h-24 md:w-32 md:h-32 shrink-0 rounded-full border-[4px] border-white/20 shadow-2xl overflow-hidden backdrop-blur-md">
                        <Image
                            src={
                                store?.avatarImage?.url ||
                                "/assets/default_store.png"
                            }
                            alt={store.name}
                            fill
                            className="object-cover bg-white"
                        />
                    </div>

                    {/* Text Info */}
                    <div className="flex-1 flex flex-col items-start gap-2 w-full">
                        {/* Categories & Status Row */}
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                            {/* Open Status Badge */}
                            <div
                                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm backdrop-blur-md border border-white/10 ${
                                    isOpen
                                        ? "bg-green-500/90 text-white"
                                        : "bg-red-500/90 text-white"
                                }`}
                            >
                                <span
                                    className={`w-2 h-2 rounded-full ${
                                        isOpen
                                            ? "bg-white animate-pulse"
                                            : "bg-white/50"
                                    }`}
                                ></span>
                                {isOpen ? "Đang mở cửa" : "Đóng cửa"}
                            </div>

                            {/* Categories */}
                            {store.systemCategoryId?.map((category) => (
                                <Link
                                    href={`/search?category=${category?._id}`}
                                    key={category?._id}
                                    className="bg-white/20 hover:bg-[#fc2111] text-white text-xs px-3 py-1 rounded-full transition-colors duration-300 backdrop-blur-md border border-white/10"
                                >
                                    {category.name}
                                </Link>
                            ))}
                        </div>

                        {/* Store Name */}
                        <h1 className="text-white text-3xl md:text-5xl font-black tracking-tight drop-shadow-lg">
                            {store.name}
                        </h1>

                        {/* Address & Rating Row */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-200 mt-1">
                            {/* Rating */}
                            <div className="flex items-center gap-1">
                                <div className="relative w-4 h-4 pb-1">
                                    <Image
                                        src="/assets/star_active.png"
                                        alt="star"
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                                {store.avgRating > 0 ? (
                                    <span className="font-bold text-white text-base">
                                        {store.avgRating.toFixed(1)}
                                        <span className="font-normal text-gray-400 text-sm ml-1">
                                            ({store.amountRating} đánh giá)
                                        </span>
                                    </span>
                                ) : (
                                    <span className="italic text-gray-400">
                                        Chưa có đánh giá
                                    </span>
                                )}
                            </div>

                            <div className="hidden sm:block w-[1px] h-4 bg-gray-500"></div>

                            {/* Address */}
                            <div className="flex items-center gap-1.5 opacity-90 hover:opacity-100 transition-opacity">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="w-4 h-4 text-[#fc2111]"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <span
                                    className="truncate max-w-[200px] md:max-w-md"
                                    title={store.address_full}
                                >
                                    {store.address_full}
                                </span>
                            </div>
                        </div>

                        {/* Description (Desktop Only) */}
                        {store.description && (
                            <p className="hidden md:block text-gray-300 text-sm mt-2 max-w-2xl line-clamp-2 leading-relaxed opacity-80">
                                {store.description}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailHero;
