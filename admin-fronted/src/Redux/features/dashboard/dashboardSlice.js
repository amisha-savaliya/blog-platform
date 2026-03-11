import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchDashboard = createAsyncThunk(
  "dashboard/fetchDashboard",
  async (range, { getState, rejectWithValue }) => {
    const token = getState().auth.token;

    try {
      const res = await fetch(
        `http://localhost:5000/blog/posts/get?range=${range}`,
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) return rejectWithValue("Failed to fetch dashboard");

      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  posts: [],
  chartStats: [], // 🔥 rename for clarity
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload.posts || [];
        state.chartStats = action.payload.chartStats || [];
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default dashboardSlice.reducer;