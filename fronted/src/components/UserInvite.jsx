import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useEffect } from "react";
import { useRole } from "../context/Rolecontext";

export default function UserInvite() {
  const { inviteToken } = useParams();
  const { roles } = useRole();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const navigate = useNavigate();
const [popup, setPopup] = useState({
  show: false,
  message: "",
});

 useEffect(() => {
  if (!inviteToken) return;

  fetch(`http://localhost:5000/invite-user/invite-info/${inviteToken}`)
    .then(async (res) => {
      const data = await res.json();

      if (!res.ok) {
        if (data.setupDone) {
          setPopup({
            show: true,
            message: "Account setup already completed.",
          });
        } else {
          setPopup({ show: true, message: data.message });
        }
        return;
      }

      setEmail(data.email || "");
      setRole(data.role || "");
    })
    .catch(() => {
      setPopup({ show: true, message: "Server error" });
    });
}, [inviteToken]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/invite-user/setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inviteToken, name, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert("Account created successfully");

      sessionStorage.removeItem("invite_mode");

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
          <div className=" card-body p-4 p-md-5">
            {/* Header */}
            <h3 className="text-center fw-bold mb-2">Create Account</h3>
            <p className="text-center text-muted mb-4">
              Sign up to get started
            </p>

            <form onSubmit={handleSubmit} style={{ opacity: popup.show ? 0.5 : 1, pointerEvents: popup.show ? "none" : "auto" }}>

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
                  className="form-control cursor-block"
                  style={{opacity:"0.5", cursor:"not-allowed"}}
                  placeholder="email@example.com"
                  value={email}
                  disabled
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

              <div className="mb-3">
                <label className="form-label fw-semibold">Select Role</label>
                <select
                  name="role"
                  className="form-control"
                   style={{opacity:"0.5", cursor:"not-allowed"}}
                  value={role}
                  disabled
                >
                  <option value="">Select Role</option>
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
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
                disabled={!agree}
              >
                Create Account
              </button>
            </form>

            {/* Footer */}
            <p className="text-center text-muted mt-4 mb-0">
              Already have an account?{" "}
              <span
                className="text-primary cursor-pointer fw-semibold"
                onClick={() => navigate("/login")}
              >
                Login
              </span>
            </p>
          </div>
        </div>
      </div>
      {popup.show && (
  <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
       style={{ background: "rgba(0,0,0,0.5)", zIndex: 9999 }}>
    <div className="bg-white p-4 rounded-4 shadow text-center" style={{ width: "320px" }}>
      <h5 className="fw-bold mb-3">Notice</h5>
      <p className="text-muted">{popup.message}</p>

      <button
        className="btn btn-primary w-100"
        onClick={() => navigate("/login")}
      >
        Go to Login
      </button>
    </div>
  </div>
)}

    </div>
  );
}
