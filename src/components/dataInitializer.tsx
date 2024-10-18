// src/components/DataInitializer.tsx
"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useUser } from "@clerk/nextjs";
import { setUser } from "@/redux/slices/userSlice";
import { setFriends } from "@/redux/slices/friendsSlice";
import { setConversations } from "@/redux/slices/conversationsSlice";
import {
  createUser,
  fetchUserFriends,
  fetchUserConversations,
} from "@/lib/api";

const DataInitializer: React.FC = () => {
  const dispatch = useDispatch();
  const { user: clerkUser, isLoaded: isUserLoaded } = useUser();

  useEffect(() => {
    const initializeData = async () => {
      if (isUserLoaded && clerkUser) {
        try {
          // Create or update user
          const user = await createUser();
          dispatch(setUser(user));
          console.log(`Your user id is ${user.id}`);

          // Fetch friends
          const friends = await fetchUserFriends(user.id);
          dispatch(setFriends(friends));

          // Fetch conversations
          const conversations = await fetchUserConversations(user.id);
          dispatch(setConversations(conversations));
        } catch (error) {
          console.error("Error initializing data:", error);
        }
      }
    };

    initializeData();
  }, [dispatch, clerkUser, isUserLoaded]);

  return null; // This component doesn't render anything
};

export default DataInitializer;
