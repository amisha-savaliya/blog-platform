import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../features/auth/authSlice";
import postsSlice from "../features/posts/postsSlice";
import commentSlice from "../features/comments/commentSlice"

import categorySlice  from "../features/category/categorySlice";
import roleSlice from "../features/roles/roleSlice";
import  userSlice  from "../features/users/usersSlice";
import dashboardSlice from "../features/dashboard/dashboardSlice"
export const store = configureStore({
  reducer: {
    auth: authSlice,
    posts: postsSlice,
    users: userSlice,
    category:categorySlice,
    comments:commentSlice,
    roles:roleSlice,
    dashboard:dashboardSlice,
  },
});
