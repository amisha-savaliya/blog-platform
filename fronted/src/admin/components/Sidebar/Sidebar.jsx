import { Link, useLocation } from "react-router-dom";
import UserDropdown from "../Dropdowns/UserDropdown";

export default function Sidebar({ isOpen, setIsOpen }) {
  const location = useLocation();

  const isActive = (path) => location.pathname.startsWith(path);

  const linkClass = (path) =>
    `flex items-center text-sm uppercase py-3 px-4 font-semibold transition
     ${
       isActive(path)
         ? "text-lightBlue-600 bg-lightBlue-50"
         : "text-blueGray-700 hover:bg-blueGray-100"
     }`;

  const iconClass = (path) =>
    `fas mr-3 text-base ${
      isActive(path) ? "text-lightBlue-600" : "text-blueGray-400"
    }`;

  return (
    <>
      {/* ===== MOBILE TOP BAR ===== */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white shadow px-4 py-3 flex justify-between items-center">
        <button onClick={() => setIsOpen(true)}>
          <i className="fas fa-bars text-xl"></i>
        </button>

        <Link
          to="/admin/dashboard"
          className="text-lg font-bold text-lightBlue-600"
        >
          BlogNest <span className="text-xs text-blueGray-400">ADMIN</span>
        </Link>

        <UserDropdown />
      </div>

      {/* ===== OVERLAY (mobile) ===== */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* ===== SIDEBAR ===== */}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-64 bg-white shadow-lg z-40
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <Link
            to="/admin/dashboard"
            className="text-xl font-extrabold text-lightBlue-600"
          >
            📰 BlogNest <span className="text-sm text-blueGray-400">ADMIN</span>
          </Link>

          <button
            className="md:hidden"
            onClick={() => setIsOpen(false)}
          >
            <i className="fas fa-times text-lg"></i>
          </button>
        </div>

        {/* Menu */}
        <div className="overflow-y-auto h-[calc(100vh-64px)] pb-10">
          <p className="px-6 mt-6 mb-2 text-xs uppercase font-bold text-blueGray-400">
            Management
          </p>

          <ul>
            {[
              { path: "/admin/dashboard", icon: "fa-chart-line", label: "Dashboard" },
              { path: "/admin/posts", icon: "fa-newspaper", label: "Posts" },
              { path: "/admin/category", icon: "fa-tags", label: "Categories" },
              { path: "/admin/users", icon: "fa-users", label: "Users" },
              { path: "/admin/comments", icon: "fa-comment", label: "Comments" },
              { path: "/admin/roles", icon: "fa-user-shield", label: "Roles & Permissions" },
              { path: "/admin/settings", icon: "fa-cog", label: "Settings" },
            ].map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={linkClass(item.path)}
                  onClick={() => setIsOpen(false)}
                >
                  <i className={`${iconClass(item.path)} ${item.icon}`}></i>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <p className="px-6 mt-6 mb-2 text-xs uppercase font-bold text-blueGray-400">
            Quick Actions
          </p>

          <ul>
            <li>
              <Link
                to="/admin/posts/add"
                className={linkClass("/admin/posts/add")}
                onClick={() => setIsOpen(false)}
              >
                <i className="fas fa-plus-circle mr-3"></i>
                Add Post
              </Link>
            </li>

            <li>
              <Link
                to="/admin/adduser"
                className={linkClass("/admin/adduser")}
                onClick={() => setIsOpen(false)}
              >
                <i className="fas fa-user-plus mr-3"></i>
                Add User
              </Link>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
}
