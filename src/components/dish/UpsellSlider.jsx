// src/components/order/UpsellSlider.js (or similar path)
"use client";
import React, { useEffect, useState, useMemo } from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { recommendService } from "@/api/recommendService";
import { useAuth } from "@/context/authContext";
import { useReference } from "@/context/referenceContext"; // To get preferenceSets helper
import UpsellDishCard from "@/components/dish/UpsellDishCard"; // Import the new card

import "swiper/css";
import "swiper/css/autoplay"; // If using autoplay

// Assuming createPreferenceSets is available (maybe move to utils)
const createPreferenceSets = (userReference) => {
    if (!userReference) return null;
    const toSet = (arr = []) => new Set(arr.map(id => id.toString()));
    return {
      allergy: toSet(userReference.allergy),
      dislike_food: toSet(userReference.dislike_food),
      dislike_taste: toSet(userReference.dislike_taste),
      dislike_cooking: toSet(userReference.dislike_cooking_method),
      dislike_culture: toSet(userReference.dislike_culture),
    };
};


const UpsellSlider = ({ storeId, storeCartItems = [] }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth(); // Need user ID and potentially populated reference
  // Assuming user object might have userReference populated by middleware
  const userReference = user?.userReference || null;

  useEffect(() => {
    const fetchAndFilterRecommend = async () => {
      if (!user?._id) {
          setLoading(false);
          return; // No user, no recommendations
      }
      setLoading(true);
      try {
          // Fetch slightly more recommendations for filtering
        const res = await recommendService.getRecommendDish({
            user_id: user._id,
            top_k: 10, // Fetch more to increase chances after filtering
            storeId
        });

        if (res.success && Array.isArray(res.data?.recommendations)) {
          let enriched = res.data.recommendations.filter(r => r.metadata); // Ensure metadata exists

          // --- Filtering ---
          const cartDishIds = new Set(storeCartItems.map(item => item.dishId?._id || item.dishId).filter(Boolean));
          const prefSets = createPreferenceSets(userReference);

          const filtered = enriched.filter(dishData => {
            const dishId = dishData._id || dishData.dish_id;
            const dishTags = dishData.metadata; // Full dish object

            // 1. Filter out if already in cart
            if (cartDishIds.has(dishId.toString())) {
                // console.log(`Upsell Filter: ${dishTags.name} already in cart.`);
                return false;
            }

            // 2. Filter based on preferences (if available)
            if (prefSets) {
                if (dishTags.dishTags?.some(tag => prefSets.allergy.has((tag._id || tag).toString()))) return false;
                if (dishTags.dishTags?.some(tag => prefSets.dislike_food.has((tag._id || tag).toString()))) return false;
                if (dishTags.tasteTags?.some(tag => prefSets.dislike_taste.has((tag._id || tag).toString()))) return false;
                if (dishTags.cookingMethodtags?.some(tag => prefSets.dislike_cooking.has((tag._id || tag).toString()))) return false;
                if (dishTags.cultureTags?.some(tag => prefSets.dislike_culture.has((tag._id || tag).toString()))) return false;
            }

            // Keep if passed all filters
            return true;
          });

          setRecommendations(filtered);
          console.log(filtered)
          console.log(`Upsell: Found ${filtered.length} suitable recommendations.`);

        } else {
            console.log("Upsell: No recommendations from API or invalid format.");
          setRecommendations([]);
        }
      } catch (err) {
        console.error("Upsell: Failed to fetch recommendations:", err);
        setRecommendations([]); // Clear on error
      } finally {
        setLoading(false);
      }
    };

    fetchAndFilterRecommend();
  }, [user?._id, userReference, storeCartItems]); // Re-fetch if user or cart changes

  // Render null if loading or no suitable recommendations found
  // if (loading || !recommendations || recommendations.length === 0) {
  //   return null; // Or a subtle loading indicator if preferred
  // }

  return ( recommendations.length != 0 && 
    // <div className="bg-white flex flex-col p-5 border border-red-100 rounded-xl shadow-sm md:p-6 hover:shadow-md transition-all">
    <div className="mt-4 mb-2 p-4 bg-white border border-red-100 rounded-xl shadow-sm">
        <h4 className="text-md font-semibold text-gray-700 mb-3">Các món bạn có thể thích</h4>
         <Swiper
             // className="upsell-slider" // Optional specific class
             modules={[Autoplay]} // Add Navigation if you want arrows
             spaceBetween={10}
             slidesPerView={1} // Show only one item
             autoplay={{
               delay: 5000, // Cycle every 5 seconds
               disableOnInteraction: true, // Stop if user interacts
             }}
             loop={recommendations.length > 1} // Only loop if more than one item
            // navigation // Add if using Navigation module and want arrows
         >
             {recommendations.map((dish) => (
                 <SwiperSlide key={dish._id || dish.dish_id}>
                    {/* Pass storeId needed for Add button */}
                     <UpsellDishCard dish={dish} storeId={storeId} />
                 </SwiperSlide>
             ))}
             {/* Add navigation arrows here if needed */}
         </Swiper>
    </div>
  );
};

export default UpsellSlider;