import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./layouts/ProtectedRoute.jsx";

// layouts
import ClientLayout from "./layouts/Clientlayout.jsx";

// pages
import Home from "./Pages/Home.jsx";
import BlogPage from "./Pages/BlogPage.jsx";
import About from "./Pages/About.jsx";
import Contact from "./Pages/Contact.jsx";
import SinglePost from "./Pages/Singlepost.jsx";
import Profile from "./Pages/Profile.jsx";
import Addpost from "./Pages/Addpost.jsx";
import EditProfile from "./Pages/Editprofile.jsx";
import EditPost from "./Pages/Editpost.jsx";
import Category from "./Pages/Category.jsx";
import NotFound from "./Pages/Notfound.jsx";

// auth / public
import Login from "./Login.jsx";
import Signup from "./Signup.jsx";
import UserInvite from "./components/UserInvite.jsx";
import ForgotPassword from "./components/Forget_passoword.jsx";
import ResetPassword from "./components/Reset_password.jsx";
import ImpersonateLogin from "./components/ImpersonateLogin.jsx";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchProfile,
  loadUserFromStorage,
} from "./features/auth/authSlice.js";
import { fetchAllCategory } from "./features/category/categorySlice.js";

export default function App() {
  const dispatch = useDispatch();

  const { token, impersonateToken, isImpersonating } = useSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    dispatch(loadUserFromStorage());
  }, []);

    useEffect(() => {
      dispatch(fetchAllCategory());
    }, [dispatch]);

  useEffect(() => {
    const activeToken = isImpersonating ? impersonateToken : token;

    if (activeToken) {
      dispatch(fetchProfile());
    }
  }, [token, impersonateToken, isImpersonating]);
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:resetToken" element={<ResetPassword />} />
        <Route path="/setup-account/:inviteToken" element={<UserInvite />} />
        <Route path="/impersonate" element={<ImpersonateLogin />} />

        {/* PROTECTED ROUTES */}
        <Route element={<ProtectedRoute />}>
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
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
