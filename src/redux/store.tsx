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

import { AppDispatch, RootState } from "@/redux/store";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
