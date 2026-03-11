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
/*============ADD ROLE ============*/
export const addRole = createAsyncThunk(
  "roles/addRole",
  async ({ name }, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    try {
      const res = await fetch("http://localhost:5000/blog/roles/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (!res.ok)
        return rejectWithValue(data.message || "somethings is wrong");
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);
export const deleteRole = createAsyncThunk(
  "roles/deleteRole",
  async (id, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    try {
      const res = await fetch(`http://localhost:5000/blog/roles/${id}`, {
        method: "DELETE",
        headers: { Authorization: "Bearer " + token },
      });
      const data = await res.json();
      if (!res.ok) return rejectWithValue(data.message);
      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

/* =================UPDAT ROLE ===========*/
export const updateRole = createAsyncThunk(
  "roles/updateRole",
  async ({ editRoleId: id, editName }, { getState, rejectWithValue }) => {
    const token = getState().auth.token;

    try {
      const res = await fetch(
        `http://localhost:5000/blog/roles/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({ editName }),
        }
      );

      const data = await res.json();

      if (!res.ok) return rejectWithValue(data.message);

      return { id, name: editName };  // ✅ correct return
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
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
      })
      // ADD ROLE
      .addCase(addRole.fulfilled, (s, a) => {
        s.roles.unshift(a.payload);
      })
      // DELETE ROLE
      .addCase(deleteRole.fulfilled, (s, a) => {
        s.roles = s.roles.filter((r) => r.id !== a.payload);
      })
      //UPDATE ROLE
      .addCase(updateRole.fulfilled, (state, action) => {
  const { id, name } = action.payload;

  const role = state.roles.find((r) => r.id === id);
  if (role) {
    role.name = name;
  }
})
  },
});

export default roleSlice.reducer;
