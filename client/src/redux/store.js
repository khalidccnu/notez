import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./auth/authSlice.js";
import notesSlice from "./notes/notesSlice.js";

const store = configureStore({
  reducer: {
    authSlice,
    notesSlice,
  },
});

export default store;
