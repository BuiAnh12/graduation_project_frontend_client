"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import * as yup from "yup";
import { useFormik } from "formik";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Header from "@/components/header/Header";
import { useLocation } from "@/context/locationContext";
import Heading from "@/components/Heading";
import { locationService } from "@/api/locationService";

const page = () => {
  const router = useRouter();
  const { location, setLocation } = useLocation();
  const { type, id } = useParams();
  const [locationData, setLocationData] = useState(null);

  // Fetch location detail
  const getLocationData = async () => {
    try {
      const response = await locationService.getLocationDetail(id);
      setLocationData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getLocationData();
  }, [id]);

  // Sync location context when locationData loads
  useEffect(() => {
    if (locationData && location.lat === 200) {
      setLocation({
        address: locationData.address,
        lat: locationData?.location?.coordinates[1],
        lon: locationData?.location?.coordinates[0],
      });
    }
  }, [locationData, location.lat, setLocation]);

  const schema = yup.object().shape({
    name: yup.string().required("Vui lòng nhập tên!"),
    address: yup.string().required("Vui lòng chọn địa chỉ!"),
    location: yup.object().shape({
      type: yup.string().oneOf(["Point"]).required("Vui lòng chọn địa chỉ!"),
      coordinates: yup
        .array()
        .of(yup.number())
        .length(2, "Vui lòng chọn địa chỉ!")
        .test("valid-coordinates", "Vui lòng chọn địa chỉ!", (val) => Array.isArray(val) && val[0] !== 200 && val[1] !== 200),
    }),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: type === "home" ? "Nhà" : type === "company" ? "Công ty" : locationData?.name || "",
      address: locationData?.address || location.address || "",
      location: {
        type: "Point",
        coordinates: [
          locationData?.location?.coordinates[0] ?? location.lon ?? 200,
          locationData?.location?.coordinates[1] ?? location.lat ?? 200,
        ],
      },
      detailAddress: locationData?.detailAddress || "",
      note: locationData?.note || "",
      contactName: locationData?.contactName || "",
      contactPhonenumber: locationData?.contactPhonenumber || "",
      type,
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      try {
        await locationService.updateLocation({ id, data: values });
        toast.success("Cập nhật địa chỉ thành công!");
        router.push("/account/location");
      } catch (error) {
        console.error(error);
        toast.error("Cập nhật thất bại!");
      }
    },
  });

  // Sync formik values when location context changes
  useEffect(() => {
    if (location) {
      formik.setValues((prev) => ({
        ...prev,
        address: location.address,
        location: {
          ...prev.location,
          coordinates: [location.lon, location.lat],
        },
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const renderInput = (label, name, placeholder = "", readOnly = false) => (
    <div className="flex flex-col mb-4 relative">
      <label className="absolute top-2 left-2 text-sm md:text-xs text-gray-800 flex items-center gap-1">
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
        className="w-full px-4 pt-7 pb-3 border-b border-gray-300 text-gray-700 focus:outline-none focus:ring-1 focus:ring-red-400 bg-transparent"
      />
      {formik.touched[name] && formik.errors[name] && (
        <div className="text-red-500 text-sm mt-1">{formik.errors[name]}</div>
      )}
    </div>
  );

  return (
    <div className="pt-[85px] pb-[90px] md:pt-[75px] md:mt-5 bg-[#f9f9f9] min-h-screen">
      <Heading title="Chỉnh sửa địa điểm" />
      <div className="hidden md:block">
        <Header page="account" />
      </div>

      <div className="lg:w-3/5 md:w-4/5 mx-auto bg-white rounded-2xl shadow-md p-6">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/account/location" className="relative w-8 h-8">
            <Image src="/assets/arrow_left_long.png" alt="" layout="fill" objectFit="contain" />
          </Link>
          <h3 className="text-gray-800 text-2xl font-bold">Chỉnh sửa địa điểm</h3>
        </div>

        <form onSubmit={formik.handleSubmit}>
          {renderInput("Tên", "name", "", type === "home" || type === "company")}
          <Link href="/account/location/choose-location" className="block mb-4 cursor-pointer">
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
