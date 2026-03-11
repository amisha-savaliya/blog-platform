import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

/* ---------- initial state ---------- */

const initialState = {
  user: null,
  token: localStorage.getItem("token") || null,

  impersonateUser: null,
  impersonateToken: sessionStorage.getItem("impersonateToken") || null,

  role: null,
  loading: false,
  error: null,
  isImpersonating: !!sessionStorage.getItem("impersonateToken"),

  ProfileLoader: false,
};
/* ---------- async login ---------- */
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (form, { rejectWithValue }) => {
    const res = await fetch("http://localhost:5000/blog/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (!res.ok) return rejectWithValue(data.msg);

    localStorage.setItem("token", data.token);
    localStorage.setItem("current_id", JSON.stringify(data.user));

    return data;
  },
);

export const selectActiveUser = (state) =>
  state.auth.isImpersonating ? state.auth.impersonateUser : state.auth.user;

export const selectActiveToken = (state) =>
  state.auth.isImpersonating ? state.auth.impersonateToken : state.auth.token;

export const fetchProfile = createAsyncThunk(
  "auth/fetchProfile",
  async (_, { getState, rejectWithValue }) => {
    const state = getState().auth;
    
    const token = state.isImpersonating ? state.impersonateToken : state.token;
    if (!token) return rejectWithValue("no token found");

    try {
      const res = await fetch("http://localhost:5000/blog/users/profile", {
        headers: { Authorization: "Bearer " + token },
      });

      if (!res.ok) throw new Error("Unauthorized");
      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.role = null;
      state.error = null;

      localStorage.removeItem("token");
      sessionStorage.removeItem("impersonateToken");

      state.impersonateToken = null;
      state.isImpersonating = false;
    },
    loadUserFromStorage(state) {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("current_id");

      if (token && user) {
        state.token = token;
        state.user = JSON.parse(user);
      }

      // restore impersonation
      const impToken = sessionStorage.getItem("impersonateToken");
      const isImp = sessionStorage.getItem("isImpersonating");

      if (impToken && isImp === "true") {
        state.impersonateToken = impToken;
        state.isImpersonating = true;
      }
    },
    setCredentials(state, action) {
      state.impersonateUser = action.payload.user;
      state.impersonateToken = action.payload.token;
      state.isImpersonating = true;

      // store impersonation separately
      sessionStorage.setItem("impersonateToken", action.payload.token);
      sessionStorage.setItem("isImpersonating", "true");
    },

    setImpersonating(state, action) {
      state.isImpersonating = action.payload;
    },

    stopImpersonation(state) {
      state.isImpersonating = false;
      state.impersonateUser = null;
      state.impersonateToken = null;

      sessionStorage.removeItem("impersonateToken");
      sessionStorage.removeItem("isImpersonating");
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;

        if (state.isImpersonating) {
          state.impersonateUser = action.payload.user;
          state.isImpersonating = true;
        } else {
          state.user = action.payload.user;
        }
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.role = action.payload.role;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  logout,
  loadUserFromStorage,
  setCredentials,
  setImpersonating,
  stopImpersonation,
} = authSlice.actions;
export default authSlice.reducer;
