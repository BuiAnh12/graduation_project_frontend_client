"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import NavBar from "@/components/header/NavBar";
import Heading from "@/components/Heading";
import Header from "@/components/header/Header";
import CategorySlider from "@/components/category/CategorySlider";
import Hero from "@/components/hero/Hero";
import ListStore from "@/components/store/ListStore";
import StoreBigSlider from "@/components/store/StoreBigSlider";
import { useStoreSearch } from "@/hooks/useStoreSearch";
import { ThreeDot } from "react-loading-indicators";
import { useAuth } from "@/context/authContext";
import DishRecommendSlider from "@/components/dish/DishRecommendSlider";

const Page = () => {
    const {
        allStore,
        ratingStore,
        standoutStore,
        loading: storeLoading,
    } = useStoreSearch();
    const { setUserId, userId } = useAuth();

    useEffect(() => {
        const userId = JSON.parse(localStorage.getItem("userId"));
        setUserId(userId);
    }, []);

    if (storeLoading) {
        return (
            <div className="w-full h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
                <ThreeDot color="#fc2111" size="medium" />
            </div>
        );
    }

    return (
        <div
            className="pt-[120px] pb-[100px] md:pt-[75px] bg-gradient-to-b from-white to-gray-50 min-h-screen"
            name="home_page"
        >
            <Heading title="Trang chủ" description="" keywords="" />
            <Header />

            {ratingStore && ratingStore?.total > 0 && (
                <section className="mb-12">
                    <Hero allStore={ratingStore.data} />
                </section>
            )}

            <main className="md:w-[90%] mx-auto space-y-12">
                {/* 🍴 Category Slider */}
                <section className="px-[20px] md:px-0">
                    <CategorySlider />
                </section>

                {/* ⭐ Featured Store */}
                {standoutStore && standoutStore?.total > 0 && (
                    <section className="px-[20px] md:px-0">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-[20px] md:text-[24px] font-extrabold text-[#b91c1c]">
                                Nhà hàng nổi bật
                            </h3>
                            <Link
                                href="/search?sort=standout"
                                className="text-[#fc2111] hover:text-[#e4510d] transition-colors text-sm font-medium"
                            >
                                Xem tất cả →
                            </Link>
                        </div>

                        {standoutStore?.data &&
                            standoutStore.data.length > 0 && (
                                <Link
                                    href={`/store/${standoutStore.data[0]._id}`}
                                    className="group flex flex-col sm:flex-row rounded-xl overflow-hidden bg-white shadow-sm border border-gray-100 hover:shadow-md hover:border-[#fc2111]/30 transition-all duration-300 h-auto sm:h-[180px]"
                                >
                                    {/* Image Section - Fixed height on mobile, width on desktop */}
                                    <div className="relative w-full h-[200px] sm:h-full sm:w-[280px] shrink-0">
                                        <Image
                                            src={
                                                standoutStore.data[0]
                                                    .avatarImage?.url ||
                                                "/assets/default_store.png"
                                            }
                                            alt={standoutStore.data[0].name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        {/* Optional: "Top 1" Badge */}
                                        <div className="absolute top-2 left-2 bg-[#fc2111] text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
                                            #1 Nổi bật
                                        </div>
                                    </div>

                                    {/* Content Section */}
                                    <div className="p-4 flex flex-col justify-center flex-1">
                                        <h4 className="text-lg md:text-xl font-bold text-gray-800 group-hover:text-[#fc2111] transition-colors line-clamp-1 mb-2">
                                            {standoutStore.data[0].name}
                                        </h4>

                                        {/* Rating & Count */}
                                        <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                                            {standoutStore.data[0].avgRating >
                                                0 ||
                                            standoutStore.data[0].amountRating >
                                                0 ? (
                                                <div className="flex items-center gap-1">
                                                    <div className="relative w-4 h-4">
                                                        <Image
                                                            src="/assets/star_active.png"
                                                            alt="rating"
                                                            fill
                                                            className="object-contain"
                                                        />
                                                    </div>
                                                    <span className="font-semibold text-gray-900">
                                                        {standoutStore.data[0].avgRating?.toFixed(
                                                            1
                                                        ) || 0}
                                                    </span>
                                                    <span className="text-gray-400">
                                                        (
                                                        {standoutStore.data[0]
                                                            .amountRating ||
                                                            0}{" "}
                                                        đánh giá)
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 italic">
                                                    Chưa có đánh giá
                                                </span>
                                            )}
                                        </div>

                                        {/* Description or Categories */}
                                        <div className="flex flex-wrap items-center gap-2 mb-3">
                                            {standoutStore.data[0].systemCategoryId
                                                ?.slice(0, 3)
                                                .map((category) => (
                                                    <span
                                                        key={category._id}
                                                        className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded border border-gray-100"
                                                    >
                                                        {category.name}
                                                    </span>
                                                ))}
                                        </div>

                                        {/* Call to action text (optional) */}
                                        <span className="text-sm text-[#fc2111] font-medium mt-auto group-hover:underline">
                                            Xem chi tiết quán ăn
                                        </span>
                                    </div>
                                </Link>
                            )}
                    </section>
                )}
                {userId && (
                    <section className="px-[20px] md:px-0">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-[26px] md:text-[30px] font-extrabold text-[#b91c1c]">
                                Món giới thiệu
                            </h3>
                            <Link
                                href="/search?sort=recommend"
                                className="text-[#fc2111] hover:text-[#e4510d] transition-colors text-sm sm:text-base font-medium"
                            >
                                Xem tất cả →
                            </Link>
                        </div>

                        <DishRecommendSlider />
                    </section>
                )}

                {/* 🔥 Popular Stores */}
                {ratingStore && ratingStore?.total > 0 && (
                    <section className="px-[20px] md:px-0">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-[26px] md:text-[30px] font-extrabold text-[#b91c1c]">
                                Phổ biến nhất
                            </h3>
                            <Link
                                href="/search?sort=rating"
                                className="text-[#fc2111] hover:text-[#e4510d] transition-colors text-sm sm:text-base font-medium"
                            >
                                Xem tất cả →
                            </Link>
                        </div>
                        <StoreBigSlider allStore={ratingStore?.data} />
                    </section>
                )}

                {/* 🏪 All Stores */}
                {allStore && allStore?.total > 0 && (
                    <section className="px-[20px] md:px-0">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-[26px] md:text-[30px] font-extrabold text-[#b91c1c]">
                                Tất cả cửa hàng
                            </h3>
                        </div>
                        <ListStore allStore={allStore?.data} />
                    </section>
                )}
            </main>

            {/* 📱 Mobile Navbar */}
            <div className="md:hidden">
                <NavBar page="home" />
            </div>
        </div>
    );
};

export default Page;
