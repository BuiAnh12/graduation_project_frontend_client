"use client";
import Image from "next/image";
import React, { useState } from "react";
import moment from "moment";
import StarRating from "./StarRating.jsx";
import { toast } from "react-toastify";
import Link from "next/link";
import Swal from "sweetalert2";
import { ratingService } from "@/api/ratingService";

const RatingItem = ({ rating, userId, refetchAllStoreRating, refetchPaginationRating, refetchAllStoreRatingDesc }) => {
  const [showOptionBox, setShowOptionBox] = useState(false);

  const handleDeleteRating = async () => {
    try {
      await ratingService.deleteStoreRating(rating?._id);
      refetchAllStoreRating();
      refetchPaginationRating();
      refetchAllStoreRatingDesc();
      toast.success("Xóa đánh giá thành công");
    } catch (error) {
      toast.error(error?.data?.message || "Có lỗi xảy ra!");
    }
  };

  const confirmDeleteRating = async () => {
    const result = await Swal.fire({
      title: "Bạn có chắc chắn muốn xóa đánh giá này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      await handleDeleteRating();
    }
  };

  return (
    <div className='my-[15px]'>
      <div className='relative'>
        <div className='flex items-center gap-[10px]'>
          <div className='relative w-[65px] h-[65px] pt-[65px] rounded-full overflow-hidden'>
            <Image layout='fill' src={rating.user.avatar.url} alt='' objectFit='cover' />
          </div>

          <div className='flex flex-1 items-center justify-between'>
            <div className='flex flex-col flex-start h-full'>
              <h4 className='text-[#4A4B4D] text-[24px] font-semibold md:text-[20px]'>{rating.user.name}</h4>
              <div className='flex items-center gap-[8px]'>
                <StarRating ratingValue={rating.ratingValue} />
                <div className='w-[4px] h-[4px] rounded-full bg-[#636464]'></div>
                <span className='text-[#636464]'>{moment.utc(rating?.createdAt).local().fromNow()}</span>
              </div>
            </div>

            {userId && rating.user?._id === userId && (
              <Image
                src='/assets/dots.png'
                className='cursor-pointer'
                alt=''
                width={30}
                height={30}
                onClick={() => {
                  setShowOptionBox(!showOptionBox);
                }}
              />
            )}
            {showOptionBox && (
              <div className='absolute top-[0px] right-[35px] p-[10px] border border-[#a3a3a3a3] border-solid rounded-[6px] w-[150px] flex flex-col bg-white'>
                <Link
                  href={`/store/${rating.storeId}/rating/edit-rating/${rating?._id}`}
                  className='text-[#4A4B4D] font-medium p-[6px] w-full rounded-[4px] hover:bg-[#00000011] cursor-pointer'
                >
                  Chỉnh sửa
                </Link>
                <span
                  onClick={confirmDeleteRating}
                  className='text-[#4A4B4D] font-medium p-[6px] w-full rounded-[4px] hover:bg-[#00000011] cursor-pointer'
                >
                  Xóa
                </span>
              </div>
            )}
          </div>
        </div>

        {rating.images.length > 0 && (
          <div className='flex flex-row gap-[10px] mt-[10px]'>
            {rating.images.map((img) => (
              <div className='relative flex flex-col gap-[4px] w-[150px] pt-[150px]' key={img.filePath}>
                <Image src={img.url} alt='' layout='fill' objectFit='cover' className='rounded-[6px] justify-center' />
              </div>
            ))}
          </div>
        )}

        <p className='text-[#000] text-[18px] md:text-[16px] mt-[10px]'>{rating.comment}</p>
        {rating.order && rating.order.items.length > 0 && (
          <p className='text-[#636464] pb-[10px] pt-[6px] md:text-[14px] overflow-hidden text-ellipsis whitespace-nowrap'>
            Đã đặt:{" "}
            {rating.order.items.map((dish, index) => (
              <span key={index}>
                {dish.dishName}
                {index < rating.order.items.length - 1 ? ", " : ""}
              </span>
            ))}
          </p>
        )}
      </div>

      {rating.storeReply && (
        <div className='px-[20px] py-[15px] bg-[#e6e6e6] rounded-[8px]'>
          <div className='flex items-center justify-between'>
            <p className='text-[#000] font-bold md:text-[14px]'>Phản hồi từ quán</p>
            {/* <p className='text-[#636464] text-[15px] md:text-[13px]'>6 ngày trước</p> */}
          </div>
          <p className='text-[#636464] md:text-[14px]'>{rating.storeReply}</p>
        </div>
      )}
    </div>
  );
};

export default RatingItem;
