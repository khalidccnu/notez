import { createSlice } from "@reduxjs/toolkit";
import { fetchNotes } from "./notesThunk.js";

const initialState = {
  isLoading: true,
  notes: [],
  error: null,
};

const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotes.pending, (state) => {
        state.notes = [];
        state.error = null;
      })
      .addCase(fetchNotes.fulfilled, (state, action) => {
        state.notes = action.payload;
      })
      .addCase(fetchNotes.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export const { setLoading } = notesSlice.actions;
export default notesSlice.reducer;
