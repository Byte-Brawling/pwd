import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: null,
  email: null,
  fullName: null,
  avatar: null,
  preferredVoice: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      return { ...state, ...action.payload };
    },
    clearUser: () => initialState,
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
