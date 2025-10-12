"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Header from "@/components/header/Header";
import Heading from "@/components/Heading";
import { authService } from "@/api/authService";
import { useForgotPassEmail } from "@/context/forgotPassEmailContext";

const page = () => {
  const router = useRouter();

  const { email } = useForgotPassEmail();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(120);

  useEffect(() => {
    if (email.length === 0) {
      router.push("/auth/forgot-password");
    }
  }, [email]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [countdown]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/[^0-9]/.test(value)) return; // Chỉ chấp nhận số

    const newOtp = [...otp];
    newOtp[index] = value; // Cập nhật giá trị OTP tại vị trí index
    setOtp(newOtp);

    // Tự động chuyển sang ô tiếp theo nếu có giá trị
    if (value && index < otp.length - 1) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      // Quay lại ô trước nếu ô hiện tại không có giá trị và người dùng nhấn Backspace
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = async () => {
    const otpValue = otp.join(""); // Chuyển mảng OTP thành chuỗi
    if (otpValue.length < 6) {
      toast.error("Vui lòng nhập đủ 6 số OTP!");
      return;
    }

    try {
      await authService.checkOTP({ email, otp: otpValue });
      toast.success("Xác thực OTP thành công!");
      router.push("/auth/reset-password");
    } catch (error) {
      toast.error(error?.data?.message || "Có lỗi xảy ra!");
    }
  };

  return (
    <div className='bg-[#fff] md:bg-[#f9f9f9] md:pt-[110px]' name='forgot_password_page'>
      <Heading title='Xác nhận OTP' description='' keywords='' />
      <div className='hidden md:block'>
        <Header />
      </div>
      <div className='bg-[#fff] lg:w-[60%] md:w-[90%] md:mx-auto md:border md:border-[#a3a3a3a3] md:border-solid md:rounded-[10px] md:shadow-[rgba(0,0,0,0.24)_0px_3px_8px] md:overflow-hidden'>
        <div className='flex flex-col items-center py-[30px] h-screen'>
          <h3 className='text-[#4A4B4D] text-[30px] font-bold pb-[20px]'>Nhập mã OTP</h3>
          <Image src='/assets/logo_app.png' alt='' height={150} width={150} className='mb-[10px]' />

          <span className='text-[#4A4B4D] text-[30px] font-bold cursor-not-allowed'>{formatTime(countdown)}</span>

          <div className='text-[#636464] text-center my-[20px]'>
            <span>Vui lòng kiểm tra email {email}</span> <br />
            <span>để tiếp tục lấy lại mật khẩu</span> <br />
          </div>

          {/* Form nhập OTP */}
          <div className='flex space-x-3 md:space-x-8 my-4'>
            {otp.map((_, index) => (
              <input
                key={index}
                id={`otp-input-${index}`}
                type='text'
                maxLength={1}
                value={otp[index]}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                placeholder='*'
                className='w-[50px] h-[50px] text-center text-xl border-2 border-[#7a7a7a] border-solid rounded-lg bg-[#f5f5f5] text-[#636464]'
              />
            ))}
          </div>

          <button
            name='submitBtn'
            onClick={handleSubmit}
            disabled={otp.join("").length < 6}
            className={`text-center text-[#fff] font-semibold w-[70%] md:w-[60%] lg:w-[75%] p-[20px] rounded-full my-[10px] shadow-md hover:shadow-lg ${
              otp.join("").length === 6 ? "bg-[#fc6011] cursor-pointer" : "bg-[#f5854d] cursor-not-allowed"
            }`}
          >
            Tiếp
          </button>

          <p className='text-[#636464] font-semibold mt-[20px]'>
            Không nhận được mã?{" "}
            <span
              onClick={async () => {
                try {
                  await authService.forgotPassword({ email });

                  toast.success("Gửi thành công!");
                  router.push("/auth/confirm-otp");
                  setOtp(["", "", "", "", "", ""]);
                  setCountdown(120);
                } catch (error) {
                  toast.error(error?.data?.message || "Có lỗi xảy ra!");
                }
              }}
              className='text-[#fc6011] cursor-pointer'
            >
              Nhấn vào đây
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default page;
