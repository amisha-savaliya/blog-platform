import React from "react";
import { useLocation, matchPath } from "react-router-dom";
import UserDropdown from "../../components/Dropdowns/UserDropdown";

export default function Navbar() {
  const location = useLocation();
  const path = location.pathname;

  const getPageTitle = () => {
    // Exact routes
    if (path === "/admin") return "Dashboard";
    if (path === "/admin/posts") return "Posts";
    if (path === "/admin/category") return "Categories";
    if(path==="/admin/users") return "Users";
    if (path === "/admin/profile") return "My Profile";
    if (path === "/admin/add-user") return "Add User";
    if (path === "/admin/comments") return "Comments";
    if (path === "/admin/roles") return "Roles & Permissions";
    if (path === "/admin/settings") return "Settings";
    if (path === "/admin/profile/") return "My Profile";

    // Dynamic routes
    if (matchPath("/admin/posts/add", path)) return "Add-Post";
    if (matchPath("/admin/edit-post/:slug", path)) return "Edit Post";
    if (matchPath("/admin/post/:slug", path)) return "View Post";
    if (matchPath("/admin/adduser", path)) return "Add-User";
    if (matchPath("/admin/user-edit", path)) return "Edit User";
    if (matchPath("/admin/user-posts", path)) return "User-Post";

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
