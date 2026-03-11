import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import githubIcon from "../../assets/img/github.png";
import googleIcon from "../../assets/img/google.svg";
import { useDispatch, useSelector } from "react-redux";
import { clearError, loginAdmin } from "../../Redux/features/auth/authSlice";

export default function AdminLogin() {
  const navigate = useNavigate();

  const { token, loading, error } = useSelector((s) => s.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
  }, [token, navigate]);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
  if (error) {
    dispatch(clearError());
  }

  setForm({ ...form, [e.target.name]: e.target.value });
};
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    
      await dispatch(loginAdmin(form)).unwrap();
      navigate("/dashboard");
    
    
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="col-md-5 col-lg-4">
        <div className="card shadow-lg border-0 rounded-4">
          <div className="card-body bg-blueGray-200 p-4 p-md-5">
            <div className="text-center mb-4">
              <h3 className="fw-bold">Admin Login</h3>
              <p className="text-muted mb-0">Sign in to manage the dashboard</p>
              
            </div>

               {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control form-control-lg"
                  style={{ borderRadius: "6px" }}
                  placeholder="admin@example.com"
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
                  className="form-control form-control-lg"
                  style={{ borderRadius: "6px" }}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>
            

              <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" />
                  <label className="form-check-label">Remember me</label>
                </div>

                <span
                  className="text-primary"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate("/forgot-password")}
                >
                  Forgot password?
                </span>
              </div>
                  


              <button
                className="btn btn-primary btn-lg w-100 mb-3"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <div className="text-center my-3 text-muted">OR</div>

            <div className="d-flex justify-content-center gap-3">
              <button
                className="btn btn-outline-none rounded-circle p-2"
                onClick={() => window.open("https://github.com", "_blank")}
              >
                <img src={githubIcon} width="22" alt="Github" />
              </button>

              <button
                className="btn btn-outline-none rounded-circle p-2"
             onClick={() => window.open("https://www.google.com", "_blank")}
              >
                <img src={googleIcon} width="22" alt="Google" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
