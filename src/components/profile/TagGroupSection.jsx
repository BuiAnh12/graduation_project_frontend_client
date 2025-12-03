import React, { useState } from "react";
import DisplayTag from "./DisplayTag";
import AddTagModal from "./AddTagModal";

export default function TagGroupSection({
    title,
    groupKey,
    data,
    setData,
    tagType,
}) {
    const [showModal, setShowModal] = useState(false);

    // Safety check: Ensure we have an array to work with, even if data is null/undefined
    const currentTags = data?.[groupKey] || [];

    const handleRemove = (tagId) => {
        const updated = {
            ...(data || {}), // Safety check in case data itself is null
            [groupKey]: currentTags.filter((tag) => tag._id !== tagId),
        };
        setData(updated);
    };

    const handleAdd = (newTag) => {
        // Use the safe 'currentTags' variable
        if (currentTags.some((t) => t._id === newTag._id)) return;
        
        const updated = { 
            ...(data || {}), 
            [groupKey]: [...currentTags, newTag] 
        };
        setData(updated);
    };

    return (
        <div className="border p-4 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-base">{title}</h3>

                <button
                    type="button"
                    onClick={() => setShowModal(true)}
                    className="px-3 py-1 text-sm font-medium rounded-md bg-gradient-to-r from-[#e50914] to-[#ff4040] text-white hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                    Add
                </button>
            </div>

            {/* Display existing tags */}
            <div className="flex flex-wrap gap-2">
                {/* Check length to conditionally render placeholder or map */}
                {currentTags.length === 0 ? (
                    <span className="text-gray-400 text-sm italic">Chưa có tags</span>
                ) : (
                    currentTags.map((tag) => (
                        <DisplayTag
                            key={tag._id}
                            tag={tag}
                            onRemove={() => handleRemove(tag._id)}
                        />
                    ))
                )}
            </div>

            {/* Modal for selecting tags */}
            {showModal && (
                <AddTagModal
                    tagType={tagType}
                    groupKey={groupKey}
                    data={data || {}} // Pass empty object if data is null
                    onSelect={(tag) => handleAdd(tag)}
                    onClose={() => setShowModal(false)}
                />
            )}
        </div>
    );
}