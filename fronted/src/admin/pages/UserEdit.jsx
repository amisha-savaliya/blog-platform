import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import EditForm from "../components/Edit/EditForm";

export default function UserEdit() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("admintoken");
  const { userId } = location.state || {};

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (!token) return navigate("/login");
    if (!userId) return navigate("/admin/users");

    fetch(`http://localhost:5000/users/adminuser?id=${userId}`, {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then((data) =>
        setForm({
          name: data.name || "",
          email: data.email || "",
          password: "",
        }),
      )
      .catch(console.error);
  }, [token, userId, navigate]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    if (!form.name.trim()) return alert("Name required");

    setLoading(true);

    const updateData = { name: form.name, email: form.email };
    if (form.password.trim()) updateData.password = form.password;

    const res = await fetch(`http://localhost:5000/users/adminuser/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(updateData),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) return alert(data.msg || "Update failed");

    alert("User updated successfully!");
    navigate("/admin/users");
  };

  return (
    <div className="container py-5 mt-3" style={{ maxWidth: "720px" }}>
      <button
        className="btn btn-light border mb-3"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <EditForm
        form={form}
        onChange={handleChange}
        onSubmit={handleSave}
        loading={loading}
        title="Edit User Account"
        subtitle="Update user information and credentials"
      />
    </div>
  );
}
