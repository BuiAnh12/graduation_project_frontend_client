"use client";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import * as yup from "yup";
import { useFormik } from "formik";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Header from "@/components/header/Header";
import Heading from "@/components/Heading";
import { useLocation } from "@/context/locationContext";
import { locationService } from "@/api/locationService";

const page = () => {
  const router = useRouter();
  const { location } = useLocation();
  const { type } = useParams();

  const schema = yup.object().shape({
    name: yup.string().required("Vui lòng nhập tên!"),
    address: yup.string().required("Vui lòng chọn địa chỉ!"),
    location: yup.object().shape({
      type: yup.string().oneOf(["Point"], "Loại location không hợp lệ").required("Vui lòng chọn địa chỉ!"),
      coordinates: yup
        .array()
        .of(yup.number())
        .length(2, "Vui lòng chọn địa chỉ!")
        .test("valid-coordinates", "Vui lòng chọn địa chỉ!", (val) => Array.isArray(val) && val[0] !== 200 && val[1] !== 200),
    }),
  });

  const formik = useFormik({
    initialValues: {
      name: type === "home" ? "Nhà" : type === "company" ? "Công ty" : "",
      address: location.address || "",
      location: { type: "Point", coordinates: [location?.lon ?? 200, location?.lat ?? 200] },
      detailAddress: "",
      note: "",
      contactName: "",
      contactPhonenumber: "",
      type: type,
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      try {
        await locationService.addLocation(values);
        // toast.success("Thêm địa chỉ thành công!");
        router.push("/account/location");
        formik.resetForm();
      } catch (error) {
        console.log(error);
      }
    },
  });

  const renderInput = (label, name, placeholder = "", readOnly = false) => (
    <div className="flex flex-col mb-4">
      <label className="text-sm md:text-xs text-gray-800 mb-1 flex items-center gap-1">
        {name !== "detailAddress" && <span className="text-red-500">*</span>}
        {label}
      </label>
      <input
        type="text"
        name={name}
        value={formik.values[name]}
        onChange={formik.handleChange(name)}
        onBlur={formik.handleBlur(name)}
        placeholder={placeholder}
        readOnly={readOnly}
        className="w-full px-4 py-3 border rounded-xl bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-300 transition"
      />
      {formik.touched[name] && formik.errors[name] && (
        <div className="text-red-500 text-sm mt-1">{formik.errors[name]}</div>
      )}
    </div>
  );

  return (
    <div className="pt-[85px] pb-[90px] md:pt-[75px] md:mt-5 bg-[#f9f9f9] min-h-screen">
      <Heading title="Thêm vào địa điểm" />
      <div className="hidden md:block">
        <Header page="account" />
      </div>

      <div className="lg:w-3/5 md:w-4/5 mx-auto bg-white rounded-2xl shadow-md p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link
            href="/account/location"
            className="relative w-8 h-8 cursor-pointer"
          >
            <Image src="/assets/arrow_left_long.png" alt="" layout="fill" objectFit="contain" />
          </Link>
          <h3 className="text-gray-800 text-2xl font-bold">Thêm vào địa điểm</h3>
        </div>

        <form onSubmit={formik.handleSubmit}>
          {renderInput("Tên", "name", "", type === "home" || type === "company")}
          
          <Link
            href={`/account/location/choose-location`}
            className="block mb-4"
          >
            {renderInput("Địa chỉ", "address", "", true)}
          </Link>

          {renderInput("Địa chỉ chi tiết", "detailAddress", "Vd: tên toàn nhà / địa điểm gần đó")}
          {renderInput("Ghi chú cho tài xế", "note", "Chỉ dẫn chi tiết địa điểm cho tài xế")}
          {renderInput("Tên người liên lạc", "contactName", "Nhập tên người nhận")}
          {renderInput("Số điện thoại liên lạc", "contactPhonenumber", "Nhập số điện thoại người nhận")}

          <div className="fixed bottom-0 left-0 right-0 bg-white px-6 py-4 shadow-md">
            <button
              type="submit"
              className="w-full rounded-xl bg-red-600 text-white py-4 text-lg font-semibold hover:bg-red-700 transition"
            >
              Lưu địa chỉ này
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default page;
