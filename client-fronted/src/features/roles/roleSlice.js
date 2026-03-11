import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

/* ================= FETCH ROLES ================= */
export const fetchRoles = createAsyncThunk(
  "roles/fetchRoles",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("http://localhost:5000/blog/roles");

      const data = await res.json();
      //   console.log(data)

      if (!res.ok) {
        return rejectWithValue(data.message || "Failed to fetch roles");
      }

      return data; // must return roles array
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

/* ================= SLICE ================= */
export const roleSlice = createSlice({
  name: "roles",
  initialState: {
    roles: [],
    loading: false,
    error: null,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchRoles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.loading = false;
        state.roles = action.payload;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.loading = false; // ✅ fixed
        state.error = action.payload;
      });
  },
});

export default roleSlice.reducer;
