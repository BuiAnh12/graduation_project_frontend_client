import Image from "next/image";
import Link from "next/link";

const DetailHero = ({ store }) => {
  return (
    <Link href={`/store/${store._id}`} className='relative block w-full h-[calc(100vh-225px)] overflow-hidden group'>
      {/* Ảnh nền */}
      <Image
        src={store.avatar.url || "/assets/logo_app.png"}
        alt={store.name}
        layout='fill'
        objectFit='cover'
        className='transition-transform duration-700 group-hover:scale-105'
      />

      {/* Overlay tối */}
      <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent z-10'></div>

      {/* Nội dung */}
      <div className='absolute left-6 bottom-10 md:left-10 md:bottom-16 px-4 flex flex-col items-start w-[85%] z-20'>
        {/* Tên cửa hàng */}
        <h4 className='text-white text-2xl md:text-3xl font-bold tracking-wide drop-shadow-lg'>{store.name}</h4>

        {/* Đánh giá và danh mục */}
        <div className={`flex flex-wrap items-center mt-2 ${store.amountRating !== 0 ? "gap-2" : ""}`}>
          {/* Rating */}
          {store.avgRating !== 0 && (
            <div className='flex items-center gap-1'>
              <Image src='/assets/star_active.png' alt='rating' width={20} height={20} />
              <span className='text-[#fc6011] font-semibold'>{store.avgRating.toFixed(2)}</span>
              {store.amountRating !== 0 && (
                <span className='text-gray-200 text-sm'>{`(${store.amountRating} đánh giá)`}</span>
              )}
            </div>
          )}

          {/* Dấu phân cách */}
          {store.amountRating !== 0 && <div className='w-[4px] h-[4px] rounded-full bg-[#fc6011]'></div>}

          {/* Danh mục */}
          <div className='flex flex-wrap items-center gap-1 text-sm md:text-base'>
            {store.storeCategory.slice(0, 3).map((category, index) => (
              <Link
                href={`/search?category=${category._id}`}
                className='text-gray-200 hover:text-[#fc6011] transition'
                key={category._id}
              >
                {category.name}
                {index !== store.storeCategory.length - 1 && ","}
              </Link>
            ))}
          </div>
        </div>

        {/* Mô tả */}
        {store.description && (
          <p className='text-gray-200 text-sm md:text-base mt-2 max-w-2xl line-clamp-2'>{store.description}</p>
        )}
      </div>
    </Link>
  );
};

export default DetailHero;
