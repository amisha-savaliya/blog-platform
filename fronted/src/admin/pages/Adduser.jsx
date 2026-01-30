import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRole } from "../../context/Rolecontext";

export default function AddUser() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState();
  const { roles } = useRole();

  const [form, setForm] = useState({
    uname: "",
    email: "",
    password: "",
    role: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.uname || !form.email || !form.password || !form.role) return null;

    const token = localStorage.getItem("admintoken  ");

    const res = await fetch("http://localhost:5000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (!res.ok) {
      setLoading(false);
      return alert(data.msg || "Failed to add user");
    } else alert("User added successfully");
    navigate("/admin/users");
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow border-0 rounded-4">
            <div className="card-body p-4">
              <h3 className="text-center fw-bold mb-2">Add New User</h3>

              <form onSubmit={handleSubmit} className="user-form">
                <div className="mb-3">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    name="uname"
                    className="form-control"
                    placeholder="John Doe"
                    value={form.uname}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* <div className="mb-3">
                  <label className="form-label">Confirm Password</label>
                  <input
                    type="password"
                    name="confirm"
                    className="form-control"
                    placeholder="••••••••"
                    value={form.confirm}
                    onChange={handleChange}
                    required
                  />
                </div> */}

                <div className="mb-3">
                  <label className="form-label">Select Role</label>
                  <select
                    name="role"
                    className="form-control"
                    value={form.role}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Role</option>
                    {roles.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  className="btn btn-primary w-100 py-2 mt-2"
                  disabled={loading}
                >
                  {loading ? "Adding user..." : "Add User"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
