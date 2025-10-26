import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { userService } from "@/api/userService";

export default function AddTagModal({ tagType, groupKey, data, onSelect, onClose }) {
  const [allTags, setAllTags] = useState({
    food: [],
    taste: [],
    culture: [],
    cooking_method: [],
  });
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await userService.getAllTags();
        setAllTags(res.data || {});
      } catch (err) {
        console.error("Không thể tải danh sách thẻ:", err);
      }
    })();
  }, []);

  const groupMap = {
    food_tags: "food",
    taste_tags: "taste",
    culture_tags: "culture",
    cooking_method_tags: "cooking_method",
  };

  const labelMap = {
    food: "Món ăn",
    taste: "Hương vị",
    culture: "Văn hoá",
    cooking_method: "Phương pháp nấu ăn",
  };

  const selectedGroup = groupMap[tagType] || "food";
  const tagList = allTags[selectedGroup] || [];

  // Determine opposite side (like ↔ dislike)
  const oppositeMap = {
    like_food: "dislike_food",
    dislike_food: "like_food",
    like_taste: "dislike_taste",
    dislike_taste: "like_taste",
    like_culture: "dislike_culture",
    dislike_culture: "like_culture",
  };
  const oppositeKey = oppositeMap[groupKey];

  // Collect IDs already used in current and opposite groups
  const excludeIds = new Set([
    ...(data[groupKey]?.map(t => t._id) || []),
    ...(data[oppositeKey]?.map(t => t._id) || []),
  ]);

  const filtered = tagList.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) &&
      !excludeIds.has(t._id)
  );

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="relative bg-white w-full max-w-lg p-6 rounded-xl shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 active:scale-95 transition-all"
          aria-label="Đóng"
        >
          <X size={22} />
        </button>

        <h2 className="text-lg font-semibold mb-3 capitalize text-center">
          Thêm {labelMap[selectedGroup] || "Thẻ"}
        </h2>

        <input
          type="text"
          placeholder="Tìm kiếm thẻ..."
          className="w-full border px-3 py-2 rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-[#e50914]/50"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="max-h-64 overflow-y-auto border rounded-md">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left px-3 py-2">Tên thẻ</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((tag) => (
                <tr
                  key={tag._id}
                  onClick={() => {
                    onSelect(tag);
                    onClose();
                  }}
                  className="border-t cursor-pointer hover:bg-gradient-to-r hover:from-[#ffe5e5] hover:to-[#ffd6d6] transition-colors"
                >
                  <td className="px-3 py-3 font-medium text-gray-700">
                    {tag.name}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="2" className="text-center py-4 text-gray-400">
                    Không tìm thấy thẻ phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full py-[12px] rounded-full font-semibold bg-gray-200 hover:bg-gray-300 text-black transition-all active:scale-[0.98]"
        >
          Đóng
        </button>
      </div>
    </div>
  );
}
