import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../features/auth/authSlice";
import postsSlice from "../features/posts/postsSlice";
import commentSlice from "../features/comments/commentSlice"

import categorySlice  from "../features/category/categorySlice";
import roleSlice from "../features/roles/roleSlice";
export const store = configureStore({
  reducer: {
    auth: authSlice,
    posts: postsSlice,
    category:categorySlice,
    comments:commentSlice,
    roles:roleSlice,
  },
});
