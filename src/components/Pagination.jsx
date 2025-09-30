import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

const Pagination = ({ page, limit, total }) => {
  page = Number(page);
  const router = useRouter();
  const totalPages = Math.ceil(total / limit);

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", Number(newPage));
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const getPageNumbers = () => {
    if (totalPages <= 9) return Array.from({ length: totalPages }, (_, i) => i + 1);

    if (page <= 4) return [1, 2, 3, 4, "...", totalPages];
    if (page >= totalPages - 3) return [1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];

    return [1, "...", page - 2, page - 1, page, page + 1, page + 2, "...", totalPages];
  };

  const pages = getPageNumbers();

  return (
    <div className='mt-5 w-full flex items-center justify-center'>
      {page > 1 && (
        <button
          className='pr-3 pl-2 py-2 mr-2 text-[#e0e0e0] border-[#e0e0e0] border-[1px] border-solid rounded-[6px] h-[40px]'
          onClick={() => handlePageChange(page - 1)}
        >
          <Image src='/assets/arrow_left.png' alt='Prev' width={16} height={16} />
        </button>
      )}

      {pages.map((p, index) => (
        <React.Fragment key={index}>
          {p === "..." ? (
            <span className='px-3 py-2 mr-2 text-[#4a4b4d]'>...</span>
          ) : (
            <button
              className={`px-3 py-2 mr-2 border-[#e0e0e0] border-[1px] border-solid rounded-[6px] h-[40px] ${
                p == page ? "bg-[#fc6011] text-[#fff]" : "bg-[#fff] text-[#4a4b4d]"
              }`}
              onClick={() => handlePageChange(p)}
            >
              {p}
            </button>
          )}
        </React.Fragment>
      ))}

      {page < totalPages && (
        <button
          className='pr-2 pl-3 py-2 mr-2 text-[#e0e0e0] border-[#e0e0e0] border-[1px] border-solid rounded-[6px] h-[40px]'
          onClick={() => handlePageChange(page + 1)}
        >
          <Image src='/assets/arrow_right.png' alt='Next' width={16} height={16} />
        </button>
      )}
    </div>
  );
};

export default Pagination;
