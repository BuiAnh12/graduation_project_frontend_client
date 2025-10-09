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
import { orderService } from "@/api/orderService";
import { ratingService } from "@/api/ratingService";
import { Atom } from "react-loading-indicators";

const Page = () => {
  const { id: storeId, orderId } = useParams();
  const router = useRouter();

  const [ratingValue, setRatingValue] = useState(0);
  const [comment, setComment] = useState("");
  const [uploadedFile, setUploadedFile] = useState([]);
  const [orderDetail, setOrderDetail] = useState(null);

  const getOrderDetail = async () => {
    try {
      const response = await orderService.getOrderDetail(orderId);
      setOrderDetail(response);
    } catch (error) {
      console.error(error);
      toast.error("Không thể tải thông tin đơn hàng!");
    }
  };

  useEffect(() => {
    getOrderDetail();
  }, []);

  const handleUploadImage = async (files) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("file", file));

    try {
      const result = await uploadService.uploadImages(formData);
      return result;
    } catch (error) {
      console.error("Lỗi khi tải ảnh:", error);
      return [];
    }
  };

  const handleAddRating = async () => {
    if (ratingValue === 0) {
      toast.error("Vui lòng chọn số sao để tiếp tục đánh giá!");
      return;
    }
    if (!comment.trim()) {
      toast.error("Vui lòng nhập đánh giá của bạn!");
      return;
    }

    try {
      const images = uploadedFile.length > 0 ? await handleUploadImage(uploadedFile) : [];
      const data = { storeId, orderId, ratingValue, comment, images };
      await ratingService.addStoreRating(data);
      toast.success("Đánh giá thành công!");
      router.push(`/store/${storeId}`);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Đã xảy ra lỗi khi gửi đánh giá.");
      router.push(`/store/${storeId}`);
    }
  };

  if (!orderDetail) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Atom color="#fc6011" size="medium" text="" textColor="" />
      </div>
    );
  }

  const store = orderDetail.data?.stores;
  const items = orderDetail.data?.items || [];

  return (
    <div className="px-4 md:pt-[110px] pb-[100px] bg-white">
      <Heading title="Thêm đánh giá" description="" keywords="" />
      <div className="hidden md:block">
        <Header />
      </div>

      <div className="bg-white lg:w-[60%] md:w-[80%] md:mx-auto rounded-xl shadow-md p-4 md:p-6">
        {/* Back Button */}
        <div className="flex items-center gap-4 pt-4 md:hidden">
          <Image
            src="/assets/arrow_left.png"
            alt=""
            width={30}
            height={30}
            className="cursor-pointer hover:scale-110 transition-transform"
            onClick={() => router.back()}
          />
          <h3 className="flex-1 text-[#4A4B4D] text-2xl font-bold">Đánh giá</h3>
        </div>

        {/* Store Avatar */}
        <div className="flex flex-col items-center mt-6">
          <div className="relative w-32 h-32 rounded-xl overflow-hidden shadow-lg">
            <Image
              src={
                store?.avatarImage?.url ||
                "/assets/default-store.png"
              }
              alt={store?.name || ""}
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Store Name & Ordered Dishes */}
        <div className="text-center mt-6 space-y-2">
          <span className="text-[#4A4B4D] text-2xl font-semibold">
            Đánh giá bữa ăn này
          </span>
          <p className="text-gray-600 text-lg">
            Bạn thấy món ăn từ{" "}
            <span className="font-bold text-[#fc6011]">{store?.name}</span> như
            thế nào?
          </p>
          <p className="text-gray-600 text-base">
            Đã đặt:{" "}
            {items.map((item, index) => (
              <span key={index}>
                {item.dishName}
                {index < items.length - 1 ? ", " : ""}
              </span>
            ))}
          </p>
        </div>

        {/* Rating */}
        <div className="flex items-center justify-center py-6">
          <ChooseStarRating
            ratingValue={ratingValue}
            setRatingValue={setRatingValue}
          />
        </div>

        {/* Comment */}
        <div className="bg-[#f2f3f5] text-gray-700 p-4 rounded-lg shadow-inner">
          <textarea
            placeholder="Vui lòng nhập đánh giá của bạn"
            className="bg-transparent w-full resize-none focus:outline-none text-base"
            rows={4}
            onChange={(e) => setComment(e.target.value)}
          ></textarea>
        </div>

        {/* Upload Image */}
        <div className="flex justify-end mt-4">
          <Dropzone
            maxFiles={5}
            accept={{ "image/*": [] }}
            onDrop={(acceptedFiles) =>
              setUploadedFile([...uploadedFile, ...acceptedFiles])
            }
          >
            {({ getRootProps, getInputProps }) => (
              <div
                {...getRootProps()}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input {...getInputProps()} />
                <Image
                  src="/assets/camera.png"
                  alt=""
                  width={28}
                  height={28}
                  className="rounded-lg"
                />
                <span className="text-[#fc6011] font-medium hover:underline">
                  Thêm ảnh
                </span>
              </div>
            )}
          </Dropzone>
        </div>

        {/* Preview Images */}
        {uploadedFile.length > 0 && (
          <div className="flex flex-wrap gap-4 mt-4">
            {uploadedFile
              .map((file) =>
                Object.assign(file, { preview: URL.createObjectURL(file) })
              )
              .map((file, index) => (
                <div
                  className="relative w-[120px] h-[120px] rounded-lg overflow-hidden shadow-md"
                  key={file.name}
                >
                  <Image
                    loading="lazy"
                    fill
                    className="object-cover"
                    src={file.preview}
                    alt=""
                    onLoad={() => URL.revokeObjectURL(file.preview)}
                  />
                  <FaXmark
                    onClick={() =>
                      setUploadedFile((prev) =>
                        prev.filter((_, i) => i !== index)
                      )
                    }
                    className="absolute top-2 right-2 text-xl text-white bg-black/50 p-1 rounded-full cursor-pointer hover:bg-black transition"
                  />
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white shadow-md">
        <button
          onClick={handleAddRating}
          name="submitBtn"
          className="w-full md:w-[80%] mx-auto block rounded-lg bg-[#fc6011] text-white py-3 text-lg font-semibold shadow-md hover:shadow-lg transition-transform hover:scale-105"
        >
          Gửi đánh giá
        </button>
      </div>
    </div>
  );
};

export default Page;
