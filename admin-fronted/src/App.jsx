import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { loadUserFromStorage, restoreAuth } from "./Redux/features/auth/authSlice.js";

import AdminLayout from "./layouts/AdminLayout.jsx";
import Login from "./views/auth/Login.jsx";
import Dashboard from "./views/admin/Dashboard.jsx";
import Posts from "./pages/Posts";
import AddPost from "./pages/Addpost";
import Categories from "./pages/Categories";
import Users from "./pages/Users";
import ViewPost from "./pages/Viewpost";
import Comments from "./pages/Comments.jsx";
import Adminprofile from "./pages/Adminprofile.jsx";
import ManageRole from "./pages/ManageRole.jsx";
import EditPost from "./pages/Editpost.jsx";
import AddUser from "./pages/Adduser.jsx";
import UserPost from "./pages/UserPost.jsx";
import UserEdit from "./pages/UserEdit.jsx";
import EditAdminProfile from "./pages/EditAdminProfile.jsx";
import Settings from "./views/admin/Settings.jsx";
import NotFoundPage from "./pages/Notfoundpage.jsx";
import ContactInquiries from "./pages/ContactInquiry.jsx";
import ProtectedRoute from "./layouts/ProtectedRoute.jsx";

function App() {
  const dispatch = useDispatch();
  const { token } = useSelector((s) => s.auth);

useEffect(() => {
  dispatch(restoreAuth());
}, [dispatch]);

  return (
    <Routes>
      {/* Root Redirect */}
      <Route
        path="/"
        element={
          token ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Login */}
      <Route
        path="/login"
        element={token ? <Navigate to="/dashboard" replace /> : <Login />}
      />

      {/* Protected Admin Layout */}
      <Route element={<AdminLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/posts/add" element={<AddPost />} />
        <Route path="/post/:slug" element={<ViewPost />} />
        <Route path="/category" element={<Categories />} />
        <Route path="/edit-post/:slug" element={<EditPost />} />
        <Route path="/comments" element={<Comments />} />
        <Route path="/users" element={<Users />} />
        <Route path="/user-edit" element={<UserEdit />} />
        <Route path="/adduser" element={<AddUser />} />
        <Route path="/profile" element={<ProtectedRoute><Adminprofile /></ProtectedRoute>} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/user-posts" element={<UserPost />} />
        <Route path="/roles" element={<ManageRole />} />
        <Route path="/edit-profile" element={<EditAdminProfile />} />
        <Route path="/inquiry" element={<ContactInquiries />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
