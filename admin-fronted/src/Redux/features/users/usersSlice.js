import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

/* ================= FETCH USERS ================= */

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;

      const res = await fetch("http://localhost:5000/blog/users/adminuser", {
        headers: { Authorization: "Bearer " + token },
      });

      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("adminToken");
        return rejectWithValue("Unauthorized");
      }

      const data = await res.json();

      if (!res.ok) {
        return rejectWithValue(data.msg || "Failed to fetch users");
      }

      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

/* =================FETCH SINGLE USER ===========*/
export const fetchSingleUser = createAsyncThunk(
  "users/fetchSingleUser",
  async (userId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      console.log("id of slice ",userId)

      const res = await fetch(
        `http://localhost:5000/blog/users/adminuser?id=${userId}`,
        {
          headers: { Authorization: "Bearer " + token },
        },
      );

      const data = await res.json();
      console.log(data);

      if (!res.ok) {
        return rejectWithValue(data.msg || "Failed to fetch user");
      }

      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);
// /* =================FETCH ADMIN USER ===========*/
// export const fetchAdmin = createAsyncThunk(
//   "users/fetchAdmin",
//   async (_, { getState, rejectWithValue }) => {
//     try {
//       const token = getState().auth.token;
//       const userId=getState().auth.user.id;
//       // console.log(userId)

//       const res = await fetch(
//         `http://localhost:5000/blog/users/adminuser?id=${userId}`,
//         {
//           headers: { Authorization: "Bearer " + token },
//         },
//       );

//       const data = await res.json();
//       console.log(data);

//       if (!res.ok) {
//         return rejectWithValue(data.msg || "Failed to fetch user");
//       }

//       return data;
//     } catch (err) {
//       return rejectWithValue(err.message);
//     }
//   },
// );
/*================ IMPERSONATE USER ==============*/

export const impersonateUser = createAsyncThunk(
  "users/impersonateUser",
  async (id, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;

      const res = await fetch(`http://localhost:5000/blog/impersonate/${id}`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (!res.ok) {
        return rejectWithValue(data.msg || "Impersonation failed");
      }

      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

/* =============== UPDATE USER ==================*/
export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ id, updateData }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;

      const res = await fetch(
        `http://localhost:5000/blog/users/adminuser/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify(updateData),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        return rejectWithValue(data.msg || "Update failed");
      }

      return { id, ...updateData };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

/* ================= DELETE USER ================= */

export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (id, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;

      const res = await fetch(`http://localhost:5000/blog/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: "Bearer " + token },
      });

      const data = await res.json();

      if (!res.ok) {
        return rejectWithValue(data.msg || "Delete failed");
      }

      return id; // ✅ return id directly (cleaner)
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);
/*=========BLOCK ==========*/
export const blockUser = createAsyncThunk(
  "users/blockUser",
  async (id, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const res = await fetch(`http://localhost:5000/blog/users/block/${id}`, {
        method: "PUT",
        headers: { Authorization: "Bearer " + token },
      });
      const data = await res.json();

      if (!res.ok) {
        return rejectWithValue(data.msg || "Failed to block");
      }
      return id;
    } catch (err) {
      rejectWithValue(err.msg);
    }
  },
);
/*=========UNBLOCK ==========*/
export const unblockUser = createAsyncThunk(
  "users/unblockUser",
  async (id, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const res = await fetch(
        `http://localhost:5000/blog/users/unblock/${id}`,
        {
          method: "PUT",
          headers: { Authorization: "Bearer " + token },
        },
      );
      const data = await res.json();

      if (!res.ok) {
        return rejectWithValue(data.msg || "Failed to block");
      }
      return id;
    } catch (err) {
      rejectWithValue(err.msg);
    }
  },
);
/*=============INVITE USER ==============*/

export const inviteUser = createAsyncThunk(
  "users/inviteUser",
  async ({ email, role }, { getState, rejectWithValue }) => {
    const token = getState().auth.token;

    try {
      const res = await fetch("http://localhost:5000/blog/invite-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        return rejectWithValue(data.message || "Invite failed");
      }

      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);
/* ================= SLICE ================= */

export const userSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    selectedUser: null,
    adminData:null,
    successMessage:null,
    loading: false,
    error: null,
    actionLoading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DELETE
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user.id !== action.payload);
      })
      //  BLOCK
      .addCase(blockUser.fulfilled, (state, action) => {
        const user = state.users.find((u) => u.id === action.payload);
        if (user) {
          user.is_blocked = 1;
        }
      })
      //UNBLOCK

      .addCase(unblockUser.fulfilled, (state, action) => {
        const user = state.users.find((u) => u.id === action.payload);
        if (user) {
          user.is_blocked = 0;
        }
      })
      // FETCH SINGLE
      .addCase(fetchSingleUser.fulfilled, (state, action) => {
        state.selectedUser = action.payload;
      })
        // FETCH SINGLE
      // .addCase(fetchAdmin.fulfilled, (state, action) => {
      //   state.adminData = action.payload;
      // })

      // UPDATE
      .addCase(updateUser.fulfilled, (state, action) => {
        const { id, ...updates } = action.payload;

        const user = state.users.find((u) => u.id === id);
        if (user) {
          Object.assign(user, updates);
        }

        if (state.selectedUser?.id === id) {
          Object.assign(state.selectedUser, updates);
        }
      })
      //IMPERSONATE USER
      .addCase(impersonateUser.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(impersonateUser.fulfilled, (state) => {
        state.actionLoading = false;
      })
      .addCase(impersonateUser.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })
      //INVITE USER
      .addCase(inviteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(inviteUser.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = "Invitation email sent successfully!";
      })
      .addCase(inviteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
