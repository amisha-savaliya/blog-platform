import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { inviteUser } from "../Redux/features/users/usersSlice";

export default function AddUser() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { token } = useSelector((s) => s.auth);
  const { roles } = useSelector((s) => s.roles);
  const { loading, error, successMessage } = useSelector((s) => s.users);

  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    if (!token) return navigate("/login");
   
  }, [ token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const resultAction = await dispatch(
      inviteUser({ email, role })
    );

    if (inviteUser.fulfilled.match(resultAction)) {
      setEmail("");
      setRole("");
    }
  };

  return (
    <div className="container pt-5 mt-5">
      <div className="mb-4 d-flex justify-content-between align-items-start">
        <div>
          <h2 className="fw-bold mb-1 text-primary-emphasis fs-3">
            Add New User
          </h2>
          <p className="text-muted mb-0">
            Send an invitation email so the user can create their account.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => navigate("/users")}
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

                <div className="alert alert-info small py-2">
                  The user will receive a secure email link to set their
                  username and password.
                </div>

                {error && (
                  <div className="alert alert-danger py-2">
                    {error}
                  </div>
                )}

                {successMessage && (
                  <div className="alert alert-success py-2">
                    {successMessage}
                  </div>
                )}

                <button
                  className="btn btn-primary w-100 py-2 mt-2 fw-semibold"
                  disabled={loading}
                >
                  {loading
                    ? "Sending Invitation..."
                    : "Send Invitation Email"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}