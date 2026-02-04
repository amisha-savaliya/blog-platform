import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function EditProfile() {
  const navigate = useNavigate();
  const normaToken = localStorage.getItem("token");
  const impersonationToken = sessionStorage.getItem("impersonationToken");
  const token = normaToken ||  impersonationToken; 
  const [userId, setUserId] = useState(null);
  
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (!token) return navigate("/login");

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  async function handleSave() {
  const updateData = {
    name: form.name,
    email: form.email,
  
  };

  if (form.password && form.password.trim() !== "") {
    updateData.password = form.password;
  }

  const res = await fetch(`http://localhost:5000/users/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(updateData),
  });

const data = await res.json();
localStorage.setItem("token", data.token); // update token


  if (!res.ok) {
    return alert(data.msg || "Update failed");
  }

  alert("Profile updated successfully!");
  navigate("/profile");
}

  return (
    <div className="container mt-5">
      <div className="card shadow p-4 col-md-6 mx-auto">
        <h3 className="mb-3">Edit Profile</h3>

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
          placeholder="Password (optional)"
        />

        <div className="text-end">
          <button
            className="btn btn-secondary me-2"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
