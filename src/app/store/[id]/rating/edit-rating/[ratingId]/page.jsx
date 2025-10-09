"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Dropzone from "react-dropzone";
import { useParams, useRouter } from "next/navigation";
import { FaXmark } from "react-icons/fa6";
import { toast } from "react-toastify";
import Header from "@/components/header/Header";
import ChooseStarRating from "@/components/rating/ChooseStarRating";
import Heading from "@/components/Heading";
import { uploadService } from "@/api/uploadService";
import { ratingService } from "@/api/ratingService";

const EditRatingPage = () => {
  const { id: storeId, ratingId } = useParams();
  const router = useRouter();

  const [ratingValue, setRatingValue] = useState(0);
  const [comment, setComment] = useState("");
  const [images, setImages] = useState([]);
  const [detailRating, setDetailRating] = useState(null);

  const getDetailRating = async () => {
    try {
      const response = await ratingService.getDetailRating(ratingId);
      setDetailRating(response);
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết đánh giá:", error);
    }
  };

  useEffect(() => {
    getDetailRating();
  }, []);

  useEffect(() => {
    if (detailRating) {
      setRatingValue(detailRating.ratingValue);
      setComment(detailRating.comment);
      setImages(detailRating.images);
    }
  }, [detailRating]);

  const handleUploadImage = async (data) => {
    try {
      const formData = new FormData();
      for (let i = 0; i < data.length; i++) {
        formData.append("file", data[i]);
      }

      const result = await uploadService.uploadImages(formData);
      setImages((prev) => [...prev, ...result]);
    } catch (error) {
      console.error("Lỗi tải ảnh:", error);
    }
  };

  const handleEditRating = async () => {
    if (ratingValue === 0) {
      toast.error("Vui lòng chọn số sao để tiếp tục!");
      return;
    }
    if (!comment.trim()) {
      toast.error("Vui lòng nhập đánh giá của bạn!");
      return;
    }

    try {
      const data = { ratingValue, comment, images };
      await ratingService.editStoreRating({ ratingId, data });
      toast.success("Chỉnh sửa đánh giá thành công!");
      router.push(`/store/${storeId}`);
    } catch (error) {
      toast.error(error.response.data.message);
      router.push(`/store/${storeId}`);
    }
  };

  return (
    <div className='px-4 md:pt-[110px] pb-[100px] bg-white'>
      <Heading title='Chỉnh sửa đánh giá' description='' keywords='' />
      <div className='hidden md:block'>
        <Header />
      </div>

      <div className='bg-white lg:w-[60%] md:w-[80%] md:mx-auto rounded-xl shadow-md p-4 md:p-6'>
        {/* Back Button */}
        <div className='flex items-center gap-4 pt-4 md:hidden'>
          <Image
            src='/assets/arrow_left.png'
            alt='Back'
            width={30}
            height={30}
            className='cursor-pointer hover:scale-110 transition-transform'
            onClick={() => router.back()}
          />
          <h3 className='flex-1 text-[#4A4B4D] text-2xl font-bold'>Đánh giá</h3>
        </div>

        {/* Store Avatar */}
        {detailRating?.store && (
          <div className='flex flex-col items-center mt-6'>
            <div className='relative w-32 h-32 rounded-xl overflow-hidden shadow-lg'>
              <Image src={detailRating.store.avatar.url || ""} alt='Store' fill className='object-cover' />
            </div>
          </div>
        )}

        {/* Title & Description */}
        <div className='text-center mt-6 space-y-2'>
          <span className='text-[#4A4B4D] text-2xl font-semibold'>Chỉnh sửa đánh giá bữa ăn</span>
          {detailRating && (
            <p className='text-gray-600 text-lg'>
              Bạn thấy món ăn từ <span className='font-bold text-[#fc6011]'>{detailRating.store.name}</span> như thế
              nào?
            </p>
          )}
        </div>

        {/* Star Rating */}
        <div className='flex items-center justify-center py-6'>
          <ChooseStarRating ratingValue={ratingValue} setRatingValue={setRatingValue} />
        </div>

        {/* Comment */}
        <div className='bg-[#f2f3f5] text-gray-700 p-4 rounded-lg shadow-inner'>
          <textarea
            placeholder='Vui lòng nhập đánh giá của bạn'
            className='bg-transparent w-full resize-none focus:outline-none text-base'
            rows={4}
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          ></textarea>
        </div>

        {/* Upload Image */}
        <div className='flex justify-end mt-4'>
          <Dropzone
            maxFiles={5}
            accept={{ "image/*": [] }}
            onDrop={(acceptedFiles) => handleUploadImage(acceptedFiles)}
          >
            {({ getRootProps, getInputProps }) => (
              <div {...getRootProps()} className='flex items-center gap-2 cursor-pointer'>
                <input {...getInputProps()} />
                <Image src='/assets/camera.png' alt='Upload' width={28} height={28} className='rounded-lg' />
                <span className='text-[#fc6011] font-medium hover:underline'>Thêm ảnh</span>
              </div>
            )}
          </Dropzone>
        </div>

        {/* Preview Images */}
        {images.length > 0 && (
          <div className='flex flex-wrap gap-4 mt-4'>
            {images.map((image, index) => (
              <div className='relative w-[120px] h-[120px] rounded-lg overflow-hidden shadow-md' key={index}>
                <Image loading='lazy' fill className='object-cover' src={image.url} alt={`Preview ${index}`} />
                <FaXmark
                  onClick={() => setImages((prev) => prev.filter((img) => img.url !== image.url))}
                  className='absolute top-2 right-2 text-xl text-white bg-black/50 p-1 rounded-full cursor-pointer hover:bg-black transition'
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className='fixed bottom-0 left-0 right-0 p-4 bg-white shadow-md'>
        {detailRating && (
          <button
            onClick={handleEditRating}
            className='w-full md:w-[80%] mx-auto block rounded-lg bg-[#fc6011] text-white py-3 text-lg font-semibold shadow-md hover:shadow-lg transition-transform hover:scale-105'
          >
            Chỉnh sửa đánh giá
          </button>
        )}
      </div>
    </div>
  );
};

export default EditRatingPage;
