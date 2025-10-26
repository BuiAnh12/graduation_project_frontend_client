"use client";
import Link from "next/link";
import React from "react";
import StoreSlider from "./StoreSlider";
import { groupStoresByCategory } from "@/utils/functions";

const ListStore = ({ allStore }) => {
  const groupedStores = groupStoresByCategory(allStore);

  return (
    <div className="space-y-10 sm:space-y-12">
      {groupedStores.map(({ category, stores }) => (
        <div
          key={category?._id}
          className="mb-[24px] transition-all duration-300 hover:scale-[1.01] shadow-inner p-6 rouneded"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-[10px]">
            <h3 className="text-[#b91c1c] text-[22px] sm:text-[24px] font-bold tracking-tight">
              {category.name}
            </h3>

            <Link
              href={`/search?category=${category?._id}`}
              className="whitespace-nowrap text-red-500 hover:text-red-600 text-[15px] sm:text-[16px] font-medium transition-colors duration-200"
            >
              Xem tất cả →
            </Link>
          </div>

          {/* Divider line (visual separator) */}
          <div className="h-[2px] w-full bg-gradient-to-r from-red-500/60 via-red-400/40 to-transparent rounded-full mb-4" />

          {/* Desktop layout */}
          <div className="hidden sm:block">
            {stores.length > 6 ? (
              <>
                <StoreSlider
                  reverse={true}
                  stores={stores.slice(0, Math.ceil(stores.length / 2))}
                />
                <StoreSlider
                  reverse={false}
                  stores={stores.slice(Math.ceil(stores.length / 2))}
                />
              </>
            ) : (
              <StoreSlider reverse={true} stores={stores} />
            )}
          </div>

          {/* Mobile layout */}
          <div className="block sm:hidden">
            <StoreSlider reverse={true} stores={stores} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListStore;
