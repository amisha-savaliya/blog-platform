import React from 'react'
    import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";



const UserEdit = () => {

  const navigate = useNavigate();
  const location = useLocation();
//   console.log(location.state)
  const token=localStorage.getItem("admintoken");


  const [form, setForm] = useState({
    name:"",
    email:"",
    password:"",
  });

  const { userId } = location.state || {};
  useEffect(() => {
    if (!token) return navigate("/login");

    fetch(`http://localhost:5000/users?id=${userId}`, {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then((data) => {
        setForm(data);
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

  if (!res.ok) {
    return alert(data.msg || "Update failed");
  }

  alert("User updated successfully!");
  navigate("/admin/users");
}

  return (<div className="container mt-5">
  <button className='btn btn-primary' onClick={()=>navigate(-1)}> <i className="fa-solid fa-backward"></i> {" "}back</button>
      <div className="card shadow p-4 col-md-6 mx-auto">
        <h3 className="mb-3">Edit User</h3>

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
          placeholder="Password"
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
  )
}

export default UserEdit
