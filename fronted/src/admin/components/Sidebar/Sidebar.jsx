import { Link, useLocation } from "react-router-dom";
import UserDropdown from "../Dropdowns/UserDropdown";
import React from "react";

export default function Sidebar() {
  const [collapseShow, setCollapseShow] = React.useState("hidden");
  const location = useLocation();

  const isActive = (path) => location.pathname.includes(path);

  const linkClass = (path) =>
    "text-xs uppercase py-3 font-bold block " +
    (isActive(path)
      ? "text-lightBlue-500 hover:text-lightBlue-600"
      : "text-blueGray-700 hover:text-blueGray-500");

  const iconClass = (path) =>
    "fas mr-2 text-sm " + (isActive(path) ? "opacity-75" : "text-blueGray-300");

  return (
    <>
      <nav className="md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto md:flex-row md:flex-nowrap md:overflow-hidden shadow-xl bg-white flex flex-wrap items-center justify-between relative md:w-64 z-10 py-4 px-6">
        <div className="md:flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0 flex flex-wrap items-center justify-between w-full mx-auto">
          {/* Mobile Toggler */}
          <button
            className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
            onClick={() => setCollapseShow("bg-white m-2 py-3 px-6")}
          >
            <i className="fas fa-bars"></i>
          </button>

          {/* Brand */}
          <Link
            className="md:block text-left md:pb-2 text-blueGray-600 text-sm uppercase font-bold p-4 px-0"
            to="/admin/dashboard"
          >
            BlogNest ADMIN
          </Link>

          {/* Mobile User */}
          <ul className="md:hidden items-center flex list-none">
            <li className="inline-block relative">
              <UserDropdown />
            </li>
          </ul>

          {/* Sidebar Content */}
          <div
            className={
              "md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-4 shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-auto items-center flex-1 rounded " +
              collapseShow
            }
          >
            {/* Mobile Header */}
            <div className="md:hidden flex justify-between pb-4 mb-4 border-b border-blueGray-200">
              <span className="font-bold uppercase text-sm">Menu</span>
              <button onClick={() => setCollapseShow("hidden")}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* Section */}
            {/* <h6 className="text-blueGray-500 text-xs uppercase font-bold block pt-1 pb-4">
              Blog Management
            </h6> */}

            <ul className="md:flex-col md:min-w-full flex flex-col list-none">
              <li className="items-center">
                <Link
                  className={linkClass("/admin/dashboard")}
                  to="/admin/dashboard"
                >
                  <i
                    className={iconClass("/admin/dashboard") + " fa-chart-line"}
                  ></i>
                  Dashboard
                </Link>
              </li>

              <li className="items-center">
                <Link className={linkClass("/admin/posts")} to="/admin/posts">
                  <i
                    className={iconClass("/admin/posts") + " fa-newspaper"}
                  ></i>
                  Posts
                </Link>
              </li>

              <li className="items-center">
                <Link
                  className={linkClass("/admin/category")}
                  to="/admin/category"
                >
                  <i className={iconClass("/admin/category") + " fa-tags"}></i>
                  Categories
                </Link>
              </li>

              <li className="items-center">
                <Link className={linkClass("/admin/users")} to="/admin/users">
                  <i className={iconClass("/admin/users") + " fa-users"}></i>
                  Users
                </Link>
              </li>
              <li className="items-center">
                <Link
                  className={linkClass("/admin/comments")}
                  to="/admin/comments"
                >
                  <i
                    className={iconClass("/admin/comments") + " fa-comment"}
                  ></i>
                  comments
                </Link>
              </li>

              <li className="items-center">
                <Link className={linkClass("/admin/roles")} to="/admin/roles">
                  <i
                    className={
                      iconClass("/admin/roles") + " fa-solid fa-user-shield"
                    }
                  ></i>
                  Manage role
                </Link>
              </li>

              <li className="items-center">
                <Link
                  className={linkClass("/admin/settings")}
                  to="/admin/settings"
                >
                  <i className={iconClass("/admin/settings") + " fa-cog"}></i>
                  Settings
                </Link>
              </li>

              {/* Divider */}
              <li className="my-3 border-t border-blueGray-200"></li>

              {/* Section Title */}
              <li className="text-blueGray-500 text-xs uppercase font-bold block pt-1 pb-4">
                Quick Actions
              </li>

              {/* Add Post */}
              <li className="items-center">
                <Link
                  className={linkClass("/admin/posts/add")}
                  to="/admin/posts/add"
                >
                  <i
                    className={
                      iconClass("/admin/posts/add") + " fa-plus-circle"
                    }
                  ></i>
                  Add Post
                </Link>
              </li>

              {/* Add User */}
              <li className="items-center">
                <Link
                  className={linkClass("/admin/adduser")}
                  to="/admin/adduser"
                >
                  <i
                    className={iconClass("/admin/adduser") + " fa-user-plus"}
                  ></i>
                  Add User
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
