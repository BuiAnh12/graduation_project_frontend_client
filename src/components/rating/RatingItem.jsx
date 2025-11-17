"use client";
import Image from "next/image";
import React, { useState } from "react";
import moment from "moment";
import StarRating from "./StarRating.jsx";
import { toast } from "react-toastify";
import Link from "next/link";
import Swal from "sweetalert2";
import { ratingService } from "@/api/ratingService";

const RatingItem = ({
  rating,
  userId,
  refetchAllStoreRating,
  refetchPaginationRating,
  refetchAllStoreRatingDesc,
}) => {
  const [showOptionBox, setShowOptionBox] = useState(false);

  const handleDeleteRating = async () => {
    try {
      await ratingService.deleteStoreRating(rating?._id);
      refetchAllStoreRating();
      refetchPaginationRating();
      refetchAllStoreRatingDesc();
      // toast.success("Xóa đánh giá thành công");
    } catch (error) {
      // toast.error(error?.data?.message || "Có lỗi xảy ra!");
    }
  };

  const confirmDeleteRating = async () => {
    const result = await Swal.fire({
      title: "Bạn có chắc chắn muốn xóa đánh giá này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy",
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
    });

    if (result.isConfirmed) {
      await handleDeleteRating();
    }
  };

  return (
    <div className="my-6">
      <div className="relative bg-white rounded-2xl p-6 shadow-smooth transition-all duration-300 hover:shadow-[0_8px_30px_rgba(239,68,68,0.2)]">
        {/* User info */}
        <div className="flex items-center gap-4">
          <div className="relative w-[60px] h-[60px] rounded-full overflow-hidden border-2 border-primary shadow-sm">
            <Image
              src={rating?.users?.avatarImage?.url||
                "/assets/avatar_default.png"}
              alt="avatar" 
              fill
              className="object-cover"
            />
          </div>

          <div className="flex flex-1 items-center justify-between">
            <div className="flex flex-col justify-center">
              <h4 className="text-text-primary text-xl font-semibold leading-tight">
                {rating?.users?.name}
              </h4>

              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <StarRating ratingValue={rating.ratingValue} />
                <div className="w-[4px] h-[4px] rounded-full bg-gray-400"></div>
                <span>{moment.utc(rating?.createdAt).local().fromNow()}</span>
              </div>
            </div>

            {/* Option menu */}
            {userId && rating.user?._id === userId && (
              <div className="relative">
                <Image
                  src="/assets/dots.png"
                  alt="menu"
                  width={28}
                  height={28}
                  className="cursor-pointer opacity-70 hover:opacity-100 transition"
                  onClick={() => setShowOptionBox(!showOptionBox)}
                />

                {showOptionBox && (
                  <div className="absolute top-8 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-20 w-36">
                    <Link
                      href={`/store/${rating.storeId}/rating/edit-rating/${rating?._id}`}
                      className="block px-4 py-2 text-sm hover:bg-primary-light hover:text-white rounded-t-lg"
                    >
                      ✏️ Chỉnh sửa
                    </Link>
                    <button
                      onClick={confirmDeleteRating}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-b-lg"
                    >
                      🗑 Xóa
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Images */}
        {rating?.images?.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-4">
            {rating.images.map((img) => (
              <div
                key={img.filePath}
                className="relative w-[120px] h-[120px] rounded-xl overflow-hidden group"
              >
                <Image
                  src={img.url}
                  alt=""
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
            ))}
          </div>
        )}

        {/* Comment */}
        <p className="text-text-primary text-base mt-4">{rating.comment}</p>

        {/* Ordered items */}
        {rating.order && rating.order.items.length > 0 && (
          <p className="text-text-secondary text-sm mt-1 italic">
            Đã đặt:{" "}
            {rating.order.items
              .map((dish) => dish.dishName)
              .join(", ")}
          </p>
        )}
      </div>

      {/* Store reply */}
      {rating.storeReply && (
        <div className="mt-3 bg-gradient-to-r from-primary to-accent text-white p-4 rounded-xl">
          <p className="font-semibold mb-1">💬 Phản hồi từ quán</p>
          <p className="opacity-90 text-sm">{rating.storeReply}</p>
        </div>
      )}
    </div>
  );
};

export default RatingItem;
