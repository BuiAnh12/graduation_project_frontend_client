import Image from "next/image";

const StarRating = ({ ratingValue }) => {
  const stars = 5;
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: stars }).map((_, i) => (
        <Image
          key={i}
          src={i < ratingValue ? "/assets/star_active.png" : "/assets/star.png"}
          alt="star"
          width={18}
          height={18}
          className="transition-transform hover:scale-110"
        />
      ))}
    </div>
  );
};

export default StarRating;
