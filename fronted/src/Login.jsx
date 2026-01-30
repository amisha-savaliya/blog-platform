import { useState } from "react";
import { useNavigate } from "react-router-dom";
import googleIcon from "../src/assets/google.png";
import githubIcon from "../src/assets/github.png";
import { useAuth } from "./context/Authcontext";

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (!res.ok) return alert(data.msg);

    if (data.user.role_id === 1) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("current_id", JSON.stringify(data.user));
      setUser(data.user);
      navigate("/profile");
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="col-md-5 col-lg-4">
        <div className="card shadow-lg border-0 rounded-4">
          <div className="card-body p-3 p-md-5">
            {/* Header */}
            <div className="text-center mb-4">
              <h3 className="fw-bold">Welcome Back</h3>
              <p className="text-muted mb-0">
                Login to manage your blog content
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control form-control-lg"
                  placeholder="you@example.com"
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
                  onClick={() => navigate("/forgot")}
                >
                  Forgot password?
                </span>
              </div>

              <button className="btn btn-primary btn-lg w-100">Login</button>
            </form>

            {/* Footer */}
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

            <div className="text-center text-muted mb-2">OR</div>

            {/* Social Login */}
            <div className="d-flex justify-content-center gap-3">
              <button
                className="d-flex align-items-center justify-content-center rounded-circle p-3"
                onClick={() => (window.location.href = "https://github.com")}
              >
                <img src={githubIcon} width="22" alt="Github" />
              </button>

              <button
                className="d-flex align-items-center justify-content-center rounded-circle p-3"
                onClick={() => (window.location.href = "https://google.com")}
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
