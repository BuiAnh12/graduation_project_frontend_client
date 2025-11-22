"use client";
import React, { useEffect, useState } from "react";
import { recommendService } from "@/api/recommendService";
import { userService } from "@/api/userService"; // Ensure this is imported
import { ThreeDot } from "react-loading-indicators";

const TagRecommendationToast = ({ isOpen, onClose, dishIds }) => {
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState([]);
  const [selectedTags, setSelectedTags] = useState(new Set());
  const [isSaving, setIsSaving] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // 1. Animation Logic: Wait for slide-out before unmounting
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300); // Match transition duration
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const typeLabels = {
    taste: "Hương vị",
    culture: "Văn hóa",
    food: "Nguyên liệu",
    cooking_method: "Chế biến",
  };

  // 2. Fetch Data on Open
  useEffect(() => {
    if (isOpen && dishIds.length > 0) {
      fetchRecommendations();
    }
  }, [isOpen, dishIds]);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      // Use recommendService for fetching
      const res = await recommendService.getRecommendTagsForOrder(dishIds);
      if (res.data && res.data.recommendations) {
        setRecommendations(res.data.recommendations);
      }
    } catch (error) {
      console.error("Failed to fetch tag recommendations", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTag = (tag) => {
    const next = new Set(selectedTags);
    if (next.has(tag._id)) {
      next.delete(tag._id);
    } else {
      next.add(tag._id);
    }
    setSelectedTags(next);
  };

  const handleSave = async () => {
    if (selectedTags.size === 0) {
      onClose();
      return;
    }

    setIsSaving(true);
    try {
      // Reconstruct payload
      const payload = recommendations
        .filter((r) => selectedTags.has(r._id))
        .map((r) => ({ _id: r._id, type: r.type }));

      // Use userService for saving
      await userService.addTagsToReference(payload);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  // Don't render anything if closed and animation finished
  if (!isOpen && !isVisible) return null;

  // Group tags by category
  const groupedTags = recommendations.reduce((acc, tag) => {
    const group = tag.type || "other";
    if (!acc[group]) acc[group] = [];
    acc[group].push(tag);
    return acc;
  }, {});

  return (
    // Wrapper: Fixed Position Bottom-Right, No Background Overlay
    <div
      className={`fixed bottom-5 right-5 z-[1000] w-full max-w-[380px] transform transition-all duration-300 ease-in-out ${
        isOpen ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"
      }`}
    >
      {/* Card Container */}
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[80vh]">
        
        {/* Header: Gradient & Dismiss Button */}
        <div className="bg-gradient-to-r from-[#fc2111] to-[#ff8743] px-5 py-4 flex justify-between items-start">
          <div>
            <h2 className="text-white font-bold text-lg leading-tight">
              Gợi ý khẩu vị
            </h2>
            <p className="text-white/90 text-xs mt-1">
              Dựa trên món bạn vừa đặt
            </p>
          </div>
          {/* Close Button (X) */}
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-1 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Body: Scrollable Content */}
        <div className="p-5 overflow-y-auto custom-scrollbar max-h-[400px]">
          {loading ? (
            <div className="flex justify-center py-8">
              <ThreeDot color="#fc2111" size="small" />
            </div>
          ) : recommendations.length === 0 ? (
            <div className="text-center text-gray-500 py-4 text-sm">
              Không tìm thấy gợi ý phù hợp.
            </div>
          ) : (
            <div className="space-y-5">
              {Object.entries(groupedTags).map(([type, tags]) => (
                <div key={type}>
                  <h3 className="text-gray-500 font-bold text-[11px] mb-2 uppercase tracking-wider">
                    {typeLabels[type] || type}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => {
                      const isSelected = selectedTags.has(tag._id);
                      return (
                        <button
                          key={tag._id}
                          onClick={() => toggleTag(tag)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border shadow-sm ${
                            isSelected
                              ? "bg-[#fc2111] border-[#fc2111] text-white shadow-red-200"
                              : "bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {tag.name} {isSelected && "✓"}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer: Action Button */}
        {recommendations.length > 0 && (
          <div className="p-4 bg-gray-50/80 backdrop-blur-sm">
            <button
              onClick={handleSave}
              disabled={isSaving || selectedTags.size === 0}
              className={`w-full py-2.5 rounded-xl font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2 ${
                selectedTags.size === 0
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                  : "bg-[#fc2111] text-white shadow-red-200 hover:shadow-red-300 hover:-translate-y-0.5"
              }`}
            >
              {isSaving ? (
                 <ThreeDot color="#ffffff" size="small" />
              ) : (
                 `Thêm ${selectedTags.size > 0 ? selectedTags.size : ""} sở thích`
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TagRecommendationToast;