import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { jwtDecode }from 'jwt-decode'

/* ---------- initial state ---------- */

const token=localStorage.getItem("adminToken") || null;
const initialState = {
  token: token || null,
  user:token ? jwtDecode(token) : null,
  loading: false,
  error: null,
  role: null,
};

/* ---------- async login ---------- */
export const loginAdmin = createAsyncThunk(
  "auth/loginAdmin",
  async (form, { rejectWithValue }) => {
    try {
      const res = await fetch("http://localhost:5000/blog/auth/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      console.log(data);
      if (!res.ok) return rejectWithValue("Invalid Email or Password");

      if (data.user?.role !== "admin") {
        return rejectWithValue("Not an admin account");
      }

      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("role", data.user.role);

      return data;
    } catch (err) {
      return rejectWithValue(err.msg || "Something went wrong");
    }
  },
);
export const restoreAuth = createAsyncThunk(
  "auth/restoreAuth",
  async (_, { dispatch }) => {
    const token = localStorage.getItem("adminToken");
    if (!token) return null;

    const decoded = jwtDecode(token);

    return {
      token,
      user: decoded,
    };
  }
);


/* ================= UPDATE ADMIN PROFILE ================= */

export const updateAdminProfile = createAsyncThunk(
  "auth/updateAdminProfile",
  async ({ userId, updateData }, { getState, rejectWithValue }) => {
    const token = getState().auth.token;

    try {
      const res = await fetch(
        `http://localhost:5000/blog/users/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify(updateData),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        return rejectWithValue(data.msg || "Update failed");
      }

      return data; // return updated user + token if backend sends it
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.error = null;
      ((state.role = null), localStorage.removeItem("adminToken"));
    },
    loadUserFromStorage(state) {
      const token = localStorage.getItem("adminToken");

      if (token && state.token !== token) {
        state.token = token;
      }
    },
    clearError(state) {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.role = action.payload.user.role; //  role here
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      //RESTORE AUTH
      .addCase(restoreAuth.fulfilled, (state, action) => {
  if (action.payload) {
    state.token = action.payload.token;
    state.user = action.payload.user;
  }
})
      // MY PROFILE
   .addCase(updateAdminProfile.pending, (state) => {
  state.loading = true;
})
.addCase(updateAdminProfile.fulfilled, (state, action) => {
  state.loading = false;

  // update user in redux
  state.user = action.payload.user;

  // update token if backend sends new token
  if (action.payload.token) {
    state.token = action.payload.token;
    localStorage.setItem("adminToken", action.payload.token);
  }
})
.addCase(updateAdminProfile.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
})
  },
});

export const {
  logout,
  loadUserFromStorage,
  clearError,
  startImpersonation,
  stopImpersonation,
} = authSlice.actions;
export default authSlice.reducer;
