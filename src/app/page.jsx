"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";

export default function Home() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    // Kiểm tra kích thước màn hình
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Thiết lập kích thước ban đầu và thêm event listener
    handleResize();
    window.addEventListener("resize", handleResize);

    // Nếu không phải mobile, điều hướng đến trang home
    if (window.innerWidth > 768 || user) {
      router.push("/home");
    }

    // Dọn dẹp sự kiện khi component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [router]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true);
    }, 3000);

    // Dọn dẹp timer nếu component bị unmount
    return () => clearTimeout(timer);
  }, []);

  if (!isMobile) {
    return null; // Không hiển thị nội dung trên desktop
  }

  return (
    <div className='relative h-screen w-full'>
      {!loading ? (
        <div className='relative h-screen w-full'>
          <Image src='/assets/splash_bg.png' alt='' layout='fill' objectFit='cover' />
          <Image
            src='/assets/logo_app.png'
            alt=''
            height={200}
            width={200}
            className='absolute top-[50%] right-[50%] translate-x-[50%] translate-y-[-50%]'
          />
        </div>
      ) : (
        <div className='relative h-screen w-full'>
          <div className='relative h-[50vh] w-[100%]'>
            <Image src='/assets/welcome_top_shape.png' alt='' layout='fill' objectFit='cover' />
            <Image
              src='/assets/logo_app.png'
              alt=''
              height={200}
              width={200}
              className='absolute top-[45%] right-[50%] translate-x-[50%] translate-y-[50%]'
            />
          </div>

          <div className='flex flex-col items-center justify-end h-[50vh] w-[100%] pt-[30px]'>
            <div className='text-[#636464] text-center my-[20px]'>
              <span>Discover the best foods from over 1,000</span> <br />
              <span>restaurants and fast delivery to your</span> <br />
              <span>doorstep</span>
            </div>

            <div className='flex flex-col items-center w-[100%]'>
              <Link
                href='/auth/login'
                className='bg-[#fc6011] text-[#fff] font-semibold text-center w-[90%] p-[20px] rounded-full my-[10px] cursor-pointer'
              >
                Đăng nhập
              </Link>

              <Link
                href='/auth/register'
                className='bg-[#fff] border border-[#fc6011] border-solid text-center text-[#fc6011] font-semibold w-[90%] p-[20px] rounded-full my-[10px] cursor-pointer'
              >
                Đăng ký tài khoản
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
