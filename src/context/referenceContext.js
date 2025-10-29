"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { userService } from "@/api/userService"; // Corrected path
import { useAuth } from "./authContext";

const ReferenceContext = createContext();

export const ReferenceProvider = ({ children }) => {
  const [userReference, setUserReference] = useState(null);
  const [allTags, setAllTags] = useState(null);
  const [loading, setLoading] = useState(true); // Loading for user-specific data
  const [tagsLoading, setTagsLoading] = useState(true); // Loading for all tags

  const { user } = useAuth();

  // Fetch the current user's saved preferences
  const fetchUserReference = async () => {
    if (user) {
      try {
        setLoading(true);
        const response = await userService.getUserReference();
        setUserReference(response.data);
      } catch (error) {
        setUserReference(null);
        console.error("Lỗi khi lấy sở thích người dùng:", error);
      } finally {
        setLoading(false);
      }
    } else {
      // If no user, reset state
      setUserReference(null);
      setLoading(false);
    }
  };

  // Fetch all available tags (food, taste, etc.) once
  const fetchAllTags = async () => {
    try {
      setTagsLoading(true);
      const response = await userService.getAllTags();
      setAllTags(response.data);
    } catch (error) {
      setAllTags(null);
      console.error("Lỗi khi lấy tất cả tags:", error);
    } finally {
      setTagsLoading(false);
    }
  };

  // Call this when the component mounts to get all tags
  useEffect(() => {
    fetchAllTags();
  }, []);

  // Call this when the user logs in or out
  useEffect(() => {
    fetchUserReference();
  }, [user]);

  // Function to update preferences
  const updateReference = async (data) => {
    try {
      const response = await userService.updateUserReference(data);
      // Update local state immediately with the new data from the server
      setUserReference(response.data);
      return response;
    } catch (error) {
      console.error("Lỗi khi cập nhật sở thích:", error);
      throw error; // Re-throw so the component can handle it (e.g., show a toast)
    }
  };

  // Function to delete/remove preferences
  const deleteReference = async (data) => {
    try {
      const response = await userService.deleteUserReference(data);
      // Update local state with the new data
      setUserReference(response.data);
      return response;
    } catch (error) {
      console.error("Lỗi khi xóa sở thích:", error);
      throw error;
    }
  };

  return (
    <ReferenceContext.Provider
      value={{
        userReference,
        allTags,
        loading,
        tagsLoading,
        fetchUserReference, // Exposing this like refreshCart
        updateReference,
        deleteReference,
      }}
    >
      {children}
    </ReferenceContext.Provider>
  );
};

export const useReference = () => {
  const context = useContext(ReferenceContext);
  if (!context) {
    throw new Error("useReference phải dùng trong <ReferenceProvider>");
  }
  return context;
};