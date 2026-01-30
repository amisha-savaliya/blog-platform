import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!agree) {
      alert("Please accept Privacy Policy");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert("Account created successfully");
      navigate("/login");
    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="col-md-6 col-lg-4">
        <div className="card shadow border-0 rounded-4">
          <div className="bg-blueGray-200  card-body p-4 p-md-5">
            {/* Header */}
            <h3 className="text-center fw-bold mb-2">Create Account</h3>
            <p className="text-center text-muted mb-4">
              Sign up to get started
            </p>

         
{/* 
            <div className="text-center my-3 text-muted">OR</div>

            
            <div className="d-flex justify-content-center gap-0">
              <button className=" d-flex align-items-center justify-content-center rounded-circle p-3">
                <img src={githubIcon} width="22" alt="Github" />
              </button>

              <button className="d-flex align-items-center justify-content-center rounded-circle p-3">
                <img src={googleIcon} width="22" alt="Google" />
              </button>
            </div> */}

          
            <form onSubmit={handleSubmit}>
              {/* Name */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              {/* Email */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {/* Privacy */}
              <div className="form-check mb-4">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                />
                <label className="form-check-label">
                  I agree to the{" "}
                  <span className="text-primary cursor-pointer">
                    Privacy Policy
                  </span>
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="btn btn-primary w-100 py-2 fw-semibold"
              >
                Create Account
              </button>
            </form>

            {/* Footer */}
            <p className="text-center text-muted mt-4 mb-0">
              Already have an account?{" "}
              <span
                className="text-primary cursor-pointer fw-semibold"
                onClick={() => navigate("/admin/login")}
              >
                Login
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
