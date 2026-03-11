import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

/* ================= FETCH ================= */
export const fetchAllCategory = createAsyncThunk(
  "category/fetchAll",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;

      const res = await fetch("http://localhost:5000/blog/category", {
        headers: { Authorization: "Bearer " + token },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch categories");
      }

      if (Array.isArray(data)) return data;
      if (Array.isArray(data.categories)) return data.categories;

      return [];
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

/* ================= ADD ================= */
export const addCategory = createAsyncThunk(
  "category/addCategory",
  async ({ name }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;

      const res = await fetch("http://localhost:5000/blog/category/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ name }),
      });

      const data = await res.json(); // ✅ FIXED

      if (!res.ok) return rejectWithValue(data.message);

      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

/* ================= DELETE ================= */
export const deleteCategory = createAsyncThunk(
  "category/deleteCategory",
  async (id, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      console.log(id);

      const res = await fetch(`http://localhost:5000/blog/category/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      const data = await res.json(); // ✅ FIXED

      if (!res.ok) return rejectWithValue(data.message);

      return id; // return id directly
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);
/* ================= UPDATE ================= */
export const updateCategory = createAsyncThunk(
  "category/updateCategory",
  async ({ editId, editName }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;

      const res = await fetch(`http://localhost:5000/blog/category/${editId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ name: editName }),
      });

      const data = await res.json();

      if (!res.ok) return rejectWithValue(data.message);

      return data; // safer
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

/* ================= SLICE ================= */
export const categorySlice = createSlice({
  name: "category",
  initialState: {
    categories: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      /* FETCH */
      .addCase(fetchAllCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchAllCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ADD */
      .addCase(addCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      })

      /* DELETE */
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(
          (c) => c.id !== action.payload,
        );
      })

      /* UPDATE */
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.categories = state.categories.map((c) =>
          c.id === action.meta.arg.editId
            ? { ...c, ...action.payload } // ✅ merge instead of replace
            : c,
        );
      });
  },
});

export default categorySlice.reducer;
