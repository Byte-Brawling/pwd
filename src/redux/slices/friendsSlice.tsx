// src/store/friendsSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Friend {
  id: string;
  fullName: string;
  avatar: string | null;
}

interface FriendsState {
  list: Friend[];
}

const initialState: FriendsState = {
  list: [],
};

const friendsSlice = createSlice({
  name: "friends",
  initialState,
  reducers: {
    setFriends: (state, action: PayloadAction<Friend[]>) => {
      state.list = action.payload;
    },
    addFriend: (state, action: PayloadAction<Friend>) => {
      state.list.push(action.payload);
    },
  },
});

export const { setFriends, addFriend } = friendsSlice.actions;
export default friendsSlice.reducer;
