import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

/* ================= HELPER ================= */
const getToken = (getState) => getState().auth.token;

/* ================= FETCH ALL COMMENTS ================= */
export const fetchAllComments = createAsyncThunk(
  "comments/fetchAllComments",
  async (_, { getState, rejectWithValue }) => {
    try {
      const res = await fetch(
        `http://localhost:5000/blog/comments`,
        {
          headers: {
            Authorization: "Bearer " + getToken(getState),
          },
        },
      );

      const data = await res.json();

        if (res.status === 401) {
        localStorage.removeItem("adminToken");
       
        return;
      }

      if (!res.ok)
        return rejectWithValue(data.message || "Failed to fetch comments");
      

      return data; 
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);




/* ================= FETCH COMMENTS ================= */
export const fetchComments = createAsyncThunk(
  "comments/fetchComments",
  async ({ postId }, { getState, rejectWithValue }) => {
    try {
      const res = await fetch(
        `http://localhost:5000/blog/comments?post_id=${postId}`,
        {
          headers: {
            Authorization: "Bearer " + getToken(getState),
          },
        },
      );

      const data = await res.json();

      if (!res.ok)
        return rejectWithValue(data.message || "Failed to fetch comments");

      return { postId, comments: data }; // wrap with postId
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

/* ================= ADD COMMENT ================= */
export const addComment = createAsyncThunk(
  "comments/addComment",
  async ({ postId, content }, { getState, rejectWithValue }) => {
    try {
      const res = await fetch("http://localhost:5000/blog/comments/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + getToken(getState),
        },
        body: JSON.stringify({ post_id: postId, comment: content }),
      });

      const data = await res.json();

      if (!res.ok)
        return rejectWithValue(data.message || "Failed to add comment");

      return { postId, comment: data };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

/* ================= DELETE COMMENT ================= */
export const deleteComment = createAsyncThunk(
  "comments/deleteComment",
  async ({ commentId }, { getState, rejectWithValue }) => {
    try {
      const res = await fetch(
        `http://localhost:5000/blog/comments/${commentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + getToken(getState),
          },
        },
      );

      if (!res.ok) return rejectWithValue("Failed to delete comment");

      return { commentId};
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

/* ===================UPDATE ===================*/
export const updateComment = createAsyncThunk(
  "comments/updateComment",
  async ({ commentId, postId, content }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;

      const res = await fetch(`http://localhost:5000/blog/comments/${commentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({ comment: content }),
        },
      );

      const data = await res.json();

      if (!res.ok) return rejectWithValue(data.message || "Failed to update");

      return { commentId, postId, updated: data };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

/* ================= SLICE ================= */
const commentSlice = createSlice({
  name: "comments",

  initialState: {
    comments:[],
    commentsByPost: {}, //  store comments per post
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      /* FETCH */
      .addCase(fetchComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.loading = false;
        state.commentsByPost[action.payload.postId] = action.payload.comments;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // FETCH ALL COMMENT
      .addCase(fetchAllComments.fulfilled,(s,a)=>
      {
        s.comments=a.payload;
      })

      /* ADD (Optimistic) */
      .addCase(addComment.fulfilled, (state, action) => {
        const { postId, comment } = action.payload;

        if (!state.commentsByPost[postId]) {
          state.commentsByPost[postId] = [];
        }

        state.commentsByPost[postId].unshift(comment);
        state.comments.unshift(comment);
      })

      /* DELETE */
      .addCase(deleteComment.fulfilled, (state, action) => {
        const { commentId, postId } = action.payload;

        if (state.commentsByPost[postId]) {
          state.commentsByPost[postId] = state.commentsByPost[postId].filter(
            (c) => c.id !== commentId,
          );
        }
         if (state.comments) {
          state.comments = state.comments.filter(
            (c) => c.id !== commentId,
          );
        }
      })
      //   UPDATE
     .addCase(updateComment.fulfilled, (state, action) => {
  const { postId, commentId, updated } = action.payload;

  if (state.commentsByPost[postId]) {
    state.commentsByPost[postId] =
      state.commentsByPost[postId].map((c) =>
        
        c.id === commentId ? { ...c, ...updated } : c
      );
  }
    if (state.comments) {
    state.comments =
      state.comments.map((c) =>
        
        c.id === commentId ? { ...c, ...updated } : c
      );
  }
});
  },
});

export default commentSlice.reducer;
