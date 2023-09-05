import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
  signOut,
} from "firebase/auth";
import { auth, googleProvider } from "../../utils/firebase.config.js";
import { setUserLoading } from "./authSlice";

export const signInWithEP = createAsyncThunk(
  "auth/signInWithEP",
  async ({ email, password }, thunkAPI) => {
    thunkAPI.dispatch(setUserLoading(true));

    return signInWithEmailAndPassword(auth, email, password);
  }
);

export const signInWithGoogle = createAsyncThunk(
  "auth/signInWithGoogle",
  async (_, thunkAPI) => {
    thunkAPI.dispatch(setUserLoading(true));

    return signInWithPopup(auth, googleProvider);
  }
);

export const createUserWithEP = createAsyncThunk(
  "auth/createUserWithEP",
  async ({ values }, thunkAPI) => {
    thunkAPI.dispatch(setUserLoading(true));

    values.phone = "+880" + values.phone;
    const { fullName, email, password, userImg } = values;

    return createUserWithEmailAndPassword(auth, email, password).then((_) => {
      const formData = new FormData();
      formData.append("userImg", userImg);

      return axios
        .post(`${import.meta.env.VITE_API_URL}/users/upload`, formData)
        .then((response) =>
          updateProfile(auth.currentUser, {
            displayName: fullName,
            photoURL: response.data.filePath,
          })
        );
    });
  }
);

export const logOut = createAsyncThunk("auth/logOut", async (_, thunkAPI) => {
  thunkAPI.dispatch(setUserLoading(true));

  return signOut(auth);
});
