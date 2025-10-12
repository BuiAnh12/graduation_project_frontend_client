import React from "react";
import Image from "next/image";

const ChooseStarRating = ({ ratingValue, setRatingValue }) => {
  const handleStarClick = (index) => setRatingValue(index + 1);

  return (
    <div className="flex items-center gap-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <button
          key={i}
          onClick={() => handleStarClick(i)}
          className="transition-transform hover:scale-110"
        >
          <Image
            src={i < ratingValue ? "/assets/star_active.png" : "/assets/star.png"}
            alt="star"
            width={36}
            height={36}
          />
        </button>
      ))}
    </div>
  );
};

export default ChooseStarRating;
