import Image from "next/image";
import React from "react";

const RatingBar = ({ ratings }) => {
  const totalRatings = Object.values(ratings).reduce((sum, value) => sum + value, 0);

  const totalScore = Object.entries(ratings).reduce((sum, [star, count]) => sum + Number(star) * count, 0);

  const avgRating = totalRatings ? (totalScore / totalRatings).toFixed(2) : "0.00";

  return (
    <div className='bg-[#e6e6e680] m-[20px] rounded-[8px] md:mx-0 md:my-[20px]'>
      <div
        className='flex items-center gap-[6px] pb-[10px] px-[20px] pt-[20px]'
        style={{ borderBottom: "3px solid #fff" }}
      >
        <span className='text-[#4A4B4D] text-[24px] font-bold'>{avgRating}</span>
        <Image src='/assets/star_active.png' alt='' width={20} height={20} />
        <span className='text-[#636464]'>{`(${totalRatings} đánh giá)`}</span>
      </div>

      <div className='px-[20px] pt-[10px] pb-[20px]'>
        <div className='flex flex-col gap-[8px w-full]'>
          {Object.keys(ratings)
            .sort((a, b) => b - a) // Sắp xếp từ 5 sao đến 1 sao
            .map((star) => {
              const count = ratings[star];
              const percentage = totalRatings ? (count / totalRatings) * 100 : 0;

              return (
                <div key={star} className='flex items-center gap-[10px]'>
                  <span className='w-[20px] text-center text-[18px]'>{star}</span>
                  <div className='flex-1 h-[10px] bg-[#d3d3d3] rounded-[5px] overflow-hidden'>
                    <div
                      className='h-[100%] bg-[#fc6011] rounded-[5px] '
                      style={{ width: `${percentage}%`, transition: "width 0.3s ease-in-out" }}
                    ></div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default RatingBar;
