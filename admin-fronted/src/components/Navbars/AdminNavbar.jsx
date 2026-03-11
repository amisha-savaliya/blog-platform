import React from "react";
import { useLocation, matchPath } from "react-router-dom";
import UserDropdown from "../../components/Dropdowns/UserDropdown";

export default function Navbar() {
  const location = useLocation();
  const path = location.pathname;

  const getPageTitle = () => {
    // Exact routes
    if (path === "") return "Dashboard";
    if (path === "/posts") return "Posts";
    if (path === "/category") return "Categories";
    if (path === "/users") return "Users";
    if (path === "/profile") return "My Profile";
    if (path === "/add-user") return "Add User";
    if (path === "/comments") return "Comments";
    if (path === "/roles") return "Roles & Permissions";
    if (path === "/settings") return "Settings";
    if (path === "/profile") return "My Profile";
    if (path === "/inquiry") return "contact inquiry";

    // Dynamic routes
    if (matchPath("/posts/add", path)) return "Add-Post";
    if (matchPath("/edit-post/:slug", path)) return "Edit Post";
    if (matchPath("/post/:slug", path)) return "View Post";
    if (matchPath("/adduser", path)) return "Add-User";
    if (matchPath("/user-edit", path)) return "Edit User";
    if (matchPath("/user-posts", path)) return "User-Post";

    return "Dashboard";
  };

  return (
    <nav className="sticky top-0 z-40 bg-white shadow-sm border-b">
      <div className="flex justify-between items-center px-6 py-3">
        <h2 className="text-xl font-semibold text-gray-800">
          {getPageTitle()}
        </h2>

        <UserDropdown />
      </div>
    </nav>
  );
}
