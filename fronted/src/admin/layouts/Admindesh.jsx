import { Routes, Route, Navigate } from "react-router-dom";

import AdminNavbar from "../components/Navbars/AdminNavbar.jsx";
import Sidebar from "../components/Sidebar/Sidebar.jsx";
import HeaderStats from "../components/Headers/HeaderStats.jsx";
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
import EditProfile from "../../Pages/Editprofile.jsx";
import EditPost from "../pages/Editpost.jsx";

import AddUser from "../pages/Adduser.jsx";
import UserPost from "../pages/UserPost.jsx";
import UserEdit from "../pages/UserEdit.jsx";
import EditAdminProfile from "../pages/EditAdminProfile.jsx";
import NotFoundPage from "../pages/Notfoundpage.jsx";
import AdminLogin from "../views/auth/Login.jsx";




export default function Admindesh() {
  const token = localStorage.getItem("admintoken");

  if (!token) {
    return <Navigate to="/admin/login" replace element={<AdminLogin />}/>;
  }
  return (
    <div className="min-h-screen bg-blueGray-100 flex w-full">
      <Sidebar />

      <div className="relative bg-blueGray-100 min-h-screen w-full pl-64">
        <AdminNavbar />
        {/* <HeaderStats /> */}

        <div className="px-4 md:px-10 mx-auto w-full mt-6">
          <Routes>
            <Route index element={<Navigate to="dashboard" replace />} />
    

            <Route path="dashboard" element={<Dashboard />} />
            <Route path="/posts" element={<Posts />} />
            <Route path="/posts/add" element={<AddPost />} />
            <Route path="/post/:slug" element={<ViewPost />} />
            <Route path="/category" element={<Categories />} />
            <Route path="/edit-post/:slug" element={<EditPost />} />
            <Route path="comments" element={<Comments />} />
            <Route path="/users" element={<Users />} />
            <Route path="/user-edit" element={<UserEdit />} />
            <Route path="/adduser" element={<AddUser />} />
            <Route path="/profile" element={<Adminprofile />} />
            <Route path="settings" element={<Settings />} />
            <Route path="/user-posts" element={<UserPost />} />
            <Route path="roles" element={<ManageRole />} />
            <Route path="/edit-profile" element={<EditAdminProfile />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>

          <FooterAdmin />
        </div>
      </div>
    </div>
  );
}
