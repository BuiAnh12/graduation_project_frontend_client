"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Dropzone from "react-dropzone";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useFormik } from "formik";
import Header from "@/components/header/Header";
import Heading from "@/components/Heading";
import NavBar from "@/components/header/NavBar";
import { useSocket } from "@/context/socketContext";
import { useAuth } from "@/context/authContext";
import { uploadService } from "@/api/uploadService";
import { userService } from "@/api/userService";
import UserReferenceEditor from "@/components/profile/UserReferenceEditor"
const page = () => {
  const { notifications } = useSocket();

  const [avatarFile, setAvatarFile] = useState(null);

  const { user, fetchUser } = useAuth();

  const handleUploadAvatar = async () => {
    if (avatarFile) {
      try {
        const formData = new FormData();
        for (let i = 0; i < avatarFile?.length; i++) {
          formData.append("file", avatarFile[i]);
        }
        await uploadService.uploadAvatar(formData);
        setAvatarFile(null);

        await fetchUser(user?._id);
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    if (avatarFile) {
      handleUploadAvatar();
    }
  }, [avatarFile]);

  const schema = yup.object().shape({
    name: yup.string().required("Vui lòng nhập tên!"),
    email: yup.string().email("Email không hợp lệ!").required("Vui lòng nhập Email!"),
    phonenumber: yup.string().required("Vui lòng nhập số điện thoại!"),
    gender: yup.string().required("Vui lòng chọn giới tính!"),
  });

  const formik = useFormik({
    initialValues: {
      name: user?.name || "",
      email: user?.email || "",
      phonenumber: user?.phonenumber || "",
      gender: user?.gender || "",
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      try {
        await userService.updateUser(values);
        // toast.success("Cập nhật thành công!");
        await fetchUser(user?._id);
      } catch (error) {
        console.error(error);
      }
    },
  });

  return (
    <div className="pt-[30px] pb-[100px] px-[20px] md:pt-[75px] md:mt-[20px] md:px-0 bg-[#fff] md:bg-[#f9f9f9] min-h-screen">
      <Heading title="Thông tin cá nhân" description="" keywords="" />

      {/* Header */}
      <div className="hidden md:block">
        <Header page="account" />
      </div>

      {/* Mobile header */}
      <div className="flex items-center justify-between md:hidden">
        <h3 className="text-[#222] text-[26px] font-bold">Thông tin cá nhân</h3>
        <Link
          href="/notifications"
          className="relative w-[30px] pt-[30px] md:w-[25px] md:pt-[25px]"
        >
          <Image src="/assets/notification.png" alt="noti" layout="fill" objectFit="contain" />
          {notifications.filter((n) => n.status === "unread").length > 0 && (
            <div className="absolute top-[-6px] right-[-6px] w-[21px] h-[21px] text-center rounded-full bg-[#e50914] border border-white flex items-center justify-center">
              <span className="text-[11px] text-white font-medium">
                {notifications.filter((n) => n.status === "unread").length}
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* Card */}
      <div className="bg-white lg:w-[60%] md:w-[80%] md:mx-auto md:border md:border-gray-200 md:rounded-[14px] md:shadow-[0_4px_15px_rgba(0,0,0,0.1)] md:p-[30px] mt-[15px]">
        {/* Avatar section */}
        <div className="flex flex-col items-center">
          <div className="relative w-[110px] h-[110px] mt-[20px]">
            <Image
              src={
                user?.avatarImage?.url ||
                "/assets/avatar_default.png"
              }
              alt="avatar"
              fill
              className="rounded-full object-cover border-4 border-[#e50914]/10 shadow-md"
            />
            <Dropzone
              maxFiles={1}
              accept={{ "image/*": [] }}
              onDrop={(acceptedFiles) =>
                setAvatarFile(
                  acceptedFiles.map((file) =>
                    Object.assign(file, {
                      preview: URL.createObjectURL(file),
                    })
                  )
                )
              }
            >
              {({ getRootProps, getInputProps }) => (
                <section className="w-full">
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <Image
                      src="/assets/camera.png"
                      alt="camera"
                      width={40}
                      height={40}
                      className="absolute bottom-[-4px] right-[-4px] object-contain p-[6px] rounded-full bg-white border shadow-sm cursor-pointer hover:scale-[1.05] transition"
                    />
                  </div>
                </section>
              )}
            </Dropzone>
          </div>
          <div className="py-[10px]">
            <span className="text-[#e50914] text-[14px] font-bold uppercase tracking-wide">
              Chỉnh sửa thông tin
            </span>
          </div>
          <h3 className="text-[#222] text-[24px] font-bold pb-[10px] text-center">
            Xin chào {user?.name}
          </h3>
        </div>

        {/* Form */}
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-[18px] mt-[10px]">
          {/* Name */}
          <InputField
            label="Họ và tên"
            name="name"
            placeholder="Nhập tên"
            formik={formik}
          />
          {formik.touched.name && formik.errors.name && (
            <p className="text-red-500 text-sm">{formik.errors.name}</p>
          )}

          {/* Email */}
          <InputField
            label="Email"
            name="email"
            placeholder="Nhập email của bạn"
            formik={formik}
            disabled
          />

          {/* Phone */}
          <InputField
            label="Số điện thoại"
            name="phonenumber"
            placeholder="Nhập số điện thoại"
            formik={formik}
          />
          {formik.touched.phonenumber && formik.errors.phonenumber && (
            <p className="text-red-500 text-sm">{formik.errors.phonenumber}</p>
          )}

          {/* Gender */}
          <div className="mt-1">
            <label className="block text-[14px] text-gray-600 mb-1">Giới tính</label>
            <div className="flex gap-3">
              {["female", "male", "other"].map((g) => (
                <label
                  key={g}
                  className={`flex items-center justify-center flex-1 py-[12px] rounded-lg border text-[15px] font-medium cursor-pointer transition ${
                    formik.values.gender === g
                      ? "border-[#e50914] bg-[#e50914]/10 text-[#e50914]"
                      : "border-gray-300 text-gray-600 hover:border-[#e50914]/50"
                  }`}
                >
                  {g === "female" ? "Nữ" : g === "male" ? "Nam" : "Khác"}
                  <input
                    type="radio"
                    name="gender"
                    value={g}
                    onChange={formik.handleChange}
                    checked={formik.values.gender === g}
                    className="hidden"
                  />
                </label>
              ))}
            </div>
            {formik.touched.gender && formik.errors.gender && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.gender}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!(formik.isValid && formik.dirty)}
            className={`mt-4 text-center font-semibold w-full py-[14px] rounded-full shadow-md transition-all ${
              formik.isValid && formik.dirty
                ? "bg-gradient-to-r from-[#e50914] to-[#ff4040] text-white hover:shadow-lg active:scale-[0.98]"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Lưu thay đổi
          </button>
        </form>
        <UserReferenceEditor/>
      </div>

      {/* Bottom navbar */}
      <div className="block md:hidden">
        <NavBar page="account" />
      </div>
    </div>
  );
};

export default page;

const InputField = ({ label, name, placeholder, formik, disabled = false }) => (
  <div className="relative flex flex-col">
    <label
      htmlFor={name}
      className="absolute top-[10px] left-[20px] text-[13px] text-gray-500 pointer-events-none"
    >
      {label}
    </label>
    <input
      id={name}
      name={name}
      type="text"
      disabled={disabled}
      onChange={formik.handleChange(name)}
      onBlur={formik.handleBlur(name)}
      placeholder={placeholder}
      value={formik.values[name]}
      className={`bg-[#f5f5f5] text-[17px] w-full px-[20px] pt-[28px] pb-[12px] rounded-[10px] focus:ring-2 focus:ring-[#e50914]/30 focus:outline-none transition ${
        disabled ? "opacity-70 cursor-not-allowed" : ""
      }`}
    />
  </div>
);