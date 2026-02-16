import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EditForm from "../components/Edit/EditForm";

export default function AdminEditProfile() {
  const navigate = useNavigate();
  const token = localStorage.getItem("admintoken");

  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (!token) return navigate("/admin/login");

    fetch("http://localhost:5000/users/profile", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then((data) => {
        const user = data.user;
        setForm({
          name: user.name || "",
          email: user.email || "",
          password: "",
        });
        setUserId(user.id);
      })
      .catch(console.error);
  }, [token, navigate]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    setLoading(true);

    const updateData = { name: form.name, email: form.email };
    if (form.password.trim()) updateData.password = form.password;

    const res = await fetch(`http://localhost:5000/users/${userId}`, {
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

    localStorage.setItem("admintoken", data.token);
    alert("Profile updated!");
    navigate("/admin/profile");
  };

  return (
    <div className="container py-5 mt-5" style={{ maxWidth: "720px" }}>
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
        title="Edit Admin Profile"
        subtitle="Manage your account details"
      />
    </div>
  );
}
