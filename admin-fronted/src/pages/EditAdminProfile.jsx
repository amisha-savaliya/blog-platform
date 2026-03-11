import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EditForm from "../components/Edit/EditForm";
import { useSelector, useDispatch } from "react-redux";
import { updateAdminProfile } from "../Redux/features/auth/authSlice";

export default function AdminEditProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { token, user, loading } = useSelector((s) => s.auth);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (!token) return navigate("/login");

    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        password: "",
      });
    }
  }, [token, user, navigate]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    const updateData = { name: form.name, email: form.email };
    if (form.password.trim()) updateData.password = form.password;

    const resultAction = await dispatch(
      updateAdminProfile({
        userId: user.id,
        updateData,
      })
    );

    if (updateAdminProfile.fulfilled.match(resultAction)) {
      alert("Profile updated!");
      navigate("/profile");
    } else {
      alert(resultAction.payload || "Update failed");
    }
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