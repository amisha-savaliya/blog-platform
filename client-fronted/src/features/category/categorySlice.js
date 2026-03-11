import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { selectActiveToken } from "../auth/authSlice";

export const fetchAllCategory = createAsyncThunk(
  "category/fetchAll",
  async (_, { getState, rejectWithValue }) => {
    try {
    const token=selectActiveToken(getState())

      const res = await fetch("http://localhost:5000/blog/category", {
        headers: { Authorization: "Bearer " + token },
      });

      const data = await res.json();

      //   console.log("CATEGORY API RESPONSE 👉", data); //  DEBUG LINE

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch categories");
      }

      // ✅ normalize response
      if (Array.isArray(data)) return data;
      if (Array.isArray(data.categories)) return data.categories;

      return []; // fallback
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const fetchPostsByCategory = createAsyncThunk(
  "category/fetchPostByCategory",
  async ({ name, page, limit }, { getState, rejectWithValue }) => {
    try {
      const token=selectActiveToken(getState())
      const res = await fetch(
        `http://localhost:5000/blog/category/${name}?page=${page}&limit=${limit}`,
        {
          headers: { Authorization: "Bearer " + token },
        },
      );

      const data = res.json();
      if (!res.ok) return rejectWithValue(data.message);
      return data;
    } catch (err) {
      rejectWithValue(err.message);
    }
  },
);

export const categorySlice = createSlice({
  name: "category",
  initialState: {
    categories: [],
    posts: [],
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
  },
  reducers: {
    setPage(state, action) {
      state.currentPage = action.payload;
    },
    resetPage(state) {
      state.currentPage = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchAllCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchPostsByCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPostsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload.posts || [];
        state.totalPages = action.payload.totalPages || 1;
      })
      .addCase(fetchPostsByCategory.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setPage, resetPage } = categorySlice.actions;

export default categorySlice.reducer;
