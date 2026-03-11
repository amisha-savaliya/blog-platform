import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { selectActiveToken, selectActiveUser } from "../auth/authSlice";


/* ================= HERO POSTS ================= */
export const fetchHeroPosts = createAsyncThunk(
  "posts/fetchHeroPosts",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = selectActiveToken(getState());

      const res = await fetch("http://localhost:5000/blog/posts/heropost", {
        headers: { Authorization: "Bearer " + token },
      });

      const data = await res.json();
      if (!res.ok) throw new Error("Failed to fetch hero posts");

      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

/* ================= CATEGORY POSTS ================= */
export const fetchCategoryPosts = createAsyncThunk(
  "posts/fetchCategoryPosts",
  async (category, { getState, rejectWithValue }) => {
    try {
      const token = selectActiveToken(getState());
      const res = await fetch(
        `http://localhost:5000/blog/posts?category=${category}`,
        {
          headers: { Authorization: "Bearer " + token },
        },
      );

      const data = await res.json();
      if (!res.ok) throw new Error("Failed to fetch category posts");

      return data.posts; // IMPORTANT
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

/* ================= BLOG POSTS (PAGINATION + SEARCH) ================= */
export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async ({ search }, { getState, rejectWithValue }) => {
    try {
      const { posts } = getState();
      const { currentPage, selectedCategory } = posts;
      const token = selectActiveToken(getState());

      let url = `http://localhost:5000/blog/posts?page=${currentPage}&limit=6`;

      if (selectedCategory) url += `&category=${selectedCategory}`;
      if (search?.trim().length >= 3)
        url += `&search=${encodeURIComponent(search.trim())}`;

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

/* ================= LIKE POST ================= */
export const likePost = createAsyncThunk(
  "posts/likePost", 
  async (postId ,{getState})=> {
  const token = selectActiveToken(getState());
  const res = await fetch(`http://localhost:5000/blog/posts/${postId}/like`, {
    method: "POST",
    headers: { Authorization: "Bearer " + token },
  });

  return { postId, ...(await res.json()) };
});

/* ================= MY POSTS ================= */
export const fetchMyPosts = createAsyncThunk(
  "posts/fetchMyPosts",
  async (_, { getState, rejectWithValue }) => {
    try {
     
      const token = selectActiveToken(getState());
      const user=selectActiveUser(getState());
      const userId = user?.id;

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
  async (postData, {getState, rejectWithValue }) => {
    const token=selectActiveToken(getState())
    try {
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

      return data; // must contain id
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

/* ================= UPDATE POST ================= */
export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async ({ postId, updatedData }, {getState, rejectWithValue }) => {
    const token=selectActiveToken(getState())
    try {
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

/* ================= DELETE POST ================= */
export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (slug, { getState }) => {
   const token=selectActiveToken(getState())

    await fetch(`http://localhost:5000/blog/posts/${slug}`, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + token },
    });

    return slug;
  },
);

/* ================= SLICE ================= */
const postSlice = createSlice({
  name: "posts",
  initialState: {
    heroPosts: [],
    categoryPosts: [],
    posts: [],
    myPosts: [],
    currentPage: 1,
    totalPages: 1,
    selectedCategory: "",
    loading: false,
    error: null,
  },

  reducers: {
    setCategory(state, action) {
      state.selectedCategory = action.payload;
      state.currentPage = 1;
    },
    setPage(state, action) {
      state.currentPage = action.payload;
    },
    setSearch(state, action) {
      state.search = action.payload;
      state.currentPage = 1;
    },
  },

  extraReducers: (builder) => {
    builder
      /* HERO */
      .addCase(fetchHeroPosts.pending, (s) => {
        s.loading = true;
      })
      .addCase(fetchHeroPosts.fulfilled, (s, a) => {
        s.loading = false;
        s.heroPosts = a.payload;
      })

      /* CATEGORY */
      .addCase(fetchCategoryPosts.fulfilled, (s, a) => {
        s.categoryPosts = a.payload;
      })

      /* BLOG POSTS */
      .addCase(fetchPosts.pending, (s) => {
        s.loading = true;
      })
      .addCase(fetchPosts.fulfilled, (s, a) => {
        s.loading = false;
        s.posts = a.payload.posts;
        s.totalPages = a.payload.totalPages;
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

      /* MY POSTS */
      .addCase(fetchMyPosts.fulfilled, (s, a) => {
        s.myPosts = a.payload;
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
        s.heroPosts = s.heroPosts.map((p) =>
          p.id === a.updatePost.id ? a.payload : p,
        );
        s.categoryPosts = s.categoryPosts.map((p) =>
          p.id === a.updatePost.id ? a.payload : p,
        );
      })

      /* DELETE */
      .addCase(deletePost.fulfilled, (s, a) => {
        s.myPosts = s.myPosts.filter((p) => p.slug !== a.payload);
      });
  },
});

export const { setCategory, setPage, setSearch } = postSlice.actions;
export default postSlice.reducer;
