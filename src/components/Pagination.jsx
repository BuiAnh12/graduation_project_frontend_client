"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { motion } from "framer-motion";

const Pagination = ({ page, limit, total }) => {
  const router = useRouter();
  page = Number(page);
  const totalPages = Math.ceil(total / limit);

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", Number(newPage));
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const getPageNumbers = () => {
    if (totalPages <= 9) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (page <= 4) return [1, 2, 3, 4, "...", totalPages];
    if (page >= totalPages - 3)
      return [1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, "...", page - 2, page - 1, page, page + 1, page + 2, "...", totalPages];
  };

  const pages = getPageNumbers();

  return (
    <div className="mt-6 w-full flex items-center justify-center gap-2">
      {/* Prev Button */}
      <button
        className={`flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 transition-all duration-200 hover:border-[#fc2111] hover:bg-[#fc2111]/10 ${
          page <= 1 ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={() => page > 1 && handlePageChange(page - 1)}
      >
        <Image
          src="/assets/arrow_left.png"
          alt="Prev"
          width={16}
          height={16}
          className="opacity-80"
        />
      </button>

      {/* Page Numbers */}
      {pages.map((p, index) =>
        p === "..." ? (
          <span
            key={index}
            className="px-3 py-2 text-gray-500 select-none text-sm font-medium"
          >
            ...
          </span>
        ) : (
          <motion.button
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handlePageChange(p)}
            className={`min-w-[40px] h-10 px-3 rounded-full border text-sm font-medium transition-all duration-200 ${
              p === page
                ? "bg-[#fc2111] border-[#fc2111] text-white shadow-sm"
                : "bg-white border-gray-300 text-gray-700 hover:border-[#fc2111] hover:text-[#fc2111]"
            }`}
          >
            {p}
          </motion.button>
        )
      )}

      {/* Next Button */}
      <button
        className={`flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 transition-all duration-200 hover:border-[#fc2111] hover:bg-[#fc2111]/10 ${
          page >= totalPages ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={() => page < totalPages && handlePageChange(page + 1)}
      >
        <Image
          src="/assets/arrow_right.png"
          alt="Next"
          width={16}
          height={16}
          className="opacity-80"
        />
      </button>
    </div>
  );
};

export default Pagination;
