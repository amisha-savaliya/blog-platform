import { BrowserRouter, Routes, Route } from "react-router-dom";

// Client pages & layout
import ClientLayout from "./layouts/Clientlayout.jsx";
import Home from "./Pages/Home.jsx";
import BlogPage from "./Pages/BlogPage.jsx";
import About from "./Pages/About.jsx";
import Contact from "./Pages/Contact.jsx";
import SinglePost from "./Pages/Singlepost.jsx";
import Profile from "./Pages/Profile.jsx";
import Addpost from "./Pages/Addpost.jsx";
import EditProfile from "./Pages/Editprofile.jsx";
import Login from "./Login.jsx";
import Signup from "./Signup.jsx";

// Admin layout
import Admindesh from "./admin/layouts/Admindesh.jsx";
import Category from "./Pages/Category.jsx";
import EditPost from "../src/Pages/Editpost.jsx";

import AdminLogin from "./admin/views/auth/Login.jsx";
import UserInvite from "./components/UserInvite.jsx";
import NotFound from "./Pages/Notfound.jsx";
import { useEffect } from "react";
import ForgotPassword from "../Forget_passoword.jsx";
import ResetPassword from "../Reset_password.jsx";

export default function App() {
  useEffect(() => {
    const inviteMode = sessionStorage.getItem("invite_mode");

    if (inviteMode && !window.location.pathname.includes("setup-account")) {
      window.location.href = "/setup-account/:inviteToken";
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Client Routes */}
        <Route element={<ClientLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/blogpage" element={<BlogPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/post/:slug" element={<SinglePost />} />

          <Route path="/category/:name" element={<Category />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/post/add" element={<Addpost />} />

          <Route path="/edit-post/:slug" element={<EditPost />} />

          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/setup-account/:inviteToken" element={<UserInvite />} />

        <Route path="/reset-password/:resetToken" element={<ResetPassword />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/*" element={<Admindesh />} />
      </Routes>
    </BrowserRouter>
  );
}
