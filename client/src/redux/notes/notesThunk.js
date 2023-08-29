import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchNotes = createAsyncThunk(
  "notes/fetchNotes",
  ({ userId, title, category, currentPage, notesPerPage }) => {
    return axios
      .get(
        `${
          import.meta.env.VITE_API_URL
        }/self/notes/${userId}?title=${title}&category=${category}&page=${currentPage}&limit=${notesPerPage}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("_at")}`,
          },
        }
      )
      .then((response) => response.data);
  }
);
