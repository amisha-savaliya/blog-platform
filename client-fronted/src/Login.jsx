import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "./features/auth/authSlice";
import googleIcon from "../src/assets/google.png";
import githubIcon from "../src/assets/github.png";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, loading, error } = useSelector((state) => state.auth);



const location = useLocation();

useEffect(() => {
  if (user && location.pathname === "/login") {
    navigate("/profile");
  }
}, [user, location.pathname, navigate]);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(form));
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="col-md-5 col-lg-4">
        <div className="card shadow-lg border-0 rounded-4">
          <div className="card-body p-3 p-md-5">
            <div className="text-center mb-4">
              <h3 className="fw-bold">Welcome Back</h3>
              <p className="text-muted mb-0">
                Login to manage your blog content
              </p>
            </div>
             {error && <div className="alert alert-danger py-2">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="enter email"
                  className="form-control form-control-lg"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="enter password"
                  className="form-control form-control-lg"
                  value={form.password}
                  onChange={handleChange}
                  required
                />

                {/* Forgot Password Link */}
                <div className="text-end mt-2">
                  <span
                    className="text-primary"
                    style={{ cursor: "pointer", fontSize: "14px" }}
                    onClick={() => navigate("/forgot-password")}
                  >
                    Forgot Password?
                  </span>
                </div>
              </div>
             

              <button
                className="btn btn-primary btn-lg w-100 "
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <div className="text-center mt-4">
              <span className="text-muted">Don't have an account?</span>{" "}
              <span
                className="text-primary fw-semibold"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/signup")}
              >
                Sign up
              </span>
            </div>

            <div className="text-center text-muted my-2">OR</div>

            <div className="d-flex justify-content-center gap-3">
              <button className="rounded-circle p-3"
             onClick={() => window.open("https://github.com", "_blank")}>
                <img src={githubIcon} width="22" alt="Github" />
              </button>
              <button className="rounded-circle p-3"
              onClick={() => window.open("https://www.google.com", "_blank")}>
                <img src={googleIcon} width="22" alt="Google" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
