"use client";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Header from "@/components/header/Header";
import Heading from "@/components/Heading";
import ToppingItemCheckBox from "@/components/dish/ToppingItemCheckBox";
import ToppingItemRadio from "@/components/dish/ToppingItemRadio";
import { useCart } from "@/context/cartContext";
import { dishService } from "@/api/dishService";
import { useAuth } from "@/context/authContext";
import { cartService } from "@/api/cartService";
import { ThreeDot } from "react-loading-indicators";
import { recommendService } from "@/api/recommendService";
import SimilarDishesPopup from "@/components/dish/SimilarDishesPopup";
import Swal from "sweetalert2";

const page = () => {
    const { id: storeId, dishId } = useParams();

    const [dishInfo, setDishInfo] = useState(null);
    const [storeCart, setStoreCart] = useState(null);
    const [dishCart, setDishCart] = useState(null);
    const [note, setNote] = useState("");
    const [quantity, setQuantity] = useState(0);
    const [cartItem, setCartItem] = useState(null);
    const [toppings, setToppings] = useState([]);
    const [toppingsValue, setToppingsValue] = useState([]);
    const [price, setPrice] = useState(0);
    const [loading, setLoading] = useState(true);
    const [similarDishes, setSimilarDishes] = useState([]);
    const [showSimilarPopup, setShowSimilarPopup] = useState(false);
    const [cartDataLoaded, setCartDataLoaded] = useState(false)
    const { cart, refreshCart } = useCart();
    const { user } = useAuth();

    const getDishInfo = async () => {
        try {
            const response = await dishService.getDish(dishId);
            setDishInfo(response.data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };

    const handleShowSimilar = async (currentDishId) => {
        if (!currentDishId || !storeId) return;

        setShowSimilarPopup(false); // Close any existing popup first
        setSimilarDishes([]); // Clear previous dishes

        try {
            const payload = {
                dish_id: currentDishId,
                top_k: 5,
                sameStore: true, // IMPORTANT: Filter by the current store
            };
            const response = await recommendService.getSimilarDish(payload);
            console.log("Similar Dishes Response:", response); // For debugging

            if (response.success && response.data.similar_dishes?.length > 0) {
                // Filter out the source dish itself
                const filteredDishes = response.data.similar_dishes.filter(
                    (d) => d.dish_id !== currentDishId
                );

                if (filteredDishes.length > 0) {
                    setSimilarDishes(filteredDishes);
                    setShowSimilarPopup(true);
                } else {
                    console.log("No different similar dishes found.");
                }
            } else {
                console.log(
                    "No similar dishes found or API error:",
                    response.message
                );
            }
        } catch (error) {
            console.error("Error fetching similar dishes:", error);
            // toast.error("Không thể tải gợi ý món ăn.");
        }
    };

    useEffect(() => {
        if (dishId) {
            getDishInfo();
        }
    }, [dishId]);

    useEffect(() => {
        if (cart) {
            console.log("Cart", cart);
            const store = cart.find((c) => c.storeId._id === storeId);
            setStoreCart(store);

            const dish = store?.items.find(
                (item) => item.dishId._id === dishId
            );
            setDishCart(dish);

            if (dish?.note) {
                setNote(dish.note);
            } else {
                setNote("");
            }
        }
    }, [cart, storeId, dishId]);

    const handleQuantityInputChange = (e) => {
        let inputValue = parseInt(e.target.value, 10);

        if (isNaN(inputValue)) {
            setQuantity(0);
            return;
        }

        // Correct logic
        if (inputValue > 50) {
            toast.info("Số lượng tối đa là 50. Đã tự động điều chỉnh.");
            inputValue = 50;
        }

        // Negative Testing
        if (inputValue < 0) {
            toast.info("Số lượng tối thiểu là 0. Đã tự động điều chỉnh.");
            inputValue = 0;
        }

        setQuantity(inputValue);

        const dishPrice = Number(dishInfo?.price || 0) * inputValue;
        const toppingsPrice =
            toppingsValue.reduce(
                (sum, topping) => sum + Number(topping.price || 0),
                0
            ) * inputValue;

        setPrice(dishPrice + toppingsPrice);
    };

    useEffect(() => {
        if (storeCart) {
            console.log("StoreCart", storeCart)
            const item = storeCart.items.find(
                (item) => item.dishId._id === dishId
            );
            
            setCartItem(item);
            setQuantity(item?.quantity || 0);

            if (item?.toppings.length > 0) {
                item.toppings.forEach((topping) => {
                    setToppings((prev) => {
                        console.log("topping display", topping.toppingId._id)
                        if (prev.includes(topping.toppingId._id)) {
                            return [...prev];
                        } else {
                            return [...prev, topping.toppingId._id];
                        }
                    });

                    setToppingsValue((prev) => {
                        console.log("prev", prev)
                        if (
                            prev.some(
                                (tp) => tp.toppingId._id === topping.toppingId._id
                            )
                        ) {
                            return [...prev];
                        } else {
                            return [
                                ...prev,
                                {
                                    ...topping,
                                    _id: topping.toppingId._id
                                },
                            ];
                        }
                    });
                });
            }
        }
    }, [storeCart]);

    // useEffect(() => {
    //     // Only run initialization once after dishInfo is loaded and cartItem is determined
    //     if (dishInfo && cartItem !== undefined && !cartDataLoaded) {
    //         // Check cartItem is determined (could be null)
    //         if (cartItem) {
    //             console.log("Initializing state from cartItem:", cartItem);
    //             setQuantity(cartItem.quantity || 0);
    //             setNote(cartItem.note || "");

    //             // --- Corrected Topping Initialization ---
    //             const initialToppingIds =
    //                 cartItem.toppings
    //                     ?.map((t) => t.toppingId?._id?.toString())
    //                     .filter(Boolean) || []; // Get actual Topping IDs as strings

    //             const initialToppingValues =
    //                 cartItem.toppings
    //                     ?.map((t) => {
    //                         // Find the original Topping object within dishInfo based on the ID
    //                         let originalTopping = null;
    //                         let foundGroupId = null;
    //                         dishInfo.toppingGroups?.forEach((group) => {
    //                             const found = group.toppings.find(
    //                                 (topInGroup) =>
    //                                     topInGroup._id === t.toppingId?._id
    //                             );
    //                             if (found) {
    //                                 originalTopping = found;
    //                                 foundGroupId = group._id.toString();
    //                             }
    //                         });

    //                         if (!originalTopping) return null; // Skip if original topping info not found in dishInfo

    //                         // Reconstruct object needed for price calculation and handleChooseTopping
    //                         return {
    //                             _id: originalTopping._id, // The actual Topping _id
    //                             name: originalTopping.name,
    //                             price: originalTopping.price,
    //                             groupId: foundGroupId, // Store the group ID it belongs to
    //                             // toppingId: t.toppingId?._id // Redundant if using _id consistently
    //                         };
    //                     })
    //                     .filter(Boolean) || []; // Remove nulls if original topping wasn't found

    //             console.log("Initialized Topping IDs:", initialToppingIds);
    //             console.log(
    //                 "Initialized Topping Values:",
    //                 initialToppingValues
    //             );

    //             setToppings(initialToppingIds);
    //             setToppingsValue(initialToppingValues);
    //             //-----------------------------------------
    //         } else {
    //             console.log(
    //                 "Initializing state TO DEFAULTS (no cartItem found)."
    //             );
    //             // No item in cart, ensure defaults
    //             setQuantity(0);
    //             setNote("");
    //             setToppings([]);
    //             setToppingsValue([]);
    //         }
    //         setCartDataLoaded(true); // Mark as loaded (either from cart or with defaults)
    //     }
    // }, [cartItem, dishInfo, cartDataLoaded]);

    useEffect(() => {
        if (cartItem) {
            const dishPrice =
                Number(cartItem.dishId?.price || 0) * Number(cartItem.quantity);
            const toppingsPrice =
                (Array.isArray(cartItem.toppings)
                    ? cartItem.toppings.reduce(
                          (sum, topping) => sum + Number(topping.price || 0),
                          0
                      )
                    : 0) * Number(cartItem.quantity);

            const totalPrice = dishPrice + toppingsPrice;

            setPrice(totalPrice);
        }
    }, [cartItem]);

    const handleChangeQuantity = (qnt) => {
        let newQuantity = quantity + qnt;

        if (newQuantity > 50) {
            toast.info("Số lượng tối đa là 50. Đã tự động điều chỉnh.");
            newQuantity = 50;
        }

        if (newQuantity < 0) {
            toast.info("Số lượng tối thiểu là 0. Đã tự động điều chỉnh.");
            newQuantity = 0;
        }

        setQuantity(newQuantity);

        const dishPrice = Number(dishInfo?.price || 0) * newQuantity;
        const toppingsPrice =
            toppingsValue.reduce(
                (sum, topping) => sum + Number(topping.price || 0),
                0
            ) * newQuantity;

        setPrice(dishPrice + toppingsPrice);
    };

    const handleChooseTopping = (topping, toppingPrice, toppingGroup) => {
        console.log("Choose topping clicked")
        const isRadio = toppingGroup.onlyOnce === true;

        if (isRadio) {
            const prevTopping = toppingsValue.find(
                (item) => item.groupId === toppingGroup._id
            );

            if (prevTopping) {
                if (prevTopping._id === topping._id) {
                    const priceChange = -prevTopping.price * quantity;
                    setPrice((prev) => prev + priceChange);

                    setToppings((prev) =>
                        prev.filter((id) => id !== topping._id)
                    );
                    setToppingsValue((prev) =>
                        prev.filter((tp) => tp.toppingId !== topping._id)
                    );
                    return;
                } else {
                    const priceChange = -prevTopping.price * quantity;
                    setPrice((prev) => prev + priceChange);

                    setToppings((prev) =>
                        prev.filter((id) => id !== prevTopping._id)
                    );
                    setToppingsValue((prev) =>
                        prev.filter((tp) => tp.toppingId !== prevTopping._id)
                    );
                }
            }

            setToppingsValue((prev) => {
                const updated = prev.filter(
                    (item) => item.groupId !== toppingGroup._id
                );
                return [
                    ...updated,
                    { ...topping, groupId: toppingGroup._id, _id: topping._id },
                ];
            });

            setToppings((prev) => [...prev, topping._id]);

            const priceChange = toppingPrice * quantity;
            setPrice((prev) => prev + priceChange);
        } else {
            let priceChange = 0;
            console.log(topping);
            console.log(toppings)
            if (toppings.includes(topping._id)) {
                priceChange = -toppingPrice * quantity;
                setToppings((prev) => prev.filter((id) => id !== topping._id));
                setToppingsValue((prev) =>
                    prev.filter((tp) => tp.toppingId._id !== topping._id)
                );
            } else {
                priceChange = toppingPrice * quantity;
                setToppings((prev) => [...prev, topping._id]);
                setToppingsValue((prev) => [
                    ...prev,
                    { 
                        toppingId: {
                            _id: topping._id
                        }
                    },
                ]);
            }

            setPrice((prev) => prev + priceChange);
        }
    };

    useEffect(() => {
        console.log("Topping uf: ", toppings);
    }, [toppings]);

    const handleAddToCart = async () => {
        if (storeCart?.store?.openStatus === "closed") {
            toast.error("Cửa hàng hiện đang đóng cửa, vui lòng quay lại sau!");
            return;
        }

        if (dishInfo?.stockStatus === "out_of_stock") {
            // toast.error(
                "Món ăn này hiện đang hết hàng, vui lòng quay lại sau!"
            // );
            return;
        }

        if (user) {
            const res = await cartService.updateCart({
                storeId,
                action: "update_item",
                dishId,
                quantity,
                toppings,
                note,
            });

            if (res.success) {
                Swal.fire({
                    title: "Cập nhật giỏ hàng thành công",
                    icon: "success",
                });
                if (quantity > 0) {
                    handleShowSimilar(dishId); // Use dishId from useParams
                } else {
                    // If quantity became 0, ensure popup is closed
                    setShowSimilarPopup(false);
                }
                refreshCart();
            } else {
                // Show backend error
                // toast.error(res.errorMessage || "Không thể cập nhật giỏ hàng!");
            }
        } else {
            // toast.error("Vui lòng đăng nhập để tiếp tục đặt hàng!");
        }
    };

    const handleRemoveFromCart = async () => {
        if (user) {
            try {
                await cartService.updateCart({
                    storeId,
                    dishId,
                    action: "remove_item",
                    quantity: 0,
                    toppings: [],
                });
                // toast.success("Cập nhật giỏ hàng thành công");
                refreshCart();
                setShowSimilarPopup(false);
            } catch (error) {
                console.error(error);
            }
        } else {
            // toast.error("Vui lòng đăng nhập để tiếp tục đặt hàng!");
        }
    };

    if (loading) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <ThreeDot color="#fc2111" size="medium" text="" textColor="" />
            </div>
        );
    }

    return (
        <>
            <div className="pb-[120px] md:pt-[75px] md:mt-[20px] bg-[#fff]">
                <Heading title={dishInfo?.name} description="" keywords="" />
                <div className="hidden md:block">
                    <Header />
                </div>

                {dishInfo ? (
                    <div className="lg:w-[60%] md:w-[80%] md:mx-auto">
                        <div className="relative bg-white flex flex-col p-5 border border-gray-100 rounded-xl shadow-md md:p-6 hover:shadow-lg transition">
                            <div className="absolute top-0 right-0 left-0 z-10 flex items-center justify-between px-[20px] pt-[20px]">
                                <Link
                                    href={`/store/${storeId}`}
                                    className="relative w-[40px] pt-[40px] rounded-full bg-gray-500 overflow-hidden"
                                >
                                    <Image
                                        src="/assets/arrow_left_white.png"
                                        alt=""
                                        layout="fill"
                                        className="p-[8px]"
                                    />
                                </Link>
                            </div>

                            <div className="relative pt-[50%] z-0 md:pt-[40%] lg:pt-[35%]">
                                <Image
                                    src={dishInfo?.image?.url || ""}
                                    alt=""
                                    layout="fill"
                                    objectFit="contain"
                                />
                            </div>

                            <div className="bg-white flex flex-col p-5 border border-gray-100 rounded-xl shadow-md md:p-6 hover:shadow-lg transition">
                                <div className="flex justify-between">
                                    <h3
                                        className="text-[26px] md:text-[30px] font-extrabold text-[#b91c1c]"
                                        name="dishName"
                                    >
                                        {dishInfo?.name}
                                    </h3>
                                    <span
                                        className="text-[#4A4B4D] text-[28px] font-bold"
                                        name="dishPrice"
                                    >
                                        {Number(dishInfo?.price).toLocaleString(
                                            "vi-VN"
                                        )}
                                        đ
                                    </span>
                                </div>
                                <p className="text-[#a4a5a8]">
                                    {dishInfo?.description}
                                </p>
                            </div>

                            <div className="h-[6px] w-full bg-transparent my-4 rounded-full"></div>

                            {dishInfo.toppingGroups &&
                                dishInfo.toppingGroups.length > 0 && (
                                    <>
                                        <div className="bg-white flex flex-col p-5 border border-gray-100 rounded-xl shadow-md md:p-6 hover:shadow-lg transition">
                                            {dishInfo.toppingGroups.map(
                                                (toppingGroup, index) =>
                                                    toppingGroup.toppings
                                                        .length > 0 && (
                                                        <div
                                                            key={`${toppingGroup._id}-${index}`}
                                                        >
                                                            <div className="flex gap-[10px]">
                                                                <h3 className="text-[#4A4B4D] text-[20px] font-bold">
                                                                    {
                                                                        toppingGroup.name
                                                                    }
                                                                </h3>
                                                            </div>
                                                            {toppingGroup.onlyOnce
                                                                ? toppingGroup.toppings.map(
                                                                      (
                                                                          topping
                                                                      ) => (
                                                                          <ToppingItemRadio
                                                                              name="toppingItems"
                                                                              key={`${toppingGroup._id}-${topping._id}`}
                                                                              topping={
                                                                                  topping
                                                                              }
                                                                              toppingGroup={
                                                                                  toppingGroup
                                                                              }
                                                                              selectedTopping={
                                                                                  toppingsValue
                                                                              }
                                                                              handleChooseTopping={
                                                                                  handleChooseTopping
                                                                              }
                                                                          />
                                                                      )
                                                                  )
                                                                : toppingGroup.toppings.map(
                                                                      (
                                                                          topping
                                                                      ) => (
                                                                          <ToppingItemCheckBox
                                                                              name="toppingItems"
                                                                              key={`${toppingGroup._id}-${topping._id}`}
                                                                              topping={
                                                                                  topping
                                                                              }
                                                                              selectedTopping={
                                                                                  toppingsValue
                                                                              }
                                                                              toppingGroup={
                                                                                  toppingGroup
                                                                              }
                                                                              handleChooseTopping={
                                                                                  handleChooseTopping
                                                                              }
                                                                          />
                                                                      )
                                                                  )}
                                                        </div>
                                                    )
                                            )}
                                        </div>

                                        {/* Divider */}
                                        <div className="h-[6px] w-full bg-transparent my-4 rounded-full"></div>
                                    </>
                                )}

                            <div className="bg-white flex flex-col p-5 border border-gray-100 rounded-xl shadow-md md:p-6 hover:shadow-lg transition">
                                <div className="pb-[20px]">
                                    <h3 className="text-[#4A4B4D] text-[20px] font-bold">
                                        Thêm lưu ý cho quán{" "}
                                        <span className="text-[#a4a5a8] text-[16px] font-normal">
                                            (Không bắt buộc)
                                        </span>
                                    </h3>
                                </div>
                                <textarea
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    className="p-[10px] w-full border border-solid border-[#ffc6c0] rounded-[10px] focus:ring-2 focus:ring-[#fc2111] resize-none focus:border-[#fc2111]"
                                    placeholder="Việc thực hiện yêu cầu còn tùy thuộc vào khả năng của quán"
                                />
                            </div>

                            <div className="h-[6px] w-full bg-transparent my-4 rounded-full"></div>

                            <div className="flex items-center justify-center gap-4 bg-white p-5 border border-gray-100 rounded-2xl shadow-md md:p-6 hover:shadow-lg transition-all duration-200">
                                {/* Nút giảm */}
                                <button
                                    name="decreaseQuantityBtn"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleChangeQuantity(-1);
                                    }}
                                    className="w-[50px] h-[50px] flex items-center justify-center rounded-full bg-gradient-to-r from-gray-100 to-gray-200 
               border border-gray-300 shadow-md cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95"
                                >
                                    <Image
                                        src="/assets/minus.png"
                                        alt="Decrease"
                                        width={24}
                                        height={24}
                                        className="pointer-events-none"
                                    />
                                </button>

                                {/* Input số lượng */}
                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={handleQuantityInputChange}
                                    className="text-[#4A4B4D] text-2xl font-bold w-[70px] text-center bg-gray-50 border border-gray-200 rounded-lg py-2 focus:outline-none focus:ring-2 focus:ring-[#fc2111] transition-all duration-200"
                                />

                                {/* Nút tăng */}
                                <button
                                    name="increaseQuantityBtn"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleChangeQuantity(1);
                                    }}
                                    className="w-[50px] h-[50px] flex items-center justify-center rounded-full bg-gradient-to-r from-[#fc2111] to-[#ff7a33] 
               shadow-md cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95"
                                >
                                    <Image
                                        src="/assets/plus_white.png"
                                        alt="Increase"
                                        width={24}
                                        height={24}
                                        className="pointer-events-none"
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
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

            {showSimilarPopup && (
                <SimilarDishesPopup
                    dishes={similarDishes}
                    storeId={storeId} // Pass storeId to popup if needed for its actions
                    onClose={() => setShowSimilarPopup(false)}
                />
            )}

            <div className="fixed bottom-0 left-0 right-0 bg-white px-5 md:px-0 py-4 z-[100] flex items-center justify-center shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
                {quantity > 0 ? (
                    <div
                        name="addCartBtn"
                        className="flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#fc2111] to-[#ff7a33] text-white py-4 px-6 
                 lg:w-[60%] md:w-[80%] w-full md:mx-auto cursor-pointer shadow-md hover:shadow-lg 
                 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                        onClick={handleAddToCart}
                    >
                        <span className="text-white text-xl font-semibold">
                            Thêm vào giỏ hàng
                        </span>
                        <span className="text-white text-xl font-semibold">
                            •
                        </span>
                        <span
                            className="text-white text-xl font-semibold"
                            name="totalPrice"
                        >
                            {Number(price.toFixed(0)).toLocaleString("vi-VN")}đ
                        </span>
                    </div>
                ) : (
                    <div className="flex items-center gap-4 lg:w-[60%] md:w-[80%] w-full md:mx-auto">
                        <Link
                            href={`/store/${storeId}`}
                            className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#fc2111] to-[#ff7a33] text-white py-4 px-4 sm:px-6 
                   cursor-pointer w-[65%] md:w-[80%] shadow-md hover:shadow-lg 
                   transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <span className="text-white text-xl font-semibold">
                                Quay lại cửa hàng
                            </span>
                        </Link>

                        <div
                            className="flex items-center justify-center gap-2 rounded-2xl bg-gray-300 text-gray-700 py-4 px-4 sm:px-6 
                   cursor-pointer w-[35%] md:w-[20%] shadow-md hover:shadow-lg 
                   transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                            onClick={handleRemoveFromCart}
                        >
                            <span className="text-gray-700 text-xl font-semibold whitespace-nowrap">
                                Bỏ chọn
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default page;
