import { Routes, Route, Navigate } from "react-router-dom";

import AdminNavbar from "../components/Navbars/AdminNavbar.jsx";
import Sidebar from "../components/Sidebar/Sidebar.jsx";
import FooterAdmin from "../components/Footers/FooterAdmin.jsx";

import Dashboard from "../views/admin/Dashboard.jsx";
import Settings from "../views/admin/Settings.jsx";

import Posts from "../pages/Posts";
import AddPost from "../pages/Addpost";
import Categories from "../pages/Categories";
import Users from "../pages/Users";
import ViewPost from "../pages/Viewpost";
import Comments from "../pages/Comments.jsx";
import Adminprofile from "../pages/Adminprofile.jsx";
import ManageRole from "../pages/ManageRole.jsx";
import EditPost from "../pages/Editpost.jsx";
import AddUser from "../pages/Adduser.jsx";
import UserPost from "../pages/UserPost.jsx";
import UserEdit from "../pages/UserEdit.jsx";
import EditAdminProfile from "../pages/EditAdminProfile.jsx";
import NotFoundPage from "../pages/Notfoundpage.jsx";
import { useState } from "react";

export default function Admindesh() {
  const token = localStorage.getItem("admintoken");
    const [sidebarOpen, setSidebarOpen] = useState(false);




  if (!token) return <Navigate to="/admin/login" replace />;



  return (
    <div className="min-h-screen bg-blueGray-100">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

<div className="flex flex-col min-h-screen md:ml-64">
  <AdminNavbar />

       <main className="flex-1 px-4 md:px-10 pt-20 md:pt-6 overflow-x-hidden">


          <Routes>
            <Route index element={<Navigate to="dashboard" replace />} />

            <Route path="dashboard" element={<Dashboard />} />
            <Route path="posts" element={<Posts />} />
            <Route path="posts/add" element={<AddPost />} />
            <Route path="post/:slug" element={<ViewPost />} />
            <Route path="category" element={<Categories />} />
            <Route path="edit-post/:slug" element={<EditPost />} />
            <Route path="comments" element={<Comments />} />
            <Route path="users" element={<Users />} />
            <Route path="user-edit" element={<UserEdit />} />
            <Route path="adduser" element={<AddUser />} />
            <Route path="profile" element={<Adminprofile />} />
            <Route path="settings" element={<Settings />} />
            <Route path="user-posts" element={<UserPost />} />
            <Route path="roles" element={<ManageRole />} />
            <Route path="edit-profile" element={<EditAdminProfile />} />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        {/* FOOTER */}
        <FooterAdmin />
      </div>
    </div>
  );
}
