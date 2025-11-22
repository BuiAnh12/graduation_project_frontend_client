"use client";
import React, { useEffect, useState } from "react";
import { recommendService } from "@/api/recommendService";
import { userService } from "@/api/userService";
import { ThreeDot } from "react-loading-indicators";

const TagRecommendationModal = ({ isOpen, onClose, dishIds }) => {
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState([]);
  const [selectedTags, setSelectedTags] = useState(new Set());
  const [isSaving, setIsSaving] = useState(false);

  // Mapping for pretty category names
  const typeLabels = {
    taste: "Hương vị",
    culture: "Văn hóa ẩm thực",
    food: "Nguyên liệu",
    cooking_method: "Cách chế biến",
  };

  useEffect(() => {
    if (isOpen && dishIds.length > 0) {
      fetchRecommendations();
    }
  }, [isOpen, dishIds]);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const res = await recommendService.getRecommendTagsForOrder(dishIds);
      if (res.data && res.data.recommendations) {
        setRecommendations(res.data.recommendations);
        // Auto-select high confidence tags (optional, e.g., score > 0.9)
        // const initialSet = new Set(res.data.recommendations.map(t => t._id));
        // setSelectedTags(initialSet);
      }
    } catch (error) {
      console.error("Failed to fetch tag recommendations", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTag = (tag) => {
    const next = new Set(selectedTags);
    // We store the whole object or a composite key to identify type later
    // For simplicity in UI state, we store the ID string
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
      // Reconstruct the payload: array of { _id, type }
      const payload = recommendations
        .filter((r) => selectedTags.has(r._id))
        .map((r) => ({ _id: r._id, type: r.type }));

      await userService.addTagsToReference(payload);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  // Group tags by type
  const groupedTags = recommendations.reduce((acc, tag) => {
    const group = tag.type || "other";
    if (!acc[group]) acc[group] = [];
    acc[group].push(tag);
    return acc;
  }, {});

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#fc2111] to-[#ff8743] p-6 text-white text-center">
          <h2 className="text-xl font-bold">Bạn có thích món vừa rồi?</h2>
          <p className="text-white/90 text-sm mt-1">
            Thêm sở thích để FoodApp gợi ý chuẩn gu hơn nhé!
          </p>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {loading ? (
            <div className="flex justify-center py-10">
              <ThreeDot color="#fc2111" size="small" />
            </div>
          ) : recommendations.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              Chưa có gợi ý nào cho đơn hàng này.
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedTags).map(([type, tags]) => (
                <div key={type}>
                  <h3 className="text-gray-800 font-semibold text-sm mb-2 uppercase tracking-wide">
                    {typeLabels[type] || type}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => {
                      const isSelected = selectedTags.has(tag._id);
                      return (
                        <button
                          key={tag._id}
                          onClick={() => toggleTag(tag)}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${
                            isSelected
                              ? "bg-[#fc2111]/10 border-[#fc2111] text-[#fc2111]"
                              : "bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300"
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

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-gray-600 font-medium hover:bg-gray-100 transition"
          >
            Bỏ qua
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || loading || recommendations.length === 0}
            className="flex-1 py-2.5 rounded-xl bg-[#fc2111] text-white font-bold shadow-lg shadow-red-200 hover:shadow-red-300 hover:-translate-y-0.5 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? "Đang lưu..." : "Thêm vào sở thích"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TagRecommendationModal;