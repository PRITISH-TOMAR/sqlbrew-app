import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/authSlice";
import themeReducer from "./slices/themeSlice";

export const store = configureStore({
  reducer: {
    auth: userReducer,
    theme: themeReducer,
  },
});
