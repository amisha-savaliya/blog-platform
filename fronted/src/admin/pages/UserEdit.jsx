import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const UserEdit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("admintoken");

  const { userId } = location.state || {};

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (!token) return navigate("/login");
    if (!userId) return navigate("/admin/users"); // 🔥 safety

    fetch(`http://localhost:5000/users/adminuser?id=${userId}`, {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then((data) => {
        setForm({
          name: data.name,
          email: data.email,
          password: "", // NEVER preload password
        });
      })
      .catch(console.error);
  }, [token, userId, navigate]); // 🔥 added userId

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const updateData = {
      name: form.name,
      email: form.email,
    };

    if (form.password.trim()) {
      updateData.password = form.password;
    }

    const res = await fetch(`http://localhost:5000/users/adminuser/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(updateData),
    });

    const data = await res.json();

    if (!res.ok) return alert(data.msg || "Update failed");

    alert("User updated successfully!");
    navigate("/admin/users");
  };

  return (
    <div className="container mt-5">
      <button className="btn btn-primary" onClick={() => navigate(-1)}>
        ⬅ Back
      </button>

      <div className="card shadow p-4 col-md-6 mx-auto">
        <h3>Edit User</h3>

        <input
          className="form-control mb-3"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
        />

        <input
          className="form-control mb-3"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
        />

        <input
          type="password"
          className="form-control mb-3"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="New Password (optional)"
        />

        <div className="text-end">
          <button className="btn btn-secondary me-2" onClick={() => navigate(-1)}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserEdit;
