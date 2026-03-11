import { useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { logout, selectActiveUser} from "../features/auth/authSlice";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  // const [pagesOpen, setPagesOpen] = useState(false);

  const { categories } = useSelector((s) => s.category);
  const activeUser = useSelector(selectActiveUser);
const isLoggedIn = !!activeUser;

  const location = useLocation();
  const dispatch=useDispatch();

  // const isInvitePage =
  //   location.pathname.includes("setup-account") ||
  //   location.pathname.includes("invite");

  

  // const inviteMode = sessionStorage.getItem("invite_mode");

  // const isLoggedIn =
  //   user || ( !isInvitePage && !inviteMode && !isLoginPage);

  const navStyle = ({ isActive }) => ({
    color: isActive ? "#5789d2" : "#ffffff",
    fontWeight: isActive ? "600" : "400",
    position: "relative",
    padding: "6px 2px",
    textDecoration: "none",
    letterSpacing: "0.3px",
    // borderBottom: isActive ? "3px solid #0d6efd" : "3px solid transparent",
    paddingBottom: "4px",
  });

  return (
    <>
      {/* ================= Mobile Menu ================= */}
      <div className={`site-mobile-menu ${mobileOpen ? "active" : ""}`}>
        <div className="site-mobile-menu-header">
          <div
            className="site-mobile-menu-close"
            onClick={() => setMobileOpen(false)}
          >
            <span className="icofont-close"></span>
          </div>
        </div>

        <div className="site-mobile-menu-body">
          <ul className="site-nav-wrap">
            <li>
              <NavLink
                to="/"
                onClick={() => setMobileOpen(false)}
                style={navStyle}
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about"
                onClick={() => setMobileOpen(false)}
                style={navStyle}
              >
                About
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/contact"
                onClick={() => setMobileOpen(false)}
                style={navStyle}
              >
                Contact
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/blogpage"
                onClick={() => setMobileOpen(false)}
                style={navStyle}
              >
                Blog
              </NavLink>
            </li>

            {/* Categories */}
            {categories.map((cat) => (
              <li key={cat.id}>
                <NavLink
                  to={`/category/${cat.name.toLowerCase()}`}
                  onClick={() => setMobileOpen(false)}
                >
                  {cat.name}
                </NavLink>
              </li>
            ))}

            <li>
              {!isLoggedIn ? (
                <NavLink to="/login" onClick={() => setMobileOpen(false)}>
                  Login
                </NavLink>
              ) : (
               <button onClick={() => dispatch(logout())} className="btn btn-link">
                  Logout
                </button>
              )}
            </li>
          </ul>
        </div>
      </div>

      {/* ================= Desktop Navbar ================= */}
      <nav className="site-nav sticky-top bg-black shadow-sm">
        <div className="container">
          <div className="menu-bg-wrap">
            <div className="site-navigation">
              <div className="row align-items-center">
                {/* Logo */}
                <div className="col-2">
                  <NavLink
                    to="/"
                    className="logo fw-bold fs-4 text-decoration-none"
                  >
                    BlogNest<span className="text-primary">.</span>
                  </NavLink>
                </div>

                {/* Center Menu */}
                <div className="col-8 text-center">
                  <ul className="site-menu d-none d-lg-flex justify-content-center align-items-center gap-4 mb-0">
                    <li>
                      <NavLink to="/" style={navStyle}>
                        Home
                      </NavLink>
                    </li>

                    <li>
                      <NavLink to="/blogpage" style={navStyle}>
                        Blog
                      </NavLink>
                    </li>

                    {/* Categories Dropdown */}
                    <li className="has-children">
                      <span
                        style={{
                          color: location.pathname.startsWith("/category")
                            ? "#0d6efd"
                            : "#ffffff",
                          fontWeight: location.pathname.startsWith("/category")
                            ? "600"
                            : "400",
                        }}
                      >
                        Categories
                      </span>
                      <ul className="dropdown">
                        {categories.map((cat) => (
                          <li key={cat.id}>
                            <NavLink to={`/category/${cat.name.toLowerCase()}`}>
                              {cat.name}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    </li>
                  </ul>
                </div>

                {/* Right Auth Area */}
                <div className="col-2 d-none d-lg-flex align-items-center justify-content-end">
                  {!isLoggedIn ? (
                    <NavLink
                      to="/login"
                      className="btn btn-primary px-4 rounded-pill fw-semibold"
                    >
                      <i className="fa-solid fa-right-to-bracket me-2"></i>
                      Login
                    </NavLink>
                  ) : (
                    <div className="dropdown">
                      <button
                        className="btn btn-light rounded-circle d-flex align-items-center justify-content-center dropdown-toggle navbar-avatar m-1"
                        data-bs-toggle="dropdown"
                        style={{
                          width: "42px",
                          height: "42px",
                          backgroundColor: "#f8fafc",
                        }}
                      >
                        <i className="fa-solid fa-circle-user text-primary fs-4"></i>
                      </button>

                      <ul className="dropdown-menu dropdown-menu-end shadow">
                        <li>
                          <Link className="dropdown-item" to="/profile">
                            Profile
                          </Link>
                        </li>
                        <li>
                          <button
                            className="dropdown-item text-danger"
                            onClick={()=>dispatch(logout())}
                          >
                            Logout
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
