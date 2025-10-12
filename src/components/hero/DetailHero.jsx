import Image from "next/image";
import Link from "next/link";

const DetailHero = ({ store }) => {
  return (
    <Link
      href={`/store/${store._id}`}
      className="relative block w-full h-[calc(100vh-225px)] overflow-hidden group rounded-b-3xl shadow-lg"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={store?.avatarImage?.url || "/assets/logo_app.png"}
          alt={store.name}
          fill
          className="object-cover opacity-0 animate-fadeIn group-hover:scale-105 transition-transform duration-700 ease-out"
        />
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent z-10"></div>

      {/* Content Overlay */}
      <div className="absolute left-6 bottom-10 md:left-10 md:bottom-16 px-4 flex flex-col items-start w-[85%] z-20 space-y-2">
        {/* Store Name */}
        <h1 className="text-white text-3xl md:text-4xl font-extrabold tracking-tight drop-shadow-lg leading-tight">
          {store.name}
        </h1>

        {/* Ratings + Categories */}
        <div
          className={`flex flex-wrap items-center mt-2 gap-2 ${
            store.amountRating !== 0 ? "text-white" : "text-gray-300"
          }`}
        >
          {/* Rating */}
          {store.avgRating !== 0 && (
            <div className="flex items-center gap-1 text-[#fc2111] bg-black/40 backdrop-blur-sm rounded-full px-2 py-1 text-sm font-medium">
              <Image
                src="/assets/star_active.png"
                alt="rating"
                width={16}
                height={16}
              />
              <span>{store.avgRating.toFixed(2)}</span>
              {store.amountRating !== 0 && (
                <span className="text-gray-200 text-xs ml-1">
                  ({store.amountRating})
                </span>
              )}
            </div>
          )}

          {/* Categories */}
          <div className="flex flex-wrap items-center gap-1">
            {store.storeCategory.slice(0, 3).map((category) => (
              <Link
                href={`/search?category=${category._id}`}
                key={category._id}
                className="bg-white/10 text-gray-200 hover:bg-[#fc2111]/80 hover:text-white transition-colors duration-300 text-xs md:text-sm font-medium px-2 py-1 rounded-full"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Description */}
        {store.description && (
          <p className="text-gray-200/90 text-sm md:text-base mt-2 max-w-2xl leading-relaxed line-clamp-2 drop-shadow-md">
            {store.description}
          </p>
        )}
      </div>

      {/* Bottom Blur for Depth */}
      <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-black/60 to-transparent pointer-events-none z-10"></div>
    </Link>
  );
};

export default DetailHero;
