import { configureStore } from "@reduxjs/toolkit";
import thunkMiddleware from "redux-thunk";
import authSlice from "./auth/authSlice.js";
import notesSlice from "./notes/notesSlice.js";

const store = configureStore({
  reducer: {
    authSlice,
    notesSlice,
  },
  middleware: [thunkMiddleware],
});

export default store;
