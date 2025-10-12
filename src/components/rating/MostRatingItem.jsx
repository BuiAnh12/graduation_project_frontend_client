import Image from "next/image";
import React from "react";

const MostRatingItem = ({ rating }) => (
  <div className="flex flex-col justify-between p-6 rounded-2xl bg-white from-primary to-accent text-black shadow-smooth transform hover:scale-[1.02] transition-all duration-300">
    <p className="text-lg line-clamp-2 font-medium italic">“{rating.comment}”</p>

    <div className="flex items-center gap-1 mt-3">
      <Image src="/assets/star_active.png" alt="star" width={16} height={16} />
      <span>{rating.ratingValue}</span>
      <div className="w-1 h-1 rounded-full bg-white/60"></div>
      <span className="opacity-90 text-sm">{rating?.users?.name}</span>
    </div>
  </div>
);

export default MostRatingItem;
