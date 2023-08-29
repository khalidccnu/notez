import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isUserLoading: true,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserLoading: (state, action) => {
      state.isUserLoading = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { setUserLoading, setUser } = authSlice.actions;
export default authSlice.reducer;
