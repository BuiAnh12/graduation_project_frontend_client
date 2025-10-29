"use client";
import React, { useMemo } from "react";

const PreferenceTags = ({ ids, allTags, type }) => {
  const tagNames = useMemo(() => {
    if (!ids || !allTags) return [];
    // Assumes `allTags` is the object { food_tags, taste_tags, ... }
    const allTagArrays = Object.values(allTags || {}).flat();
    return ids
      .map((id) => {
        // Ensure comparison is consistent (string vs string)
        const idString = id.toString();
        const found = allTagArrays.find((tag) => tag._id.toString() === idString);
        return found ? found.name : null;
      })
      .filter(Boolean); // Remove nulls
  }, [ids, allTags]);

  if (tagNames.length === 0) return null;

  // --- Define styles based on type ---
  const config = {
    like: {
      textColor: "text-green-800",
      bgColor: "bg-white",
      pillBgColor: "bg-green-300",
      text: "Phù hợp:",
    },
    warning: {
      textColor: "text-yellow-800",
      bgColor: "bg-white",
      pillBgColor: "bg-yellow-300",
      text: "Cảnh báo:",
    },
    allergy: {
      textColor: "text-red-800",
      bgColor: "bg-white",
      pillBgColor: "bg-red-300",
      text: "Dị ứng:",
    },
  };

  const currentConfig = config[type] || config.warning; // Default to warning

  return (
    // Outer container: rounded, background color, padding, and importantly, flex row
    <div
      className={`mt-1 rounded-md flex items-center flex-wrap gap-1 ${currentConfig.bgColor} ${currentConfig.textColor}`}
    >
      {/* Prefix Text: slightly bolder, same text size */}
      <span className="font-medium text-xs mr-1">{currentConfig.text}</span>

      {/* Mapped Tag Pills */}
      {tagNames.map((name, index) => (
        <span
          key={index}
          // Pill styling: background, padding, rounded shape, text size
          className={`px-2 py-1 rounded-full text-xs ${currentConfig.pillBgColor}`}
        >
          {name}
        </span>
      ))}
    </div>
  );
};

export default PreferenceTags;