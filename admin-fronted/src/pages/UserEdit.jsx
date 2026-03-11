import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import EditForm from "../components/Edit/EditForm";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSingleUser,
  updateUser,
} from "../Redux/features/users/usersSlice";

export default function UserEdit() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { token } = useSelector((s) => s.auth);
  const { selectedUser } = useSelector((s) => s.users);

  const { userId } = location.state || {};

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  /* --------  Fetch User -------- */
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    if (!userId) {
      navigate("/users");
      return;
    }

    dispatch(fetchSingleUser(userId));
  }, [token, userId, navigate, dispatch]);

  /* --------  Update Form When selectedUser Changes -------- */
  useEffect(() => {
    if (selectedUser) {
      setForm({
        name: selectedUser.name || "",
        email: selectedUser.email || "",
        password: "",
      });
    }
  }, [selectedUser]);

  /* -------- Handlers -------- */

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    if (!form.name.trim()) return alert("Name required");

    setLoading(true);

    const updateData = {
      name: form.name,
      email: form.email,
    };

    if (form.password.trim()) {
      updateData.password = form.password;
    }

    dispatch(updateUser({ id: userId, updateData }));

    alert("User updated successfully!");
    navigate("/users");
  };

  if (!selectedUser) {
    return <div className="text-center py-5">Loading...</div>;
  }

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
