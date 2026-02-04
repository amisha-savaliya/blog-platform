import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRole } from "../../context/Rolecontext";

export default function AddUser() {
  const navigate = useNavigate();
  const { roles } = useRole();

  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); // success / error msg

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    const token = localStorage.getItem("admintoken");
    if (!token) {
      setMessage({ type: "danger", text: "Admin not logged in" });
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/invite-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({ type: "danger", text: data.message || "Invite failed" });
        return;
      }

      setMessage({
        type: "success",
        text: "Invitation email sent successfully!",
      });
      setEmail("");
      setRole("");
    } catch (error) {
      console.error(error);
      setMessage({ type: "danger", text: "Server error. Try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container pt-5 mt-24">
      {/* 🔹 Page Header */}
      <div className="mb-4 d-flex justify-content-between align-items-start">
        <div>
          <h2 className="fw-bold mb-1 text-primary-emphasis">Add New User</h2>
          <p className="text-muted mb-0">
            Send an invitation email so the user can create their account.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => navigate("/admin/users")}
        >
          ← Back
        </button>
      </div>

      <div className="row justify-content-center">
        <div className="col-md-7 col-lg-6">
          <div className="card shadow-sm border-0 rounded-4">
            <div className="card-body p-4">
              <h4 className="fw-semibold mb-3">User Invitation Details</h4>

              <form onSubmit={handleSubmit}>
                {/* Email */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                {/* Role */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Select Role</label>
                  <select
                    className="form-select"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                  >
                    <option value="">Choose role...</option>
                    {roles.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Info Box */}
                <div className="alert alert-info small py-2">
                  The user will receive a secure email link to set their
                  username and password.
                </div>

                {/* Message */}
                {message && (
                  <div className={`alert alert-${message.type} py-2`}>
                    {message.text}
                  </div>
                )}

                {/* Button */}
                <button
                  className="btn btn-primary w-100 py-2 mt-2 fw-semibold"
                  disabled={loading}
                >
                  {loading ? "Sending Invitation..." : "Send Invitation Email"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
