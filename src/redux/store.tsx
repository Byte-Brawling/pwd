import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import conversationsReducer from "./slices/conversationsSlice"
export const store = configureStore({
  reducer: {
    user: userReducer,
    conversations: conversationsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
