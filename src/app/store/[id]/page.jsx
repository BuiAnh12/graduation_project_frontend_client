"use client";
import Image from "next/image";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import Pagination from "@/components/Pagination";
import { useCart } from "@/context/cartContext";
import { useFavorite } from "@/context/favoriteContext";
import ListDish from "@/components/dish/ListDish";
import Header from "@/components/header/Header";
import Heading from "@/components/Heading";
import ListDishBig from "@/components/dish/ListDishBig";
import RatingItem from "@/components/rating/RatingItem";
import RatingBar from "@/components/rating/RatingBar";
import MostRatingSlider from "@/components/rating/MostRatingSlider";
import { useSocket } from "@/context/socketContext";
import { React, useEffect, useState } from "react";
import { storeService } from "@/api/storeService";
import { dishService } from "@/api/dishService";
import { favoriteService } from "@/api/favoriteService";
import { ratingService } from "@/api/ratingService";
import { toast } from "react-toastify";
import { useAuth } from "@/context/authContext";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { ThreeDot } from "react-loading-indicators";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
});

const homeIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/128/1689/1689246.png",
    iconSize: [40, 40],
});

const page = () => {
    const { id: storeId } = useParams();
    const searchParams = useSearchParams();

    const [storeInfo, setStoreInfo] = useState(null);
    const [allDish, setAllDish] = useState(null);
    const [storeCart, setStoreCart] = useState(null);
    const [storeFavorite, setStoreFavorite] = useState(null);
    const [cartPrice, setCartPrice] = useState(0);
    const [cartQuantity, setCartQuantity] = useState(0);
    const [ratings, setRatings] = useState(0);
    const [allStoreRating, setAllStoreRating] = useState(null);
    const [paginationRating, setPaginationRating] = useState(null);
    const [allStoreRatingDesc, setAllStoreRatingDesc] = useState(null);
    const [storeLoading, setStoreLoading] = useState(true);

    const { notifications } = useSocket();
    const { cart } = useCart();
    const { favorite, refreshFavorite } = useFavorite();
    const { user } = useAuth();

    const getStoreInfo = async () => {
        try {
            const response = await storeService.getStoreInformation(storeId);
            setStoreInfo(response.data);
            setStoreLoading(false);
        } catch (error) {
            setStoreLoading(false);
        }
    };

    const getAllDish = async () => {
        try {
            const response = await dishService.getAllDish(storeId);
            setAllDish(response.data);
        } catch (error) {}
    };

    const getAllStoreRating = async () => {
        try {
            const response = await ratingService.getAllStoreRating({
                storeId,
                sort: "",
                limit: "",
                page: "",
            });
            setAllStoreRating(response.data);
        } catch (error) {}
    };

    const getPaginationRating = async () => {
        try {
            const response = await ratingService.getAllStoreRating({
                storeId,
                sort: "",
                limit,
                page,
            });
            setPaginationRating(response.data);
        } catch (error) {}
    };

    const getAllStoreRatingDesc = async () => {
        try {
            const response = await ratingService.getAllStoreRating({
                storeId,
                sort: "desc",
                limit: "5",
                page: "1",
            });
            setAllStoreRatingDesc(response.data);
        } catch (error) {}
    };

    useEffect(() => {
        if (storeId) {
            getStoreInfo();
            getAllDish();
            getAllStoreRating();
            getPaginationRating();
            getAllStoreRatingDesc();
        }
    }, [storeId]);

    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "6";

    useEffect(() => {
        if (allStoreRating) {
            console.log(allStoreRating);
            const allRatings = allStoreRating?.data?.reduce(
                (acc, item) => {
                    acc[item.ratingValue] = (acc[item.ratingValue] || 0) + 1;
                    return acc;
                },
                { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
            );

            setRatings(allRatings);
            console.log(allRatings);
        }
    }, [allStoreRating]);

    const calculateCartPrice = () => {
        if (!storeCart?.items) return;

        const { totalPrice, totalQuantity } = storeCart.items.reduce(
            (acc, item) => {
                // Prefer the flat item.price (already correct total per dish * quantity in your schema)
                const dishPrice =
                    Number(item.price || item.dishId?.price || 0) *
                    Number(item.quantity || 0);

                // Toppings are stored as an array (might be empty)
                const toppingsPrice =
                    (Array.isArray(item.toppings)
                        ? item.toppings.reduce(
                              (sum, topping) =>
                                  sum + Number(topping.price || 0),
                              0
                          )
                        : 0) * Number(item.quantity || 0);

                acc.totalPrice += dishPrice + toppingsPrice;
                acc.totalQuantity += Number(item.quantity || 0);

                return acc;
            },
            { totalPrice: 0, totalQuantity: 0 }
        );

        setCartPrice(totalPrice);
        setCartQuantity(totalQuantity);
    };

    useEffect(() => {
        if (cart) {
            setStoreCart(cart.find((cart) => cart.store._id === storeId));
        } else {
            setStoreCart(null);
        }
    }, [cart]);

    useEffect(() => {
        if (storeId) {
            getPaginationRating();
        }
    }, [page, limit, storeId]);

    useEffect(() => {
        if (storeCart) {
            calculateCartPrice();
        }
    }, [storeCart]);

    useEffect(() => {
        if (favorite && Array.isArray(favorite.stores)) {
            setStoreFavorite(favorite.stores.some((s) => s._id === storeId));
        } else {
            setStoreFavorite(null);
        }
    }, [favorite]);

    const handleAddToFavorite = async () => {
        if (storeFavorite) {
            try {
                await favoriteService.removeFavorite(storeId);
                refreshFavorite();
            } catch (error) {}
        } else {
            try {
                await favoriteService.addFavorite(storeId);
                refreshFavorite();
            } catch (error) {}
        }
    };

    if (storeLoading) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <ThreeDot color="#fc2111" size="medium" text="" textColor="" />
            </div>
        );
    }

    return (
        <div
            className={` bg-[#fff] md:bg-[#f9f9f9] ${
                cartQuantity > 0 ? "pb-[90px]" : ""
            }`}
        >
            <Heading title={storeInfo?.name} description="" keywords="" />
            <div className="hidden md:block">
                <Header />
            </div>

            {storeInfo ? (
                <>
                    <div className="fixed top-0 right-0 left-0 z-10 flex items-center justify-between p-[20px] bg-[#00000036] md:hidden">
                        <Link href="/home">
                            <Image
                                src="/assets/arrow_left_white.png"
                                alt=""
                                width={30}
                                height={30}
                            />
                        </Link>
                        {user && (
                            <div className="relative flex items-center gap-[20px]">
                                <Image
                                    src={`/assets/favorite${
                                        storeFavorite ? "-active" : "_white"
                                    }.png`}
                                    alt=""
                                    width={30}
                                    height={30}
                                    onClick={() => {
                                        handleAddToFavorite();
                                    }}
                                    className="cursor-pointer"
                                />
                                <Image
                                    src="/assets/notification_white.png"
                                    alt=""
                                    className="cursor-pointer"
                                    width={30}
                                    height={30}
                                />

                                {notifications.filter(
                                    (noti) => noti.status === "unread"
                                ).length > 0 && (
                                    <div className="absolute top-[-6px] right-[-6px] w-[21px] h-[21px] text-center rounded-full bg-[#fc2111] border-solid border-[1px] border-white flex items-center justify-center">
                                        <span className="text-[11px] text-white">
                                            {
                                                notifications.filter(
                                                    (noti) =>
                                                        noti.status === "unread"
                                                ).length
                                            }
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="bg-white lg:w-[75%] md:w-[80%] md:mx-auto md:rounded-2xl md:shadow-md mb-6 overflow-hidden">
                        {/* Cover */}
                        <div className="relative pt-[45%] lg:pt-[30%] overflow-hidden">
                            <Image
                                src={
                                    storeInfo?.coverImage?.url ||
                                    "/assets/logo_app.png"
                                }
                                alt="Store Cover"
                                layout="fill"
                                loading="lazy"
                                objectFit="cover"
                                className="rounded-t-2xl transition-transform duration-300 hover:scale-105"
                            />
                        </div>

                        {/* Info Card */}
                        <div className="flex gap-5 mx-5 mt-[-50px] bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-4 relative z-10">
                            {/* Avatar */}
                            <div className="relative w-[100px] h-[100px] rounded-xl overflow-hidden ring-4 ring-white shadow-md">
                                <Image
                                    src={
                                        storeInfo?.avatarImage?.url ||
                                        "/assets/logo_app.png"
                                    }
                                    alt="Store Avatar"
                                    layout="fill"
                                    loading="lazy"
                                    objectFit="cover"
                                />
                            </div>

                            {/* Store Info */}
                            <div className="flex flex-1 items-start justify-between min-w-0">
                                <div className="flex flex-col min-w-0">
                                    {/* <span className="text-[#4A4B4D] text-xl font-bold truncate">
                                        {storeInfo?.name}
                                    </span> */}
                                    <h3 className="text-[26px] md:text-[30px] font-extrabold text-[#b91c1c]">
                                    {storeInfo?.name}
                                </h3>

                                    {/* Categories */}
                                    <div className="text-sm text-gray-500 line-clamp-2">
                                        {storeInfo?.storeCategory &&
                                            storeInfo?.storeCategory.map(
                                                (category, index) => (
                                                    <div
                                                        key={
                                                            category._id ||
                                                            index
                                                        }
                                                        className="inline"
                                                    >
                                                        <Link
                                                            href={`/search?category=${category._id}`}
                                                            className="hover:text-[#fc2111] transition"
                                                        >
                                                            {category.name}
                                                        </Link>
                                                        {index !==
                                                            storeInfo
                                                                .storeCategory
                                                                .length -
                                                                1 && (
                                                            <span className="inline-block w-1 h-1 my-[3px] mx-[5px] bg-[#fc2111] rounded-full"></span>
                                                        )}
                                                    </div>
                                                )
                                            )}
                                    </div>

                                    {/* Description */}
                                    {storeInfo?.description && (
                                        <span className="text-gray-500 text-sm line-clamp-1">
                                            {storeInfo?.description}
                                        </span>
                                    )}

                                    {/* Giờ mở cửa & trạng thái */}
                                    {storeInfo?.openHour &&
                                        storeInfo?.closeHour && (
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-sm">
                                                <span className="text-gray-500 line-clamp-1">
                                                    {`Giờ mở cửa: ${storeInfo.openHour} - ${storeInfo.closeHour}`}
                                                </span>
                                                <span
                                                    className={`inline-flex items-center gap-2 px-3 py-[4px] rounded-full text-xs font-semibold shadow-md backdrop-blur-sm border transition-all duration-300 whitespace-nowrap
                                                          ${
                                                              storeInfo.openStatus === "opened"
                                                                  ? "bg-green-500/90 border-green-600 text-white hover:bg-green-500/80"
                                                                  : "bg-red-500/90 border-red-400 text-white hover:bg-red-500/80"
                                                          }
                                                        `}
                                                >
                                                    {storeInfo.openStatus ===
                                                    "opened" ? (
                                                        <span>Đang mở cửa</span>
                                                    ) : (
                                                        <span>Đã đóng cửa</span>
                                                    )}
                                                </span>
                                            </div>
                                        )}
                                </div>

                                {/* Favorite */}
                                {user && (
                                    <div className="hidden md:block">
                                        <button
                                            onClick={handleAddToFavorite}
                                            className="p-2 rounded-full hover:scale-110 transition"
                                        >
                                            <Image
                                                src={`/assets/favorite${
                                                    storeFavorite
                                                        ? "-active"
                                                        : ""
                                                }.png`}
                                                alt="favorite"
                                                width={28}
                                                height={28}
                                            />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="px-5 md:px-6 mt-[20px] pb-6">
                            {allDish && (
                                <div className="mb-6">
                                    {/* <h3 className='text-[#4A4B4D] text-xl font-bold mb-3'>Dành cho bạn</h3> */}
                                    <ListDishBig
                                        storeInfo={storeInfo}
                                        allDish={allDish}
                                        cartItems={
                                            storeCart ? storeCart?.items : []
                                        }
                                    />
                                </div>
                            )}

                            {allDish && (
                                <div className="mb-6">
                                    <ListDish
                                        storeInfo={storeInfo}
                                        allDish={allDish}
                                        cartItems={
                                            storeCart ? storeCart?.items : []
                                        }
                                    />
                                </div>
                            )}

                            <div className="flex items-center gap-3 mb-6">
                                <h3 className="text-[26px] md:text-[30px] font-extrabold text-[#b91c1c]">
                                    Vị trí cửa hàng
                                </h3>
                                <div className="flex-1 h-[2px] bg-gradient-to-r from-[#b91c1c]/70 to-transparent rounded-full"></div>
                            </div>
                            {/* Map */}
                            <div className="w-full h-[150px] my-4 relative rounded-xl overflow-hidden shadow-md z-10">
                                {typeof window !== "undefined" &&
                                    storeInfo?.location &&
                                    storeInfo?.location.lat && (
                                        <MapContainer
                                            key={`${storeInfo.location.lat}-${storeInfo.location.lon}`}
                                            center={[
                                                storeInfo.location.lat,
                                                storeInfo.location.lon,
                                            ]}
                                            zoom="12"
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                            }}
                                        >
                                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                            <Marker
                                                position={[
                                                    storeInfo.location.lat,
                                                    storeInfo.location.lon,
                                                ]}
                                                icon={homeIcon}
                                            >
                                                <Popup>
                                                    {storeInfo?.location
                                                        .location || "Cửa hàng"}
                                                </Popup>
                                            </Marker>
                                        </MapContainer>
                                    )}
                            </div>

                            {/* Ratings */}
                            {allStoreRating &&
                                allStoreRatingDesc &&
                                paginationRating &&
                                allStoreRating?.data?.length > 0 &&
                                allStoreRatingDesc?.data?.length > 0 &&
                                paginationRating?.data?.length > 0 &&
                                ratings && (
                                    <>
                                    <div className="flex items-center gap-3 mb-6">
                                      <h3 className="text-[26px] md:text-[30px] font-extrabold text-[#b91c1c]">
                                          Đánh giá
                                      </h3>
                                      <div className="flex-1 h-[2px] bg-gradient-to-r from-[#b91c1c]/70 to-transparent rounded-full"></div>
                                  </div>
                                        <div className="py-5 bg-[#fff5f5] md:rounded-xl mb-4 shadow-inner px-5">
                                            <div className="flex items-center justify-between pb-3">
                                                
                                                <Link
                                                    href={`/store/${storeId}/rating`}
                                                    className="block md:hidden"
                                                >
                                                    <Image
                                                        src="/assets/arrow_right_long.png"
                                                        alt="arrow"
                                                        width={40}
                                                        height={40}
                                                        className="bg-white p-2 rounded-full shadow-md"
                                                    />
                                                </Link>
                                            </div>
                                            <MostRatingSlider
                                                allStoreRatingDesc={
                                                    allStoreRatingDesc.data
                                                }
                                            />
                                        </div>

                                        <div className="hidden md:block">
                                            {ratings && (
                                                <RatingBar ratings={ratings} />
                                            )}
                                            {paginationRating &&
                                                paginationRating.data.map(
                                                    (rating) => (
                                                        <RatingItem
                                                            key={rating._id}
                                                            rating={rating}
                                                            userId={user?._id}
                                                            refetchAllStoreRating={
                                                                getAllStoreRating
                                                            }
                                                            refetchPaginationRating={
                                                                getPaginationRating
                                                            }
                                                            refetchAllStoreRatingDesc={
                                                                getAllStoreRatingDesc
                                                            }
                                                        />
                                                    )
                                                )}
                                            {paginationRating && (
                                                <Pagination
                                                    page={page}
                                                    limit={limit}
                                                    total={
                                                        paginationRating.total
                                                    }
                                                />
                                            )}
                                        </div>
                                    </>
                                )}
                        </div>
                    </div>

                    {cartQuantity > 0 && storeCart && (
                        <Link
                            name="cartDetailBtn"
                            href={`/store/${storeId}/cart`}
                            className="fixed bottom-0 left-0 right-0 bg-[#fff] px-[20px] py-[15px] z-[100] flex items-center justify-center"
                        >
                            <div
                                className="flex items-center justify-between 
                  rounded-xl 
                  bg-gradient-to-r from-[#fc2111] to-[#ff7e3c]
                  text-white py-4 px-6 
                  lg:w-[75%] md:w-[80%] w-full md:mx-auto 
                  shadow-md hover:shadow-lg
                  transition-all duration-300 hover:scale-[1.02]"
                            >
                                <div className="flex items-center gap-2">
                                    <span className="text-lg md:text-xl font-semibold">
                                        Giỏ hàng
                                    </span>
                                    <div className="w-[5px] h-[5px] rounded-full bg-white"></div>
                                    <span className="text-lg md:text-xl font-semibold">
                                        {cartQuantity} món
                                    </span>
                                </div>
                                <span className="text-lg md:text-xl font-bold bg-white/20 px-3 py-1 rounded-md">
                                    {Number(
                                        cartPrice.toFixed(0)
                                    ).toLocaleString("vi-VN")}
                                    đ
                                </span>
                            </div>
                        </Link>
                    )}
                </>
            ) : (
                <div className="md:w-[90%] md:mx-auto px-[20px]">
                    <div className="flex flex-col items-center text-center pt-[150px]">
                        <Image
                            src="data:image/jpeg;base64,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"
                            alt=""
                            width={300}
                            height={300}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default page;
