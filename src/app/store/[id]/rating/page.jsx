"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Heading from "@/components/Heading";
import RatingBar from "@/components/rating/RatingBar";
import RatingItem from "@/components/rating/RatingItem";
import { useAuth } from "@/context/authContext";
import { ratingService } from "@/api/ratingService";

const page = () => {
  const { id: storeId } = useParams();

  const [ratings, setRatings] = useState(0);
  const [allStoreRating, setAllStoreRating] = useState(null);

  const { user } = useAuth();

  const getAllStoreRating = async () => {
    try {
      const response = await ratingService.getAllStoreRating({
        storeId,
        sort: "",
        limit: "10",
        page: "1",
      });
      setAllStoreRating(response);
    } catch (error) {}
  };

  useEffect(() => {
    getAllStoreRating();
  }, [storeId]);

  useEffect(() => {
    if (allStoreRating) {
      const allRatings = allStoreRating.data.reduce(
        (acc, item) => {
          acc[item.ratingValue] = (acc[item.ratingValue] || 0) + 1;
          return acc;
        },
        { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      );

      setRatings(allRatings);
    }
  }, [allStoreRating]);

  return (
    <div>
      <Heading title='Nhận xét' description='' keywords='' />
      <div className='flex items-center gap-[30px] px-[20px] pt-[20px]'>
        <Link href={`/store/${storeId}`}>
          <Image src='/assets/arrow_left.png' alt='' width={30} height={30} />
        </Link>
        <h3 className='text-[#4A4B4D] text-[28px] font-bold'>Đánh giá và nhận xét</h3>
      </div>

      {ratings && <RatingBar ratings={ratings} /> }

      <div className='p-[20px]'>
        {allStoreRating &&
          allStoreRating.data.map((rating) => (
            <RatingItem key={rating._id} rating={rating} currentUser={user} refetchAllStoreRating={getAllStoreRating} />
          ))}
      </div>
    </div>
  );
};

export default page;
