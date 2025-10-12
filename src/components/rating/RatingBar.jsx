"use client";
import Image from "next/image";
import React from "react";

const RatingBar = ({ ratings = {} }) => {
  // Normalize keys to numbers just in case
  const normalized = Object.fromEntries(
    Object.entries(ratings).map(([key, val]) => [Number(key), val || 0])
  );

  const total = Object.values(normalized).reduce((a, b) => a + b, 0);
  const score = Object.entries(normalized).reduce(
    (a, [star, count]) => a + star * count,
    0
  );
  const avg = total ? (score / total).toFixed(1) : "0.0";

  return (
    <div className="bg-[#fff5f5] rounded-2xl p-6 shadow-[0_4px_12px_rgba(252,33,17,0.1)] shadow-inner">
      {/* Average score header */}
      <div className="flex items-center gap-3 pb-4 border-b border-[#f5cccc]">
        <span className="text-4xl font-bold text-[#fc2111]">{avg}</span>
        <Image src="/assets/star_active.png" alt="star" width={22} height={22} />
        <span className="text-[#757575] text-base">{`(${total} đánh giá)`}</span>
      </div>

      {/* Rating breakdown */}
      <div className="mt-4 space-y-3">
        {[5, 4, 3, 2, 1].map((star) => {
          const percent = total ? (normalized[star] / total) * 100 : 0;

          return (
            <div key={star} className="flex items-center gap-3">
              <span className="w-5 text-center text-lg font-semibold text-[#fc2111]">
                {star}
              </span>
              <div className="flex-1 h-3 bg-[#ffe6e6] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#fc2111] to-[#ff7e3c] transition-all duration-300"
                  style={{ width: `${percent}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RatingBar;
