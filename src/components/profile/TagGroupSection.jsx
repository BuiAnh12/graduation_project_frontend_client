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

    const handleRemove = (tagId) => {
        const updated = {
            ...data,
            [groupKey]: data[groupKey].filter((tag) => tag._id !== tagId),
        };
        setData(updated);
    };

    const handleAdd = (newTag) => {
        if (data[groupKey].some((t) => t._id === newTag._id)) return;
        const updated = { ...data, [groupKey]: [...data[groupKey], newTag] };
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
                {data[groupKey].map((tag) => (
                    <DisplayTag
                        key={tag._id}
                        tag={tag}
                        onRemove={() => handleRemove(tag._id)}
                    />
                ))}
            </div>

            {/* Modal for selecting tags */}
            {showModal && (
                <AddTagModal
                    tagType={tagType}
                    groupKey={groupKey} 
                    data={data} 
                    onSelect={(tag) => handleAdd(tag)}
                    onClose={() => setShowModal(false)}
                />
            )}
        </div>
    );
}
