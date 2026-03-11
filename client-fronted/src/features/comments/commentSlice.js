import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { selectActiveToken } from "../auth/authSlice";



/* ================= FETCH COMMENTS ================= */
export const fetchComments = createAsyncThunk(
  "comments/fetchComments",
  async ({ postId }, { getState, rejectWithValue }) => {
    try {
      const token=selectActiveToken(getState())
      const res = await fetch(
        `http://localhost:5000/blog/comments?post_id=${postId}`,
        {
          headers: {
            Authorization: "Bearer " + token,
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
    const token=selectActiveToken(getState())
    try {
      const res = await fetch("http://localhost:5000/blog/comments/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
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
  async ({ commentId, postId }, { getState, rejectWithValue }) => {
    try {
      const token=selectActiveToken(getState())
      const res = await fetch(
        `http://localhost:5000/blog/comments/${commentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + token,
          },
        },
      );

      if (!res.ok) return rejectWithValue("Failed to delete comment");

      return { commentId, postId };
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
      const token=selectActiveToken(getState())

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

      /* ADD (Optimistic) */
      .addCase(addComment.fulfilled, (state, action) => {
        const { postId, comment } = action.payload;

        if (!state.commentsByPost[postId]) {
          state.commentsByPost[postId] = [];
        }

        state.commentsByPost[postId].unshift(comment);
      })

      /* DELETE */
      .addCase(deleteComment.fulfilled, (state, action) => {
        const { commentId, postId } = action.payload;

        if (state.commentsByPost[postId]) {
          state.commentsByPost[postId] = state.commentsByPost[postId].filter(
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
});
  },
});

export default commentSlice.reducer;
