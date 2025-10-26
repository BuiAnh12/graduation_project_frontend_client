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
    const { setUserId } = useAuth();

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

            {/* 🏙️ Hero Section */}
            {ratingStore && ratingStore?.data?.length > 0 && (
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
                {standoutStore && standoutStore?.data?.length > 0 && (
                    <section className="px-[20px] md:px-0">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-[26px] md:text-[30px] font-extrabold text-[#b91c1c]">
                                Nhà hàng nổi bật
                            </h3>
                            <Link
                                href="/search?sort=standout"
                                className="text-[#fc2111] hover:text-[#e4510d] transition-colors text-sm sm:text-base font-medium"
                            >
                                Xem tất cả →
                            </Link>
                        </div>

                        <Link
                            href={`/store/${standoutStore.data[0]._id}`}
                            className="group block rounded-2xl overflow-hidden bg-white shadow hover:shadow-lg transition-all duration-300"
                        >
                            <div className="relative w-full pt-[50%]">
                                <Image
                                    src={standoutStore.data[0].avatar.url}
                                    alt={standoutStore.data[0].name}
                                    layout="fill"
                                    objectFit="cover"
                                    className="group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>

                            <div className="p-4 space-y-2">
                                <h4 className="text-lg font-semibold text-gray-900 truncate">
                                    {standoutStore.data[0].name}
                                </h4>

                                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                                    {standoutStore.data[0].avgRating > 0 && (
                                        <div className="flex items-center gap-1 text-[#fc2111]">
                                            <Image
                                                src="/assets/star_active.png"
                                                alt="rating"
                                                width={18}
                                                height={18}
                                            />
                                            <span>
                                                {standoutStore.data[0].avgRating.toFixed(
                                                    1
                                                )}
                                            </span>
                                            {standoutStore.data[0]
                                                .amountRating > 0 && (
                                                <span className="text-gray-500">
                                                    (
                                                    {
                                                        standoutStore.data[0]
                                                            .amountRating
                                                    }{" "}
                                                    đánh giá)
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    <div className="flex items-center flex-wrap gap-1">
                                        {standoutStore.data[0].storeCategory.map(
                                            (category, index) => (
                                                <Link
                                                    href={`/search?category=${category?._id}`}
                                                    key={category?._id}
                                                    className="hover:text-[#fc2111] transition-colors"
                                                >
                                                    {category.name}
                                                    {index !==
                                                        standoutStore.data[0]
                                                            .storeCategory
                                                            .length -
                                                            1 && ","}
                                                </Link>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </section>
                )}

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

                    <DishRecommendSlider/>
                </section>

                {/* 🔥 Popular Stores */}
                {ratingStore && ratingStore?.length > 0 && (
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
                        <StoreBigSlider allStore={ratingStore} />
                    </section>
                )}

                {/* 🏪 All Stores */}
                {allStore && allStore?.length > 0 && (
                    <section className="px-[20px] md:px-0">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-[26px] md:text-[30px] font-extrabold text-[#b91c1c]">
                                Tất cả cửa hàng
                            </h3>
                        </div>
                        <ListStore allStore={allStore} />
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
