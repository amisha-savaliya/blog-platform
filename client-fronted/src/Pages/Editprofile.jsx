import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectActiveUser, fetchProfile } from "../features/auth/authSlice";

export default function EditProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const activeUser = useSelector(selectActiveUser);
  const { token, impersonateToken } = useSelector((state) => state.auth);

  const currentToken = impersonateToken || token;

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (!activeUser) return;

    setForm({
      name: activeUser.name || "",
      email: activeUser.email || "",
      password: "",
    });

    setLoading(false);
  }, [activeUser]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  async function handleSave() {
    const updateData = {
      name: form.name,
      email: form.email,
    };

    if (form.password.trim()) {
      updateData.password = form.password;
    }

    const res = await fetch(
      `http://localhost:5000/blog/users/${activeUser.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + currentToken,
        },
        body: JSON.stringify(updateData),
      }
    );

    const data = await res.json();
    if (!res.ok) return alert(data.msg || "Update failed");

    // 🔥 refresh profile properly
    await dispatch(fetchProfile());

    alert("Profile updated successfully!");
    navigate("/profile");
  }

  if (loading) {
    return <div className="container mt-5 text-center">Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-7">
          <div className="card shadow border-0">
            <div className="card-header bg-white border-bottom">
              <h4 className="mb-0">Account Settings</h4>
              <small className="text-muted">
                Update your personal and security information
              </small>
            </div>

            <div className="card-body p-4">
              <div className="d-flex align-items-center mb-4 gap-3">
                <img
                  src="/user.png"
                  alt="User Avatar"
                  className="rounded-circle border"
                  width="80"
                  height="80"
                />
                <div>
                  <h6 className="mb-0">{form.name}</h6>
                  <small className="text-muted">{form.email}</small>
                </div>
              </div>

              <h6 className="text-uppercase text-muted mb-3">
                Basic Information
              </h6>

              <div className="mb-3">
                <label className="form-label fw-semibold">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>

              <h6 className="text-uppercase text-muted mb-3">
                Security
              </h6>

              <div className="mb-4">
                <label className="form-label fw-semibold">
                  New Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Leave blank to keep current password"
                />
              </div>

              <div className="d-flex justify-content-end gap-2">
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary px-4"
                  onClick={handleSave}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>

          <p className="text-center text-muted mt-3 small">
            Changes will be applied immediately
          </p>
        </div>
      </div>
    </div>
  );
}