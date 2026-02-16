import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import githubIcon from "../../assets/img/github.png";
import googleIcon from "../../assets/img/google.svg";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  // 🔒 If already logged in, skip login page
  useEffect(() => {
    const token = localStorage.getItem("admintoken");
    if (token) navigate("/admin/dashboard");
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.msg || "Login failed");
      }

      if (data.user?.role !== 2) {
        throw new Error("Not an admin account");
      }

      // Clear any old tokens
      localStorage.removeItem("admintoken");

      localStorage.setItem("admintoken", data.token);

      navigate("/admin/dashboard");

    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
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

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control form-control-lg"
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
              <button className="btn btn-outline-none rounded-circle p-3">
                <img src={githubIcon} width="22" alt="Github" />
              </button>

              <button className="btn btn-outline-none rounded-circle p-3">
                <img src={googleIcon} width="22" alt="Google" />
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
