import React, { useEffect, useState } from "react";
import TagGroupSection from "./TagGroupSection";
import { userService } from "@/api/userService";
import { toast } from "react-toastify";

export default function UserReferenceEditor() {
    const [userRef, setUserRef] = useState(null);
    const [original, setOriginal] = useState(null);
    const [hasChanges, setHasChanges] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const res = await userService.getUserReference(); // returns { success, data }
                console.log(res);
                setUserRef(res.data);
                setOriginal(JSON.parse(JSON.stringify(res.data)));
            } catch (err) {
                console.error("Failed to fetch user reference", err);
            }
        })();
    }, []);

    useEffect(() => {
        if (!userRef || !original) return;

        const changed = Object.keys(userRef).some((key) => {
            if (Array.isArray(userRef[key]) && Array.isArray(original[key])) {
                const currIds = userRef[key].map((t) => t._id);
                const origIds = original[key].map((t) => t._id);
                return currIds.sort().join(",") !== origIds.sort().join(",");
            }
            return false;
        });

        setHasChanges(changed);
    }, [userRef, original]);

    const handleUpdate = async () => {
        try {
            setLoading(true);
            await userService.updateUserReference(userRef);
            setOriginal(JSON.parse(JSON.stringify(userRef)));
            setHasChanges(false);
            // toast.success("Cập nhật thành công")
        } catch (err) {
            console.error("Update failed:", err);
            // toast.error("Cập nhật thất bại")
        } finally {
            setLoading(false);
        }
    };

    if (!userRef) return <p>Loading...</p>;

    return (
        <div className="p-5 space-y-6">
            <h2 className="text-2xl font-semibold">
                {" "}
                Sở thích của người dùng{" "}
            </h2>

            {/* Render each group */}
            <TagGroupSection
                title="Dị ứng"
                groupKey="allergy"
                data={userRef}
                setData={setUserRef}
                tagType="food_tags"
            />
            <TagGroupSection
                title="Khẩu vi không thích"
                groupKey="dislike_taste"
                data={userRef}
                setData={setUserRef}
                tagType="taste_tags"
            />
            <TagGroupSection
                title="Thực phẩm không thích"
                groupKey="dislike_food"
                data={userRef}
                setData={setUserRef}
                tagType="food_tags"
            />
            <TagGroupSection
                title="Văn hóa không thích"
                groupKey="dislike_culture"
                data={userRef}
                setData={setUserRef}
                tagType="culture_tags"
            />
            <TagGroupSection
                title="Khẩu vị ưa thích"
                groupKey="like_taste"
                data={userRef}
                setData={setUserRef}
                tagType="taste_tags"
            />
            <TagGroupSection 
                title="Cách chế biến không thích"
                groupKey="dislike_cooking_method" 
                data={userRef}
                setData={setUserRef}
                tagType="cooking_method_tags"
            />
            <TagGroupSection
                title="Thực phẩm thích"
                groupKey="like_food"
                data={userRef}
                setData={setUserRef}
                tagType="food_tags"
            />
            <TagGroupSection
                title="Văn hóa yêu thích"
                groupKey="like_culture"
                data={userRef}
                setData={setUserRef}
                tagType="culture_tags"
            />
            <TagGroupSection 
                title="Cách chế biến yêu thích"
                groupKey="like_cooking_method" 
                data={userRef}
                setData={setUserRef}
                tagType="cooking_method_tags"
            />

            <button
                onClick={handleUpdate}
                disabled={!hasChanges || loading}
                className={`mt-4 text-center font-semibold w-full py-[14px] rounded-full shadow-md transition-all ${
                    !hasChanges
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-gradient-to-r from-[#e50914] to-[#ff4040] text-white hover:shadow-lg active:scale-[0.98]"
                }`}
            >
                {loading ? "Đang cập nhật..." : "Cập nhật"}
            </button>
        </div>
    );
}
