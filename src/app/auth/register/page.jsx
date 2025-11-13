"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Header from "@/components/header/Header";
import Heading from "@/components/Heading";
import { authService } from "@/api/authService";

const RegisterPage = () => {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);

  const schema = yup.object().shape({
    name: yup.string().required("Vui lòng nhập tên!"),
    email: yup.string().email("Email không hợp lệ!").required("Vui lòng nhập Email!"),
    phonenumber: yup.string().required("Vui lòng nhập số điện thoại!"),
    gender: yup.string().required("Vui lòng chọn giới tính!"),
    password: yup.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự!").required("Vui lòng nhập mật khẩu!"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "Mật khẩu nhập lại không khớp!")
      .required("Vui lòng nhập lại mật khẩu!"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phonenumber: "",
      gender: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      try {
        await authService.register(values);
        // toast.success("Đăng ký thành công!");
        formik.resetForm();
        router.push("/auth/login");
      } catch (error) {
        // toast.error(error.response?.data?.message || "Đăng ký thất bại!");
      }
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 md:bg-gray-100 flex flex-col items-center">
      <Heading title="Đăng ký" />

      {/* Header for desktop */}
      <div className="hidden md:block w-full">
        <Header />
      </div>

<div className="bg-transparent w-full max-w-lg md:w-[500px] md:mt-12 rounded-xl p-6 md:p-10 mt-40"></div>
      {/* Card Container */}
      <div className="bg-white w-full max-w-lg md:w-[500px] md:mt-12 rounded-xl shadow-lg p-6 md:p-10 mt-40">
        <div className="flex flex-col items-center">
          <Image src="/assets/logo_app.jpg" alt="Logo" width={120} height={120} className="mb-4" />
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Tạo tài khoản mới</h2>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="flex flex-col">
            <input
              type="text"
              name="name"
              placeholder="Họ và tên"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`p-3 rounded-lg border ${
                formik.touched.name && formik.errors.name ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-orange-400`}
            />
            {formik.touched.name && formik.errors.name && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`p-3 rounded-lg border ${
                formik.touched.email && formik.errors.email ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-orange-400`}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
            )}
          </div>

          {/* Phone Number */}
          <div className="flex flex-col">
            <input
              type="text"
              name="phonenumber"
              placeholder="Số điện thoại"
              value={formik.values.phonenumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`p-3 rounded-lg border ${
                formik.touched.phonenumber && formik.errors.phonenumber ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-orange-400`}
            />
            {formik.touched.phonenumber && formik.errors.phonenumber && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.phonenumber}</p>
            )}
          </div>

          {/* Gender */}
          <div className="flex justify-between gap-4">
            {["female", "male", "other"].map((g) => (
              <label
                key={g}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border cursor-pointer ${
                  formik.values.gender === g ? "bg-orange-100 border-orange-400" : "border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="gender"
                  value={g}
                  checked={formik.values.gender === g}
                  onChange={formik.handleChange}
                  className="hidden"
                />
                {g === "female" ? "Nữ" : g === "male" ? "Nam" : "Khác"}
              </label>
            ))}
          </div>
          {formik.touched.gender && formik.errors.gender && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.gender}</p>
          )}

          {/* Password */}
          <div className="relative flex flex-col">
            <input
              type={showPass ? "text" : "password"}
              name="password"
              placeholder="Mật khẩu"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`p-3 rounded-lg border ${
                formik.touched.password && formik.errors.password ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-orange-400 pr-12`}
            />
            <div
              className="absolute top-3 right-3 cursor-pointer"
              onClick={() => setShowPass(!showPass)}
            >
              <Image
                src={showPass ? "/assets/eye_show.png" : "/assets/eye_hide.png"}
                alt="Toggle password"
                width={24}
                height={24}
              />
            </div>
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="relative flex flex-col">
            <input
              type={showPass ? "text" : "password"}
              name="confirmPassword"
              placeholder="Nhập lại mật khẩu"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`p-3 rounded-lg border ${
                formik.touched.confirmPassword && formik.errors.confirmPassword ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-orange-400 pr-12`}
            />
            <div
              className="absolute top-3 right-3 cursor-pointer"
              onClick={() => setShowPass(!showPass)}
            >
              <Image
                src={showPass ? "/assets/eye_show.png" : "/assets/eye_hide.png"}
                alt="Toggle password"
                width={24}
                height={24}
              />
            </div>
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.confirmPassword}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!(formik.isValid && formik.dirty)}
            className={`w-full py-3 rounded-lg text-white font-semibold ${
              formik.isValid && formik.dirty ? "bg-orange-500 hover:bg-orange-600" : "bg-orange-300 cursor-not-allowed"
            }`}
          >
            Đăng ký
          </button>
        </form>

        <p className="text-center text-gray-500 mt-4">
          Đã có tài khoản?{" "}
          <Link href="/auth/login" className="text-orange-500 font-semibold hover:underline">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
