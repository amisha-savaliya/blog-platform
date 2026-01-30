import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import githubIcon from "../../assets/img/github.png";
import googleIcon from "../../assets/img/google.svg";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

if (!res.ok) {
  return alert(data.message || data.msg || "Login failed");
}

if (data.user?.role === 2) {
  localStorage.setItem("admintoken", data.token);
  navigate("/admin/dashboard");
} else {
  alert("Not an admin account");
}
  

  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="col-md-5 col-lg-4">
        <div className="card shadow-lg border-0 rounded-4">
          <div className="card-body bg-blueGray-200 p-4 p-md-5">
            {/* Header */}
            <div className="text-center mb-4">
              <h3 className="fw-bold">Admin Login</h3>
              <p className="text-muted mb-0">Sign in to manage the dashboard</p>
            </div>

            {/* Form */}
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
                  autoComplete="email"
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
                  autoComplete="current-password"
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
                  onClick={() => navigate("/forgot")}
                >
                  Forgot password?
                </span>
              </div>

              <button className="btn btn-primary btn-lg w-100 mb-3">
                Login
              </button>
            </form>

            {/* Divider */}
            <div className="text-center my-3 text-muted">OR</div>

            {/* Social login */}
            <div className="d-flex justify-content-center gap-3">
              <button className="btn btn-outline-secondary d-flex align-items-center justify-content-center rounded-circle p-3">
                <img src={githubIcon} width="22" alt="Github" />
              </button>

              <button className="btn btn-outline-danger d-flex align-items-center justify-content-center rounded-circle p-3">
                <img src={googleIcon} width="22" alt="Google" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-4">
          <span className="text-muted">New here?</span>{" "}
          <Link to="/admin/register" className="fw-semibold">
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}
