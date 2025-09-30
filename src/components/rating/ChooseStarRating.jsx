import React from "react";
import Image from "next/image";

const ChooseStarRating = ({ ratingValue, setRatingValue }) => {
  const handleStarClick = (index) => {
    setRatingValue(index + 1);
  };

  return (
    <div className='flex items-center gap-[15px]'>
      {Array.from({ length: 5 }, (_, index) => (
        <Image
          key={index}
          src={index < ratingValue ? "/assets/star_active.png" : "/assets/star.png"}
          alt=''
          width={40}
          height={40}
          onClick={() => handleStarClick(index)}
          className='cursor-pointer'
        />
      ))}
    </div>
  );
};

export default ChooseStarRating;
