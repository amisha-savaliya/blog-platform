import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import UserDropdown from "../../components/Dropdowns/UserDropdown";

export default function Navbar() {
  const [search, setSearch] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const getPageTitle = () => {
    const path = location.pathname;

    if (path.includes("/admin/posts")) return "Posts";
    if (path.includes("/admin/add-post")) return "Add New Post";
    if (path.includes("/admin/categories")) return "Categories";
    if (path.includes("/admin/profile")) return "My Profile";
    if (path.includes("/admin/settings")) return "Settings";
    return "Dashboard";
  };

  const handleSearch = (value) => {
    setSearch(value);

    // Push search to posts page
    navigate(`/admin/posts?search=${encodeURIComponent(value)}`);
  };

  return (
    <nav className="absolute top-0 left-0 w-full z-10 bg-transparent flex items-center p-4 mb-5">
      <div className="w-full mx-auto flex justify-between items-center md:px-10 px-4 mb-4">
        {/* Page Title */}
        <div className="text-white text-lg font-semibold text-black hidden lg:inline-block">
          {getPageTitle()}
        </div>

        {/* Search */}

        <form
          className="hidden md:flex items-center lg:ml-auto mr-3"
          onSubmit={(e) => e.preventDefault()}
        >
          {/* <div className="relative w-full max-w-xs">
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="🔍 Search posts..."
              className="w-full pl-5 pr-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div> */}
        </form>

        {/* User */}
        <ul className="hidden md:flex items-center">
          <UserDropdown />
        </ul>
      </div>
    </nav>
  );
}
