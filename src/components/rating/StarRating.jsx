import Image from "next/image";

const StarRating = ({ ratingValue }) => {
  const maxStars = 5;
  return (
    <div className='flex items-center gap-[4px]'>
      {Array.from({ length: maxStars }).map((_, index) => (
        <Image
          key={index}
          src={index < ratingValue ? "/assets/star_active.png" : "/assets/star.png"}
          alt='star'
          width={15}
          height={15}
        />
      ))}
    </div>
  );
};

export default StarRating;
