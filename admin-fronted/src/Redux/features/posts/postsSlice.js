import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchDashboard } from "../dashboard/dashboardSlice";



/* ================= FETCH ALL POSTS (PAGINATION + SEARCH) ================= */
export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async ({ search,userId }, { getState, rejectWithValue }) => {
    try {
      const { posts } = getState();
      const { currentPage } = posts;
      const token = getState().auth.token;

      let url = `http://localhost:5000/blog/posts?page=${currentPage}&limit=6`;

      if (search?.trim().length >= 3)
        url += `&search=${encodeURIComponent(search.trim())}`;
      if(userId)
      {
        url+=`&userId=${userId}`
      }

      const res = await fetch(url, {
        headers: { Authorization: "Bearer " + token },
      });

      const data = await res.json();
      if (!res.ok) throw new Error("Failed to fetch posts");

      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);
/* ================= MY POSTS ================= */
export const fetchMyPosts = createAsyncThunk(
  "posts/fetchMyPosts",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const token = auth.token;
      const userId = auth.user?.id;

      if (!token || !userId) throw new Error("Not authenticated");

      const res = await fetch(
        `http://localhost:5000/blog/posts?userId=${userId}`,
        {
          headers: { Authorization: "Bearer " + token },
        },
      );

      const data = await res.json();
      if (!res.ok) throw new Error("Failed to fetch my posts");

      return data.posts;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

/* ================= ADD POST ================= */
export const addPost = createAsyncThunk(
  "posts/addPost",

  async (postData, { rejectWithValue, getState ,dispatch}) => {
    try {
      const token = getState().auth.token;
      const res = await fetch("http://localhost:5000/blog/posts/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(postData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      dispatch(fetchDashboard("all")); 

      return data; // must contain id
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

/* ========= DELETE POST ========= */
export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (slug, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;

      await fetch(`http://localhost:5000/blog/posts/${slug}`, {
        method: "DELETE",
        headers: { Authorization: "Bearer " + token },
      });

      return slug;
    } catch (err) {
      return rejectWithValue(err.message || "Delete failed");
    }
  },
);
/* ================= UPDATE POST ================= */
export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async ({ postId, updatedData }, { rejectWithValue, getState }) => {
    try {
      // console.log(updatedData)
      const token = getState().auth.token;
      const res = await fetch(
        `http://localhost:5000/blog/posts/update/${postId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify(updatedData),
        },
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

/* ================= LIKE POST ================= */
export const likePost = createAsyncThunk(
  "posts/likePost",
  async (postId, { getState }) => {
    const token = getState().auth.token;
    const res = await fetch(`http://localhost:5000/blog/posts/${postId}/like`, {
      method: "POST",
      headers: { Authorization: "Bearer " + token },
    });

    return { postId, ...(await res.json()) };
  },
);

/* ================= SLICE ================= */
const postSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [],
    myPosts: [],
    totalPosts: 0,
    totalPages: 1,
    currentPage: 1,
    loading: false,
    loadingPosts: false,
    error: null,
  },

  reducers: {
    setPage: (s, a) => {
      s.currentPage = a.payload;
    },
  },

  extraReducers: (builder) => {
    builder
     
      .addCase(fetchPosts.pending, (s) => {
        s.loadingPosts = true;
      })
      // allpost
      .addCase(fetchPosts.fulfilled, (s, a) => {
        s.loadingPosts = false;
        s.posts = a.payload.posts;
        s.totalPages = a.payload.totalPages;
      })
      /* MY POSTS */
      .addCase(fetchMyPosts.fulfilled, (s, a) => {
        s.myPosts = a.payload;
      })

      /* LIKE */
      .addCase(likePost.fulfilled, (s, a) => {
        const { postId, liked } = a.payload;
        const update = (p) => {
          p.userLiked = liked ? 1 : 0;
          p.totalLikes += liked ? 1 : -1;
        };

        s.posts.find((p) => p.id === postId) &&
          update(s.posts.find((p) => p.id === postId));
        s.myPosts.find((p) => p.id === postId) &&
          update(s.myPosts.find((p) => p.id === postId));
      })

      /* ADD */
      .addCase(addPost.fulfilled, (s, a) => {
        s.posts.unshift(a.payload);
        s.myPosts.unshift(a.payload);
      })

      /* UPDATE */
      .addCase(updatePost.fulfilled, (s, a) => {
        s.posts = s.posts.map((p) => (p.id === a.payload.id ? a.payload : p));
        s.myPosts = s.myPosts.map((p) =>
          p.id === a.payload.id ? a.payload : p,
        );
      
      
      })

      /* DELETE */
      .addCase(deletePost.fulfilled, (s, a) => {
        s.myPosts = s.myPosts.filter((p) => p.slug !== a.payload);
        s.posts = s.posts.filter((p) => p.slug !== a.payload);
      });
  },
});

export const { setPage } = postSlice.actions;
export default postSlice.reducer;
