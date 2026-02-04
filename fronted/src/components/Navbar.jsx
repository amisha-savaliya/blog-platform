import { React, useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { useCategories } from "../context/Categorycontext";
import { useAuth } from "../context/Authcontext";
// import { jwtDecode } from "jwt-decode";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pagesOpen, setPagesOpen] = useState(false);
  const { categories } = useCategories();
  const location = useLocation();

   const isInvitePage =
    location.pathname.includes("setup-account") ||
    location.pathname.includes("invite");
    const islogginButtonVisible = location.pathname.includes("login") || location.pathname.includes("signup");

  const inviteMode = sessionStorage.getItem("invite_mode");

  
  const { user, logout } = useAuth();

  const isImpersonating = sessionStorage.getItem("isImpersonating") === "true";
 

  const isLoggedIn = user && !isImpersonating && !isInvitePage && !inviteMode && !islogginButtonVisible;
  const isLoggedin = Boolean(isLoggedIn);

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
              <NavLink to="/" onClick={() => setMobileOpen(false)}>
                Home
              </NavLink>
            </li>

            <li className={`has-children ${pagesOpen ? "open" : ""}`}>
              <span onClick={() => setPagesOpen(!pagesOpen)}>Pages</span>
              {pagesOpen && (
                <ul className="dropdown">
                  <li>
                    <NavLink to="/about" onClick={() => setMobileOpen(false)}>
                      About
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/contact" onClick={() => setMobileOpen(false)}>
                      Contact
                    </NavLink>
                  </li>
                </ul>
              )}
            </li>

            <li>
              <NavLink to="/blogpage" onClick={() => setMobileOpen(false)}>
                Blog
              </NavLink>
            </li>

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
              {!isLoggedin ? (
                <NavLink to="/login" onClick={() => setMobileOpen(false)}>
                  Login
                </NavLink>
              ) : (
                <button onClick={logout} className="btn btn-link">
                  Logout
                </button>
              )}
            </li>
          </ul>
        </div>
      </div>

      {/* ================= Desktop Navbar ================= */}
      <nav className="site-nav">
        <div className="container">
          <div className="menu-bg-wrap">
            <div className="site-navigation">
              <div className="row align-items-centerL">
                <div className="col-2 d-flex align-items-center">
                  <NavLink
                    to="/"
                    className="logo d-flex align-items-center gap-2 text-decoration-none fw-bold fs-4"
                  >
                    <span className="text-dark">BlogNest</span>
                    <span className="text-primary">.</span>
                  </NavLink>
                </div>

                <div className="col-8 text-center">
                  <ul className="site-menu d-none d-lg-flex mx-auto align-items-center">
                    <li>
                      <NavLink to="/">Home</NavLink>
                    </li>

                    <li>
                      <NavLink to="/about">About</NavLink>
                    </li>

                    <li>
                      <NavLink to="/contact">contact</NavLink>
                    </li>

                    <li>
                      <NavLink to="/blogpage">Blog</NavLink>
                    </li>

                    {!user ? (
                      <li className="has-children">
                        <span>Category</span>
                        <ul className="dropdown">
                          {categories.map((cat) => (
                            <li key={cat.id}>
                              <NavLink
                                to={`/category/${cat.name.toLowerCase()}`}
                              >
                                {cat.name}
                              </NavLink>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ) : (
                      <li></li>
                    )}

                    <li className="ms-auto d-flex align-items-center gap-3">
                  
        
                      {/* Normal Logged User */}
                      {isLoggedin ? (
                        <>
                          <NavLink
                            to="/profile"
                            className="btn btn-light border rounded-circle d-flex align-items-center justify-content-center"
                            style={{ width: "38px", height: "38px" }}
                            title="Profile"
                          >
                            <i className="fa-solid fa-circle-user text-primary fs-5"></i>
                          </NavLink>

                          <button
                            onClick={logout}
                            className="btn btn-danger rounded-circle d-flex align-items-center justify-content-center"
                            style={{ width: "38px", height: "38px" }}
                            title="Logout"
                          >
                            <i className="fa-solid fa-right-from-bracket"></i>
                          </button>
                        </>
                      ) : (<NavLink
                          to="/login"
                          className="btn btn-primary px-4 rounded-pill fw-semibold"
                        >
                          <i className="fa-solid fa-right-to-bracket me-2"></i>
                          Login
                        </NavLink>)}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
